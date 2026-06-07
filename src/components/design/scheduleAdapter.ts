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
import { generateSchedule } from '../../utils/scheduleEngine'
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
  // Check whether this medication has any recurring rule at all.
  const hasRule = defaultScheduleRules.some(
    (r) => r.medicationId === medicationId && r.type === 'every_n_hours',
  )
  if (!hasRule) return null

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

  // Ask the engine: project forward from lastAdministeredAt, find the first
  // slot strictly after lastAdministeredAt (i.e. lastAdministeredAt + interval).
  // We use a 48h window to be safe in case interval > 24h.
  const schedule = generateSchedule(lastAdministeredAt, defaultScheduleRules, [medicationId], 48)

  const nextEntry = schedule.find(
    (e) =>
      e.medicationId === medicationId &&
      e.scheduledAt.getTime() > lastAdministeredAt.getTime(),
  )

  if (!nextEntry) {
    // Rule exists but engine produced no future slot (e.g. window too small).
    // Fall back to eligible immediately.
    return now
  }

  // Return the later of the engine-computed next slot and now.
  return new Date(Math.max(nextEntry.scheduledAt.getTime(), now.getTime()))
}
