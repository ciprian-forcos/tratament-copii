/**
 * scheduleAdapter — thin translation layer between doseStore history and
 * the scheduleEngine's per-medication interval rules.
 *
 * Public API: nextDoseFor({ medicationId, childId, now })
 *
 * Naming note: FINDINGS.md proposed `earliestRepeat` with an explicit
 * `lastAdministeredAt` arg. The plan (03-02) and buildPlan's call-site both
 * require `nextDoseFor({ medicationId, childId, now })` that reads doseStore
 * internally. We implement the plan's public signature here, keeping the
 * FINDINGS logic (engine-driven interval, max(engineSlot, now)).
 */
import { defaultScheduleRules } from '../../data/scheduleRules'
import { doseStore } from './doseStore'

/**
 * Return the earliest safe time to administer `medicationId` again for
 * `childId`, according to the per-med schedule rule.
 *
 * - No history for this med → returns `now` (eligible immediately).
 * - Med has no recurring rule → returns `null` (policy caller must decide).
 * - Has history → returns max(engineNextSlot, now).
 *
 * Never calls new Date() internally — `now` is always injected.
 */
export function nextDoseFor({
  medicationId,
  childId,
  now,
}: {
  medicationId: string
  childId: string
  now: Date
}): Date | null {
  const intervalHours = sameDrugIntervalHours(medicationId)
  if (intervalHours == null) return null

  // Find the most recent administered dose for this medication.
  const allDoses = doseStore.listFor(childId)
  const forMed = allDoses.filter((d) => d.medicationId === medicationId)

  if (forMed.length === 0) {
    // No history → eligible immediately.
    return now
  }

  // Pick the latest administered dose.
  const lastDose = forMed.reduce((latest, d) =>
    new Date(d.administeredAt).getTime() > new Date(latest.administeredAt).getTime()
      ? d
      : latest,
  )
  const lastAdministeredAt = new Date(lastDose.administeredAt)
  const nextFromRule = new Date(lastAdministeredAt.getTime() + intervalHours * 3600_000)
  return new Date(Math.max(nextFromRule.getTime(), now.getTime()))
}

/** Same-drug floor. Panadol keeps 8h even after the duplicate Program q8h rule (r3) was removed. */
function sameDrugIntervalHours(medicationId: string): number | null {
  const rule = defaultScheduleRules.find(
    (r) => r.medicationId === medicationId && r.type === 'every_n_hours',
  )
  if (rule && rule.type === 'every_n_hours') return rule.everyNHours
  if (medicationId === 'panadol') return 8
  return null
}
