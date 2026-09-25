import { describe, it, expect } from 'vitest'
import type { Child, TimelineFact } from '../../../types'
import { DEFAULT_MEDICATIONS } from '../../../data/medications'
import { CROSS_DRUG_MS, nextProjectedDose, projectRange } from './project'

const CHILD: Child = {
  id: 'maya',
  name: 'Maya',
  weight: 13,
  years: 2,
  months: 4,
  initial: 'M',
  enabledMedications: ['nurofen', 'panadol', 'vitamina_d'],
}

const NOW = new Date('2026-06-07T23:00:00')

function doseFact(medicationId: string, at: string, id = 'e1'): TimelineFact {
  return {
    id,
    childId: CHILD.id,
    at,
    payload: { kind: 'dose', medicationId, source: 'given' },
  }
}

describe('projectRange', () => {
  it('returns no fever projections without in-episode history', () => {
    const marks = projectRange({
      child: CHILD,
      facts: [],
      medications: DEFAULT_MEDICATIONS,
      now: NOW,
      from: new Date(NOW.getTime() - 6 * 3600_000),
      to: new Date(NOW.getTime() + 6 * 3600_000),
    })
    expect(marks.filter((m) => m.source === 'projected' && m.policy === 'fever-4h')).toHaveLength(0)
  })

  it('after Nurofen, projects Panadol at last + 4h', () => {
    const lastAt = new Date('2026-06-07T21:00:00')
    const marks = projectRange({
      child: CHILD,
      facts: [doseFact('nurofen', lastAt.toISOString())],
      medications: DEFAULT_MEDICATIONS,
      now: NOW,
      from: new Date(NOW.getTime() - 6 * 3600_000),
      to: new Date(NOW.getTime() + 12 * 3600_000),
    })

    const facts = marks.filter((m) => m.source === 'fact')
    expect(facts).toHaveLength(1)
    expect(facts[0].label).toMatch(/Nurofen/)

    const next = nextProjectedDose(marks)!
    expect(next.medicationId).toBe('panadol')
    expect(next.amount).toBe('8 ml')
    expect(next.at.getTime()).toBe(lastAt.getTime() + CROSS_DRUG_MS)
  })

  it('when the 4h floor has elapsed, next projected dose is at now', () => {
    const lastAt = new Date('2026-06-07T18:00:00')
    const marks = projectRange({
      child: CHILD,
      facts: [doseFact('nurofen', lastAt.toISOString())],
      medications: DEFAULT_MEDICATIONS,
      now: NOW,
      from: new Date(NOW.getTime() - 6 * 3600_000),
      to: new Date(NOW.getTime() + 6 * 3600_000),
    })
    const next = nextProjectedDose(marks)!
    expect(next.at.getTime()).toBe(NOW.getTime())
    expect(next.medicationId).toBe('panadol')
  })

  it('ignores another child\'s doses', () => {
    const marks = projectRange({
      child: CHILD,
      facts: [
        {
          id: 'x',
          childId: 'luca',
          at: '2026-06-07T21:00:00',
          payload: { kind: 'dose', medicationId: 'nurofen', source: 'given' },
        },
      ],
      medications: DEFAULT_MEDICATIONS,
      now: NOW,
      from: new Date(NOW.getTime() - 6 * 3600_000),
      to: new Date(NOW.getTime() + 6 * 3600_000),
    })
    expect(nextProjectedDose(marks)).toBeNull()
    expect(marks.filter((m) => m.source === 'fact')).toHaveLength(0)
  })

  it('does not paint temperature facts as marks', () => {
    const marks = projectRange({
      child: CHILD,
      facts: [
        {
          id: 't1',
          childId: CHILD.id,
          at: '2026-06-07T22:10:00',
          payload: { kind: 'temperature', celsius: 38.4 },
        },
      ],
      medications: DEFAULT_MEDICATIONS,
      now: NOW,
      from: new Date(NOW.getTime() - 6 * 3600_000),
      to: new Date(NOW.getTime() + 6 * 3600_000),
    })
    expect(marks).toHaveLength(0)
  })
})
