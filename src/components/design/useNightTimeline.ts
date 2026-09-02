import { useRef, useState, useEffect } from 'react'
import { doseStore } from './doseStore'
import type { AdministeredDose } from '../../types'
import { shortMedName } from '../../utils/medicationForm'
import { STRIP_HALF_MS } from './layoutMarks'
import { loadMedications } from './medicineStorage'

export interface NightTimelineEntry {
  at: Date
  med: string
  medId: string
}

/** Anchor the 12h strip to today's 21:00 (or yesterday's 21:00 if now < 21:00). */
export function anchorStrip(now: Date): Date {
  const start = new Date(now)
  start.setHours(21, 0, 0, 0)
  if (now.getTime() < start.getTime()) start.setDate(start.getDate() - 1)
  return start
}

/** Resolve a medication's short display name from the stored catalog. */
function resolveShortName(medId: string): string {
  const med = loadMedications().find((m) => m.id === medId)
  if (!med) return medId
  return shortMedName(med.name)
}

function dosesToEntries(doses: AdministeredDose[]): NightTimelineEntry[] {
  return doses
    .map((d) => ({
      at: new Date(d.administeredAt),
      med: resolveShortName(d.medicationId),
      medId: d.medicationId,
    }))
    .sort((a, b) => a.at.getTime() - b.at.getTime())
}

/** Stable signature for a dose list — used to avoid re-computing when nothing changed. */
function signature(doses: AdministeredDose[]): string {
  return doses.map((d) => `${d.id}:${d.administeredAt}`).join('|')
}

/**
 * Returns administered fever doses for `childId` on the strip axis
 * (now ± 6h), sorted ascending. Program check-offs are excluded so the
 * strip and the episode plan agree. `anchorStrip` (21:00–09:00) is not
 * this window — see `isNightWindow`.
 */
export function useNightTimeline(childId: string, now: Date): NightTimelineEntry[] {
  const sinceMs = now.getTime() - STRIP_HALF_MS
  const untilMs = now.getTime() + STRIP_HALF_MS

  const cachedRef = useRef<{ sig: string; entries: NightTimelineEntry[] } | null>(null)

  function getEntries(): NightTimelineEntry[] {
    const doses = doseStore
      .listFor(childId, { since: new Date(sinceMs), until: new Date(untilMs) })
      .filter((d) => d.source !== 'program')
    const sig = signature(doses)
    if (cachedRef.current && cachedRef.current.sig === sig) {
      return cachedRef.current.entries
    }
    const entries = dosesToEntries(doses)
    cachedRef.current = { sig, entries }
    return entries
  }

  const [entries, setEntries] = useState<NightTimelineEntry[]>(() => getEntries())

  useEffect(() => {
    setEntries(getEntries())

    const unsubscribe = doseStore.subscribe(() => {
      setEntries(getEntries())
    })
    return unsubscribe
  }, [childId, sinceMs, untilMs])

  return entries
}
