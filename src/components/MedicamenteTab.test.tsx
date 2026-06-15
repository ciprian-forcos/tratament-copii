import { describe, expect, it, beforeEach } from 'vitest'
import { DEFAULT_MEDICATIONS } from '../data/medications'
import type { Medication } from '../types'
import { loadMedications, MEDICATIONS_KEY, saveMedications } from './design/medicineStorage'

describe('Medicamente storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('uses the default antipyretics when medicine storage is absent', () => {
    const names = loadMedications().map((med) => med.name).join(' ')

    expect(names).toMatch(/Nurofen/i)
    expect(names).toMatch(/Panadol/i)
    expect(names).toMatch(/Novocalmin/i)
    expect(localStorage.getItem(MEDICATIONS_KEY)).toBeNull()
  })

  it('saves and reloads medicine edits through the shared medicine key', () => {
    const custom: Medication = {
      id: 'test-sirop',
      name: 'Test sirop',
      doseType: 'fixed',
      doseConfig: { type: 'fixed', amount: '5', unit: 'ml' },
      color: '#3b82f6',
      notes: '',
    }

    saveMedications([...DEFAULT_MEDICATIONS, custom])

    expect(localStorage.getItem(MEDICATIONS_KEY)).toContain('Test sirop')
    expect(loadMedications()).toContainEqual(custom)
  })
})
