import type { ScheduleRule } from '../types'

export const defaultScheduleRules: ScheduleRule[] = [
  {
    id: 'r1',
    type: 'every_n_hours',
    medicationId: 'nurofen',
    everyNHours: 8,
    isStartRule: true,
  },
  {
    id: 'r2',
    type: 'after_medication',
    medicationId: 'panadol',
    afterMedicationId: 'nurofen',
    hoursAfter: 4,
  },
  {
    id: 'r6',
    type: 'once_per_day',
    medicationId: 'vitamina_d',
  },
  {
    id: 'r7',
    type: 'once_per_day',
    medicationId: 'vitamina_c',
  },
  {
    id: 'r8',
    type: 'times_per_day',
    medicationId: 'virodep',
    timesPerDay: 2,
  },
  {
    id: 'r9',
    type: 'times_per_day',
    medicationId: 'greentus',
    timesPerDay: 3,
  },
]

/** Drop the default duplicate Panadol q8h (r3) and rescue-suppository standing rules (r4/r5) if still unmodified. */
export function migrateScheduleRules(rules: ScheduleRule[]): ScheduleRule[] {
  return rules.filter((rule) => {
    if (
      rule.id === 'r3' &&
      rule.type === 'every_n_hours' &&
      rule.medicationId === 'panadol' &&
      rule.everyNHours === 8
    ) {
      return false
    }
    if (
      rule.id === 'r4' &&
      rule.type === 'every_n_hours' &&
      rule.medicationId === 'diclofenac' &&
      rule.everyNHours === 12
    ) {
      return false
    }
    if (
      rule.id === 'r5' &&
      rule.type === 'every_n_hours' &&
      rule.medicationId === 'novocalmin' &&
      rule.everyNHours === 12
    ) {
      return false
    }
    return true
  })
}
