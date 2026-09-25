import type { Child, Medication, ScheduleRule, TimelineFact, TimelineMark } from '../../../types'
import { defaultScheduleRules } from '../../../data/scheduleRules'
import { EPISODE_WINDOW_MS } from '../episode'
import { enabledMedicationIds } from '../enabledMeds'
import { calculateDose, formatDose } from '../../../utils/doseCalculation'
import { shortNameFor } from './shortName'

export const SAME_DRUG_MS = 8 * 3600_000
export const CROSS_DRUG_MS = 4 * 3600_000
export const FEVER_IDS = ['nurofen', 'panadol'] as const
export const MATERIALIZE_MS = 14 * 24 * 3600_000

const FEVER_SET = new Set<string>(FEVER_IDS)

type DoseHit = { medicationId: string; at: Date; factId: string }

function doseHits(facts: TimelineFact[], childId: string): DoseHit[] {
  return facts
    .filter((f) => f.childId === childId && f.payload.kind === 'dose')
    .map((f) => ({
      medicationId: f.payload.kind === 'dose' ? f.payload.medicationId : '',
      at: new Date(f.at),
      factId: f.id,
    }))
    .filter((d) => !Number.isNaN(d.at.getTime()))
    .sort((a, b) => a.at.getTime() - b.at.getTime())
}

function lastFeverInEpisode(hits: DoseHit[], now: Date): DoseHit | null {
  const fever = hits.filter((h) => FEVER_SET.has(h.medicationId))
  if (fever.length === 0) return null
  const latest = fever[fever.length - 1]
  if (now.getTime() - latest.at.getTime() > EPISODE_WINDOW_MS) return null
  return latest
}

function inRange(at: Date, from: Date, to: Date) {
  return at.getTime() >= from.getTime() && at.getTime() < to.getTime()
}

export function doseAmount(medicationId: string, child: Child, medications: Medication[]): string | undefined {
  const med = medications.find((m) => m.id === medicationId)
  if (!med) return undefined
  return formatDose(calculateDose(med, child.weight, child.height), med.doseConfig.unit)
}

function mark(
  at: Date,
  source: TimelineMark['source'],
  medicationId: string,
  child: Child,
  medications: Medication[],
  extra: Partial<TimelineMark> = {},
): TimelineMark {
  return {
    at,
    source,
    kind: 'dose',
    medicationId,
    label: shortNameFor(medicationId, medications),
    amount: doseAmount(medicationId, child, medications),
    ...extra,
  }
}

function projectFever(
  hits: DoseHit[],
  child: Child,
  now: Date,
  from: Date,
  to: Date,
  medications: Medication[],
): TimelineMark[] {
  const last = lastFeverInEpisode(hits, now)
  if (!last) return []

  let medId = last.medicationId === 'nurofen' ? 'panadol' : 'nurofen'
  let t = new Date(Math.max(now.getTime(), last.at.getTime() + CROSS_DRUG_MS))
  const out: TimelineMark[] = []

  while (t.getTime() < to.getTime()) {
    if (inRange(t, from, to)) {
      out.push(mark(new Date(t), 'projected', medId, child, medications, { policy: 'fever-4h' }))
    }
    medId = medId === 'nurofen' ? 'panadol' : 'nurofen'
    t = new Date(t.getTime() + CROSS_DRUG_MS)
  }
  return out
}

function hasFactThatDay(hits: DoseHit[], medicationId: string, day: Date) {
  const y = day.getFullYear()
  const m = day.getMonth()
  const d = day.getDate()
  return hits.some(
    (h) =>
      h.medicationId === medicationId &&
      h.at.getFullYear() === y &&
      h.at.getMonth() === m &&
      h.at.getDate() === d,
  )
}

function atLocalHour(day: Date, hours: number, minutes = 0) {
  const t = new Date(day)
  t.setHours(hours, minutes, 0, 0)
  return t
}

function projectProgram(
  hits: DoseHit[],
  child: Child,
  enabled: string[],
  rules: ScheduleRule[],
  now: Date,
  from: Date,
  to: Date,
  medications: Medication[],
): TimelineMark[] {
  const out: TimelineMark[] = []
  const enabledSet = new Set(enabled)

  for (const rule of rules) {
    if (!enabledSet.has(rule.medicationId)) continue
    if (FEVER_SET.has(rule.medicationId)) continue

    if (rule.type === 'once_per_day') {
      const cursor = atLocalHour(from, 9)
      if (cursor.getTime() < from.getTime()) cursor.setDate(cursor.getDate() + 1)
      for (let t = cursor; t.getTime() < to.getTime(); t = new Date(t.getTime() + 24 * 3600_000)) {
        if (hasFactThatDay(hits, rule.medicationId, t)) continue
        if (t.getTime() < now.getTime() - 60_000) continue
        out.push(mark(new Date(t), 'projected', rule.medicationId, child, medications, { policy: rule.id }))
      }
    }

    if (rule.type === 'every_n_hours') {
      const forMed = hits.filter((h) => h.medicationId === rule.medicationId)
      const interval = rule.everyNHours * 3600_000
      let t =
        forMed.length > 0
          ? new Date(forMed[forMed.length - 1].at.getTime() + interval)
          : now
      t = new Date(Math.max(t.getTime(), now.getTime()))
      while (t.getTime() < to.getTime()) {
        if (inRange(t, from, to)) {
          out.push(mark(new Date(t), 'projected', rule.medicationId, child, medications, { policy: rule.id }))
        }
        t = new Date(t.getTime() + interval)
      }
    }

    if (rule.type === 'times_per_day') {
      const interval = (24 * 3600_000) / rule.timesPerDay
      const forMed = hits.filter((h) => h.medicationId === rule.medicationId)
      let t =
        forMed.length > 0
          ? new Date(forMed[forMed.length - 1].at.getTime() + interval)
          : atLocalHour(now, 9)
      t = new Date(Math.max(t.getTime(), now.getTime()))
      while (t.getTime() < to.getTime()) {
        if (inRange(t, from, to)) {
          out.push(mark(new Date(t), 'projected', rule.medicationId, child, medications, { policy: rule.id }))
        }
        t = new Date(t.getTime() + interval)
      }
    }
  }

  return out
}

export function projectRange({
  child,
  facts,
  medications,
  from,
  to,
  now,
  rules = defaultScheduleRules,
}: {
  child: Child
  facts: TimelineFact[]
  medications: Medication[]
  from: Date
  to: Date
  now: Date
  rules?: ScheduleRule[]
}): TimelineMark[] {
  const hits = doseHits(facts, child.id)
  const factMarks = hits
    .filter((h) => inRange(h.at, from, to))
    .map((h) => mark(h.at, 'fact', h.medicationId, child, medications, { factId: h.factId }))

  const fever = projectFever(hits, child, now, from, to, medications)
  const enabled = enabledMedicationIds(child, medications)
  const program = projectProgram(hits, child, enabled, rules, now, from, to, medications)

  const all = [...factMarks, ...fever, ...program]
  all.sort((a, b) => a.at.getTime() - b.at.getTime())
  return all
}

export function nextProjectedDose(marks: TimelineMark[]): TimelineMark | null {
  const upcoming = marks.filter(
    (m) => m.source === 'projected' && FEVER_SET.has(m.medicationId),
  )
  if (upcoming.length === 0) return null
  return upcoming.reduce((a, b) => (a.at.getTime() <= b.at.getTime() ? a : b))
}

export function materializeWindow(now: Date): { from: Date; to: Date } {
  return {
    from: new Date(now.getTime() - MATERIALIZE_MS),
    to: new Date(now.getTime() + MATERIALIZE_MS),
  }
}
