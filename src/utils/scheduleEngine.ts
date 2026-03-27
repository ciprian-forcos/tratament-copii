import type { ScheduleRule } from '../types'

export interface ScheduleEntry {
  medicationId: string
  scheduledAt: Date
}

/**
 * Generate all scheduled dose times within a 24-hour window starting at startTime.
 *
 * Rule types:
 *   every_n_hours  — repeat from startTime every N hours
 *   once_per_day   — single entry at startTime
 *   times_per_day  — N evenly-spaced entries across the 24h window
 *   after_medication — N hours after each computed dose of the referenced medication
 */
export function generateSchedule(
  startTime: Date,
  rules: ScheduleRule[],
  enabledMedicationIds: string[],
  windowHours = 24,
): ScheduleEntry[] {
  const windowMs = windowHours * 60 * 60 * 1000
  const endMs = startTime.getTime() + windowMs

  const enabledSet = new Set(enabledMedicationIds)
  const activeRules = rules.filter(r => enabledSet.has(r.medicationId))

  const entries: ScheduleEntry[] = []

  // First pass: resolve every_n_hours, once_per_day, times_per_day
  for (const rule of activeRules) {
    if (rule.type === 'every_n_hours') {
      const intervalMs = rule.everyNHours * 60 * 60 * 1000
      let t = startTime.getTime()
      while (t < endMs) {
        entries.push({ medicationId: rule.medicationId, scheduledAt: new Date(t) })
        t += intervalMs
      }
    } else if (rule.type === 'once_per_day') {
      entries.push({ medicationId: rule.medicationId, scheduledAt: new Date(startTime) })
    } else if (rule.type === 'times_per_day') {
      const intervalMs = windowMs / rule.timesPerDay
      for (let i = 0; i < rule.timesPerDay; i++) {
        const t = startTime.getTime() + i * intervalMs
        if (t < endMs) {
          entries.push({ medicationId: rule.medicationId, scheduledAt: new Date(t) })
        }
      }
    }
  }

  // Second pass: resolve after_medication rules using first-pass results
  for (const rule of activeRules) {
    if (rule.type === 'after_medication') {
      const refTimes = entries
        .filter(e => e.medicationId === rule.afterMedicationId)
        .map(e => e.scheduledAt.getTime())

      for (const refMs of refTimes) {
        const t = refMs + rule.hoursAfter * 60 * 60 * 1000
        if (t >= startTime.getTime() && t < endMs) {
          entries.push({ medicationId: rule.medicationId, scheduledAt: new Date(t) })
        }
      }
    }
  }

  entries.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())

  return entries
}
