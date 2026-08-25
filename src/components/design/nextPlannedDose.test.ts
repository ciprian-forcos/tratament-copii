import { describe, it, expect } from 'vitest'
import type { AdministeredDose, Child } from '../../types'
import { nextPlannedDose } from './nextPlannedDose'

const CHILD: Child = {
  id: 'maya',
  name: 'Maya',
  weight: 13,
  years: 2,
  months: 4,
  initial: 'M',
  temp: 38.5,
  enabledMedications: ['nurofen', 'panadol'],
}

const NOW = new Date('2026-06-07T23:00:00')
const FOUR_HOURS_MS = 4 * 3600_000

function dose(
  partial: Partial<AdministeredDose> & Pick<AdministeredDose, 'medicationId' | 'administeredAt'>,
): AdministeredDose {
  return {
    id: partial.id ?? 'd1',
    childId: partial.childId ?? CHILD.id,
    scheduledAt: partial.scheduledAt ?? partial.administeredAt,
    medicationId: partial.medicationId,
    administeredAt: partial.administeredAt,
  }
}

describe('nextPlannedDose', () => {
  it('returns null when the child has no administered doses', () => {
    expect(nextPlannedDose({ child: CHILD, now: NOW, doses: [] })).toBeNull()
  })

  it('ignores doses belonging to another child', () => {
    const doses = [
      dose({
        childId: 'luca',
        medicationId: 'nurofen',
        administeredAt: '2026-06-07T21:00:00',
      }),
    ]
    expect(nextPlannedDose({ child: CHILD, now: NOW, doses })).toBeNull()
  })

  it('after Nurofen, next is Panadol at last dose + 4h', () => {
    const lastAt = new Date('2026-06-07T21:00:00')
    const result = nextPlannedDose({
      child: CHILD,
      now: NOW,
      doses: [dose({ id: 'd1', medicationId: 'nurofen', administeredAt: lastAt.toISOString() })],
    })

    expect(result?.medId).toBe('panadol')
    expect(result?.med).toBe('Panadol Baby')
    expect(result?.at).toEqual(new Date(lastAt.getTime() + FOUR_HOURS_MS))
  })

  it('after Panadol, next is Nurofen at last dose + 4h', () => {
    const lastAt = new Date('2026-06-07T21:00:00')
    const result = nextPlannedDose({
      child: CHILD,
      now: NOW,
      doses: [dose({ medicationId: 'panadol', administeredAt: lastAt.toISOString() })],
    })

    expect(result?.medId).toBe('nurofen')
    expect(result?.med).toBe('Nurofen')
    expect(result?.at).toEqual(new Date(lastAt.getTime() + FOUR_HOURS_MS))
  })

  it('uses the most recent dose when several exist', () => {
    const result = nextPlannedDose({
      child: CHILD,
      now: NOW,
      doses: [
        dose({ id: 'older', medicationId: 'nurofen', administeredAt: '2026-06-07T18:00:00' }),
        dose({ id: 'newer', medicationId: 'panadol', administeredAt: '2026-06-07T21:00:00' }),
      ],
    })

    expect(result?.medId).toBe('nurofen')
    expect(result?.at).toEqual(new Date(new Date('2026-06-07T21:00:00').getTime() + FOUR_HOURS_MS))
  })

  it('clamps a due dose to now when the 4h floor has already elapsed', () => {
    const lastAt = new Date('2026-06-07T18:00:00')
    const result = nextPlannedDose({
      child: CHILD,
      now: NOW,
      doses: [dose({ medicationId: 'nurofen', administeredAt: lastAt.toISOString() })],
    })

    expect(result?.medId).toBe('panadol')
    expect(result?.at).toEqual(NOW)
  })

  it('returns null when the last dose is older than 24h', () => {
    const lastAt = new Date(NOW.getTime() - 25 * 3600_000)
    const result = nextPlannedDose({
      child: CHILD,
      now: NOW,
      doses: [dose({ medicationId: 'nurofen', administeredAt: lastAt.toISOString() })],
    })
    expect(result).toBeNull()
  })
})
