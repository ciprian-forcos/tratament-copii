import { useRef, useState, useEffect } from 'react'
import { doseStore } from './doseStore'
import type { AdministeredDose } from '../../types'
import { DEFAULT_MEDICATIONS } from '../../data/medications'

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

/** Resolve a medication's short display name from DEFAULT_MEDICATIONS.
 *  Short name is the text before the first '/' or '(' character.
 *  Falls back to medId if the medication is not found. */
function resolveShortName(medId: string): string {
  const med = DEFAULT_MEDICATIONS.find((m) => m.id === medId)
  if (!med) return medId
  const match = med.name.match(/^([^/(]+)/)
  return match ? match[1].trim() : med.name.trim()
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
 * Returns the administered doses for `childId` that fall within the
 * current 12-hour night window (anchor 21:00 → 09:00), sorted ascending.
 */
export function useNightTimeline(childId: string, now: Date): NightTimelineEntry[] {
  const since = anchorStrip(now)
  const until = new Date(since.getTime() + 12 * 3600_000)

  const cachedRef = useRef<{ sig: string; entries: NightTimelineEntry[] } | null>(null)

  function getEntries(): NightTimelineEntry[] {
    const doses = doseStore.listFor(childId, { since, until })
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
    // Update immediately in case childId/now changed between render and effect
    setEntries(getEntries())

    const unsubscribe = doseStore.subscribe(() => {
      setEntries(getEntries())
    })
    return unsubscribe
  }, [childId, since.getTime()])

  return entries
}
