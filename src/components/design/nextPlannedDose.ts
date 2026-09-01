import type { AdministeredDose, Child } from '../../types'
import { buildPlan } from './dosePlan'
import { lastDoseInEpisode } from './episode'

export type NextPlannedDose = {
  at: Date
  med: string
  medId: string
}

/**
 * Next medicine the parent should give, derived from recorded history.
 * Uses the same planner as the plan card (alternation + 4h cross-drug floor).
 * No in-episode history for this child → null (Home stays in "start treatment").
 */
export function nextPlannedDose({
  child,
  now,
  doses,
}: {
  child: Child
  now: Date
  doses: AdministeredDose[]
}): NextPlannedDose | null {
  const last = lastDoseInEpisode({ now, doses, childId: child.id })
  if (!last) return null

  const plan = buildPlan({
    child,
    now,
    lastMedId: last.medicationId,
    lastAt: last.at,
  })
  if (!plan) return null

  return {
    at: plan.now.when,
    med: plan.now.medName,
    medId: plan.now.medId,
  }
}
