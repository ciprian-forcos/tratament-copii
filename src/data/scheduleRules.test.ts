import { describe, expect, it } from 'vitest'
import { defaultScheduleRules, migrateScheduleRules } from './scheduleRules'
import type { ScheduleRule } from '../types'

describe('defaultScheduleRules', () => {
  it('does not stack a duplicate Panadol every-8h start rule', () => {
    expect(defaultScheduleRules.some((r) => r.id === 'r3')).toBe(false)
    expect(
      defaultScheduleRules.filter((r) => r.medicationId === 'panadol'),
    ).toEqual([
      expect.objectContaining({
        id: 'r2',
        type: 'after_medication',
        afterMedicationId: 'nurofen',
      }),
    ])
  })

  it('does not put rescue suppositories on the standing program', () => {
    expect(defaultScheduleRules.some((r) => r.medicationId === 'diclofenac')).toBe(false)
    expect(defaultScheduleRules.some((r) => r.medicationId === 'novocalmin')).toBe(false)
  })
})

describe('migrateScheduleRules', () => {
  it('drops unmodified default r3/r4/r5', () => {
    const stored: ScheduleRule[] = [
      { id: 'r1', type: 'every_n_hours', medicationId: 'nurofen', everyNHours: 8, isStartRule: true },
      { id: 'r3', type: 'every_n_hours', medicationId: 'panadol', everyNHours: 8 },
      { id: 'r4', type: 'every_n_hours', medicationId: 'diclofenac', everyNHours: 12 },
      { id: 'r5', type: 'every_n_hours', medicationId: 'novocalmin', everyNHours: 12 },
    ]
    expect(migrateScheduleRules(stored).map((r) => r.id)).toEqual(['r1'])
  })
})
