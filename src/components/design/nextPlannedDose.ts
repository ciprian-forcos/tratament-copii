import type { AdministeredDose, Child } from '../../types'
import { buildPlan } from './dosePlan'

export type NextPlannedDose = {
  at: Date
  med: string
  medId: string
}

function latestDoseFor(childId: string, doses: AdministeredDose[]): AdministeredDose | null {
  const forChild = doses.filter((d) => d.childId === childId)
  if (forChild.length === 0) return null
  return forChild.reduce((latest, d) =>
    new Date(d.administeredAt).getTime() > new Date(latest.administeredAt).getTime() ? d : latest,
  )
}

/**
 * Next medicine the parent should give, derived from recorded history.
 * Uses the same planner as the plan card (alternation + 4h cross-drug floor).
 * No history for this child → null (Home stays in "start treatment").
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
  const last = latestDoseFor(child.id, doses)
  if (!last) return null

  const lastAt = new Date(last.administeredAt)
  if (Number.isNaN(lastAt.getTime())) return null

  const plan = buildPlan({
    child,
    now,
    lastMedId: last.medicationId,
    lastAt,
  })

  return {
    at: plan.now.when,
    med: plan.now.medName,
    medId: plan.now.medId,
  }
}
