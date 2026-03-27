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
    hoursAfter: 3,
  },
  {
    id: 'r3',
    type: 'every_n_hours',
    medicationId: 'panadol',
    everyNHours: 6,
  },
  {
    id: 'r4',
    type: 'every_n_hours',
    medicationId: 'diclofenac',
    everyNHours: 12,
  },
  {
    id: 'r5',
    type: 'every_n_hours',
    medicationId: 'novocalmin',
    everyNHours: 12,
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
