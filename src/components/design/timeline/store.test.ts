import { describe, it, expect, beforeEach } from 'vitest'
import { doseStore } from '../doseStore'
import { FACTS_KEY, timelineStore } from './store'

describe('timelineStore', () => {
  beforeEach(() => {
    timelineStore.clear()
    doseStore.clear()
    localStorage.clear()
    timelineStore.reloadFromStorage()
  })

  it('appends a dose fact and dual-writes administered-doses', () => {
    const fact = timelineStore.append({
      childId: 'maya',
      at: '2026-06-07T21:00:00.000Z',
      payload: { kind: 'dose', medicationId: 'nurofen', source: 'given' },
    })

    expect(timelineStore.listFor('maya')).toHaveLength(1)
    expect(doseStore.list()).toHaveLength(1)
    expect(doseStore.list()[0].id).toBe(fact.id)
    expect(JSON.parse(localStorage.getItem(FACTS_KEY)!)).toHaveLength(1)
  })

  it('lifts existing administered doses when facts are empty', () => {
    doseStore.record({
      childId: 'maya',
      medicationId: 'panadol',
      scheduledAt: '2026-06-07T22:00:00.000Z',
      administeredAt: '2026-06-07T22:00:00.000Z',
    })
    timelineStore.reloadFromStorage()

    const facts = timelineStore.listFor('maya')
    expect(facts).toHaveLength(1)
    expect(facts[0].payload).toMatchObject({ kind: 'dose', medicationId: 'panadol' })
  })

  it('stores temperature without writing a dose', () => {
    timelineStore.append({
      childId: 'maya',
      at: '2026-06-07T22:10:00.000Z',
      payload: { kind: 'temperature', celsius: 38.4 },
    })
    expect(doseStore.list()).toHaveLength(0)
    expect(timelineStore.listFor('maya')[0].payload.kind).toBe('temperature')
  })

  it('filters by child', () => {
    timelineStore.append({
      childId: 'maya',
      at: '2026-06-07T21:00:00.000Z',
      payload: { kind: 'dose', medicationId: 'nurofen', source: 'given' },
    })
    timelineStore.append({
      childId: 'luca',
      at: '2026-06-07T21:00:00.000Z',
      payload: { kind: 'dose', medicationId: 'nurofen', source: 'given' },
    })
    expect(timelineStore.listFor('maya')).toHaveLength(1)
    expect(timelineStore.listFor('luca')).toHaveLength(1)
  })
})
