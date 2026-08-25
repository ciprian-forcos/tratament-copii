import { describe, it, expect } from 'vitest'
import type { AdministeredDose } from '../../types'
import {
  alreadyRecorded,
  EPISODE_WINDOW_MS,
  lastDoseInEpisode,
  seedFromStep2,
} from './episode'

const NOW = new Date('2026-06-07T23:00:00')

function dose(
  partial: Partial<AdministeredDose> & Pick<AdministeredDose, 'medicationId' | 'administeredAt'>,
): AdministeredDose {
  return {
    id: partial.id ?? 'd1',
    childId: partial.childId ?? 'maya',
    scheduledAt: partial.scheduledAt ?? partial.administeredAt,
    medicationId: partial.medicationId,
    administeredAt: partial.administeredAt,
  }
}

describe('seedFromStep2', () => {
  it('returns null for first treatment', () => {
    expect(seedFromStep2({ kind: 'first' })).toBeNull()
  })

  it('reads medication and datetime from last-dose mode', () => {
    const seed = seedFromStep2({
      kind: 'last',
      med: 'nurofen',
      lastAt: '2026-06-07T21:00',
    })
    expect(seed?.medicationId).toBe('nurofen')
    expect(seed?.at).toEqual(new Date('2026-06-07T21:00'))
  })
})

describe('lastDoseInEpisode', () => {
  it('returns null when there is no history and no seed', () => {
    expect(lastDoseInEpisode({ now: NOW, doses: [], childId: 'maya' })).toBeNull()
  })

  it('uses the latest stored dose for this child', () => {
    const result = lastDoseInEpisode({
      now: NOW,
      childId: 'maya',
      doses: [
        dose({ id: 'older', medicationId: 'nurofen', administeredAt: '2026-06-07T18:00:00' }),
        dose({ id: 'newer', medicationId: 'panadol', administeredAt: '2026-06-07T21:00:00' }),
      ],
    })
    expect(result?.medicationId).toBe('panadol')
    expect(result?.at).toEqual(new Date('2026-06-07T21:00:00'))
  })

  it('prefers a later Step 2 seed over stored history', () => {
    const result = lastDoseInEpisode({
      now: NOW,
      childId: 'maya',
      doses: [dose({ medicationId: 'nurofen', administeredAt: '2026-06-07T18:00:00' })],
      seed: { medicationId: 'panadol', at: new Date('2026-06-07T21:00:00') },
    })
    expect(result?.medicationId).toBe('panadol')
  })

  it('ignores another child', () => {
    const result = lastDoseInEpisode({
      now: NOW,
      childId: 'maya',
      doses: [dose({ childId: 'luca', medicationId: 'nurofen', administeredAt: '2026-06-07T21:00:00' })],
    })
    expect(result).toBeNull()
  })

  it('returns null when the latest dose is older than 24h', () => {
    const administeredAt = new Date(NOW.getTime() - EPISODE_WINDOW_MS - 60_000).toISOString()
    const result = lastDoseInEpisode({
      now: NOW,
      childId: 'maya',
      doses: [dose({ medicationId: 'nurofen', administeredAt })],
    })
    expect(result).toBeNull()
  })

  it('keeps a Step 2 seed that is still inside the 24h window', () => {
    const old = new Date(NOW.getTime() - EPISODE_WINDOW_MS - 60_000).toISOString()
    const result = lastDoseInEpisode({
      now: NOW,
      childId: 'maya',
      doses: [dose({ medicationId: 'nurofen', administeredAt: old })],
      seed: { medicationId: 'panadol', at: new Date('2026-06-07T21:00:00') },
    })
    expect(result?.medicationId).toBe('panadol')
  })
})

describe('alreadyRecorded', () => {
  it('matches the same child, medicine, and minute', () => {
    const doses = [dose({ medicationId: 'nurofen', administeredAt: '2026-06-07T21:00:00' })]
    expect(
      alreadyRecorded(doses, 'maya', {
        medicationId: 'nurofen',
        at: new Date('2026-06-07T21:00:30'),
      }),
    ).toBe(true)
  })

  it('does not match a different medicine', () => {
    const doses = [dose({ medicationId: 'nurofen', administeredAt: '2026-06-07T21:00:00' })]
    expect(
      alreadyRecorded(doses, 'maya', {
        medicationId: 'panadol',
        at: new Date('2026-06-07T21:00:00'),
      }),
    ).toBe(false)
  })
})
