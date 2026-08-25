import { describe, it, expect } from 'vitest'
import type { Child, Medication } from '../../types'
import { enabledMedicationIds, toggleEnabledMedication } from './enabledMeds'

const meds = [
  { id: 'nurofen', name: 'Nurofen' },
  { id: 'panadol', name: 'Panadol' },
] as Medication[]

const child = (enabled: string[]): Child => ({
  id: 'maya',
  name: 'Maya',
  weight: 13,
  enabledMedications: enabled,
})

describe('enabledMedicationIds', () => {
  it('returns none when the child has an empty list', () => {
    expect(enabledMedicationIds(child([]), meds)).toEqual([])
  })

  it('drops unknown ids', () => {
    expect(enabledMedicationIds(child(['nurofen', 'ghost']), meds)).toEqual(['nurofen'])
  })
})

describe('toggleEnabledMedication', () => {
  it('adds a missing id', () => {
    expect(toggleEnabledMedication(child(['nurofen']), 'panadol')).toEqual(['nurofen', 'panadol'])
  })

  it('removes an enabled id', () => {
    expect(toggleEnabledMedication(child(['nurofen', 'panadol']), 'nurofen')).toEqual(['panadol'])
  })
})
