import type { Child, Medication } from '../../types'
import { DEFAULT_MEDICATIONS } from '../../data/medications'
import { calculateDose } from '../../utils/doseCalculation'
import { nextDoseFor } from './scheduleAdapter'

/** Choose the medication object by short id used in the design's MEDS list. */
function findMed(id: string): Medication | undefined {
  return DEFAULT_MEDICATIONS.find((m) => m.id === id)
}

/** Minimum cross-drug spacing (ibuprofen ↔ paracetamol alternation policy). */
const MIN_CROSS_DRUG_GAP_MS = 7_200_000 // 2 hours in ms

export interface PlannedStep {
  medId: string
  medName: string
  amount: number | 'sub_doza'
  unit: string
  when: Date
  note: string
}

export interface Plan {
  now: PlannedStep
  next: PlannedStep
}

/**
 * Decide the alternation rule: ibuprofen ↔ paracetamol, ~2h spacing.
 *
 * If `lastMedId` is given, the "now" dose is the *other* of the pair.
 * If not (first treatment), start with Nurofen now.
 *
 * The "next" step time is driven by the schedule engine via nextDoseFor,
 * with a 2h cross-drug spacing floor applied on top.
 */
export function buildPlan({
  child,
  now,
  lastMedId,
  lastAtHHMM,
}: {
  child: Child
  now: Date
  lastMedId?: string
  lastAtHHMM?: string
}): Plan {
  const isIbu = (id?: string) => id === 'nurofen'
  const isPara = (id?: string) => id === 'panadol'

  // Choose "now" medication.
  let nowMedId = 'nurofen'
  if (isIbu(lastMedId)) nowMedId = 'panadol'
  else if (isPara(lastMedId)) nowMedId = 'nurofen'

  // Honour the explicit "last given at" time when computing the next slot.
  // Otherwise, "now" is now.
  let lastAt: Date | null = null
  if (lastAtHHMM && /^\d{1,2}:\d{2}$/.test(lastAtHHMM)) {
    const [h, m] = lastAtHHMM.split(':').map((x) => parseInt(x, 10))
    const d = new Date(now)
    d.setHours(h, m, 0, 0)
    // If the "last" time is in the future today, treat it as yesterday.
    if (d.getTime() > now.getTime()) d.setDate(d.getDate() - 1)
    lastAt = d
  }

  // "Now" step: target time is now (or +2h after lastAt if that's still in the future).
  const nowTarget = lastAt ? new Date(Math.max(now.getTime(), lastAt.getTime() + MIN_CROSS_DRUG_GAP_MS)) : now

  // "Next" step: alternating med, scheduled by the engine.
  // The 2h cross-drug spacing floor is a hard minimum; the engine-computed
  // safe interval for the same drug (8h nurofen / 6h panadol) may be longer.
  const nextMedId = nowMedId === 'nurofen' ? 'panadol' : 'nurofen'
  const twoHFloor = new Date(nowTarget.getTime() + MIN_CROSS_DRUG_GAP_MS)
  const engineNext = nextDoseFor({ medicationId: nextMedId, childId: child.id, now: twoHFloor })
  const nextTarget = engineNext != null
    ? new Date(Math.max(engineNext.getTime(), twoHFloor.getTime()))
    : twoHFloor

  const nowMed = findMed(nowMedId)!
  const nextMed = findMed(nextMedId)!

  return {
    now: {
      medId: nowMedId,
      medName: shortName(nowMed),
      amount: calculateDose(nowMed, child.weight),
      unit: nowMed.doseConfig.unit,
      when: nowTarget,
      note: 'sirop · cu seringa',
    },
    next: {
      medId: nextMedId,
      medName: shortName(nextMed),
      amount: calculateDose(nextMed, child.weight),
      unit: nextMed.doseConfig.unit,
      when: nextTarget,
      note: 'alternăm, ca să nu suprapunem.',
    },
  }
}

function shortName(med: Medication): string {
  // "Nurofen/Algin (Ibuprofen 100mg/5ml)" → "Nurofen"
  return med.name.split(/[/(]/)[0].trim()
}

export function fmtHHMM(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function diffHHMM(from: Date, to: Date): string {
  const ms = to.getTime() - from.getTime()
  if (ms <= 0) return '0m'
  const totalMin = Math.round(ms / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}
