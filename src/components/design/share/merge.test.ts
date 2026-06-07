import { describe, it, expect } from 'vitest'
import type { Child, Medication } from '../../../types'
import { mergeChildren, mergeMedications } from './merge'
import type { MergeSummary } from './merge'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const maya: Child = {
  id: 'maya',
  name: 'Maya',
  weight: 13,
  years: 2,
  months: 4,
  initial: 'M',
  temp: 39.5,
  enabledMedications: ['nurofen'],
}

const mayaIncoming: Child = {
  id: 'maya',
  name: 'Maya Updated',
  weight: 14,
  years: 2,
  months: 5,
  initial: 'M',
  // no temp — stripped at encode time
  enabledMedications: ['nurofen', 'panadol'],
}

const luca: Child = {
  id: 'luca',
  name: 'Luca',
  weight: 20,
  years: 5,
  months: 0,
  initial: 'L',
  enabledMedications: [],
}

const ana: Child = {
  id: 'ana',
  name: 'Ana',
  weight: 10,
  years: 1,
  months: 6,
  initial: 'A',
  enabledMedications: [],
}

const med1: Medication = {
  id: 'm1',
  name: 'Nurofen',
  doseType: 'mg_per_kg',
  doseConfig: { type: 'mg_per_kg', mgPerKgPerDay: 30, dosesPerDay: 3, concentrationMg: 100, unit: 'ml', roundTo: 'half' },
  color: '#f59e0b',
  notes: '',
}

const med2: Medication = {
  id: 'm2',
  name: 'Panadol',
  doseType: 'mg_per_kg',
  doseConfig: { type: 'mg_per_kg', mgPerKgPerDay: 60, dosesPerDay: 4, concentrationMg: 120, unit: 'ml', roundTo: 'half' },
  color: '#3b82f6',
  notes: '',
}

const med1Updated: Medication = { ...med1, name: 'Nurofen Updated', color: '#e11d48' }

// ---------------------------------------------------------------------------
// mergeChildren
// ---------------------------------------------------------------------------

describe('mergeChildren', () => {
  it('empty local + incoming → all are added', () => {
    const { merged, summary } = mergeChildren([], [luca, ana])
    expect(merged).toHaveLength(2)
    expect(merged.map((c) => c.id)).toEqual(['luca', 'ana'])
    expect(summary.added).toEqual(['Luca', 'Ana'])
    expect(summary.updated).toEqual([])
    expect(summary.unchanged).toEqual([])
  })

  it('local only, no incoming → all unchanged', () => {
    const { merged, summary } = mergeChildren([maya, luca], [])
    expect(merged).toHaveLength(2)
    expect(summary.added).toEqual([])
    expect(summary.updated).toEqual([])
    expect(summary.unchanged).toEqual(['Maya', 'Luca'])
  })

  it('matching id → incoming overwrites fields', () => {
    const { merged, summary } = mergeChildren([maya], [mayaIncoming])
    expect(merged).toHaveLength(1)
    expect(merged[0].name).toBe('Maya Updated')
    expect(merged[0].weight).toBe(14)
    expect(merged[0].months).toBe(5)
    expect(merged[0].enabledMedications).toEqual(['nurofen', 'panadol'])
    expect(summary.updated).toEqual(['Maya Updated'])
    expect(summary.added).toEqual([])
    expect(summary.unchanged).toEqual([])
  })

  it('preserves local temp when incoming lacks temp (privacy rule)', () => {
    // maya has temp: 39.5, mayaIncoming has no temp
    const { merged } = mergeChildren([maya], [mayaIncoming])
    expect(merged[0].temp).toBe(39.5)
  })

  it('does NOT preserve local temp when incoming explicitly carries temp', () => {
    const mayaWithNewTemp: Child = { ...mayaIncoming, temp: 38.0 }
    const { merged } = mergeChildren([maya], [mayaWithNewTemp])
    expect(merged[0].temp).toBe(38.0)
  })

  it('new id in incoming is appended after local children', () => {
    const { merged, summary } = mergeChildren([maya], [ana])
    expect(merged).toHaveLength(2)
    expect(merged[0].id).toBe('maya')
    expect(merged[1].id).toBe('ana')
    expect(summary.added).toEqual(['Ana'])
    expect(summary.unchanged).toEqual(['Maya'])
  })

  it('mix: one updated, one new, one unchanged', () => {
    const { merged, summary } = mergeChildren([maya, luca], [mayaIncoming, ana])
    expect(merged).toHaveLength(3)
    expect(summary.updated).toEqual(['Maya Updated'])
    expect(summary.added).toEqual(['Ana'])
    expect(summary.unchanged).toEqual(['Luca'])
  })

  it('unchanged child is detected when incoming equals local (ignoring temp)', () => {
    // local: maya (with temp), incoming: maya without name/weight changes
    const same: Child = {
      id: 'maya',
      name: 'Maya',
      weight: 13,
      years: 2,
      months: 4,
      initial: 'M',
      enabledMedications: ['nurofen'],
    }
    const { summary } = mergeChildren([maya], [same])
    expect(summary.unchanged).toEqual(['Maya'])
    expect(summary.updated).toEqual([])
  })

  it('MergeSummary type: added, updated, unchanged are all arrays of strings', () => {
    const { summary } = mergeChildren([maya, luca], [mayaIncoming, ana])
    const s: MergeSummary = summary
    expect(Array.isArray(s.added)).toBe(true)
    expect(Array.isArray(s.updated)).toBe(true)
    expect(Array.isArray(s.unchanged)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// mergeMedications
// ---------------------------------------------------------------------------

describe('mergeMedications', () => {
  it('empty local + incoming → all added', () => {
    const result = mergeMedications([], [med1, med2])
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('m1')
  })

  it('local only → unchanged', () => {
    const result = mergeMedications([med1], [])
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual(med1)
  })

  it('matching id → incoming overwrites local', () => {
    const result = mergeMedications([med1, med2], [med1Updated])
    expect(result).toHaveLength(2)
    const found = result.find((m) => m.id === 'm1')!
    expect(found.name).toBe('Nurofen Updated')
    expect(found.color).toBe('#e11d48')
  })

  it('new medication in incoming is appended', () => {
    const result = mergeMedications([med1], [med2])
    expect(result).toHaveLength(2)
    expect(result[1].id).toBe('m2')
  })

  it('mix: one updated, one new, one kept', () => {
    const med3: Medication = { ...med1, id: 'm3', name: 'Med3' }
    const result = mergeMedications([med1, med2], [med1Updated, med3])
    expect(result).toHaveLength(3)
    const m1 = result.find((m) => m.id === 'm1')!
    expect(m1.name).toBe('Nurofen Updated')
    const m3 = result.find((m) => m.id === 'm3')!
    expect(m3.name).toBe('Med3')
  })
})
