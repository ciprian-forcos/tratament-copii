import type { AdministeredDose } from '../../types'
import type { Step2Value } from './Step2'

/** A fever episode ends if no dose was given in this window. */
export const EPISODE_WINDOW_MS = 24 * 3600_000

export type DoseRef = {
  medicationId: string
  at: Date
}

export function seedFromStep2(step2: Step2Value): DoseRef | null {
  if (step2.kind !== 'last' || !step2.med || !step2.lastAt) return null
  const at = new Date(step2.lastAt)
  if (Number.isNaN(at.getTime())) return null
  return { medicationId: step2.med, at }
}

export function lastDoseInEpisode({
  now,
  doses,
  childId,
  seed = null,
}: {
  now: Date
  doses: AdministeredDose[]
  childId: string
  seed?: DoseRef | null
}): DoseRef | null {
  const candidates: DoseRef[] = doses
    .filter((d) => d.childId === childId)
    .map((d) => ({ medicationId: d.medicationId, at: new Date(d.administeredAt) }))
    .filter((d) => !Number.isNaN(d.at.getTime()))

  if (seed && !Number.isNaN(seed.at.getTime())) candidates.push(seed)
  if (candidates.length === 0) return null

  const latest = candidates.reduce((a, b) => (a.at.getTime() >= b.at.getTime() ? a : b))
  if (now.getTime() - latest.at.getTime() > EPISODE_WINDOW_MS) return null
  return latest
}

export function alreadyRecorded(
  doses: AdministeredDose[],
  childId: string,
  ref: DoseRef,
  toleranceMs = 60_000,
): boolean {
  return doses.some(
    (d) =>
      d.childId === childId &&
      d.medicationId === ref.medicationId &&
      Math.abs(new Date(d.administeredAt).getTime() - ref.at.getTime()) < toleranceMs,
  )
}
