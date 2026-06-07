import { describe, it, expect, beforeEach, vi } from 'vitest'
import { doseStore } from './doseStore'

describe('doseStore', () => {
  beforeEach(() => {
    doseStore.clear()
    localStorage.clear()
  })

  it('record() returns a saved record with generated id', () => {
    const dose = doseStore.record({
      childId: 'child-1',
      medicationId: 'nurofen',
      scheduledAt: '2026-05-27T10:00:00.000Z',
      administeredAt: '2026-05-27T10:05:00.000Z',
    })

    expect(dose.id).toMatch(/^d[a-z0-9-]+/)
    expect(dose.childId).toBe('child-1')
    expect(dose.medicationId).toBe('nurofen')
  })

  it('list() includes the newly recorded dose', () => {
    doseStore.record({
      childId: 'child-1',
      medicationId: 'nurofen',
      scheduledAt: '2026-05-27T10:00:00.000Z',
      administeredAt: '2026-05-27T10:05:00.000Z',
    })

    const all = doseStore.list()
    expect(all).toHaveLength(1)
    expect(all[0].medicationId).toBe('nurofen')
  })

  it('listFor(childId) filters by child', () => {
    doseStore.record({ childId: 'child-1', medicationId: 'nurofen', scheduledAt: '2026-05-27T10:00:00.000Z', administeredAt: '2026-05-27T10:05:00.000Z' })
    doseStore.record({ childId: 'child-2', medicationId: 'panadol', scheduledAt: '2026-05-27T11:00:00.000Z', administeredAt: '2026-05-27T11:05:00.000Z' })

    const child1 = doseStore.listFor('child-1')
    expect(child1).toHaveLength(1)
    expect(child1[0].medicationId).toBe('nurofen')
  })

  it('listFor(childId, { since, until }) filters by administeredAt range', () => {
    doseStore.record({ childId: 'child-1', medicationId: 'nurofen', scheduledAt: '2026-05-27T09:00:00.000Z', administeredAt: '2026-05-27T09:05:00.000Z' })
    doseStore.record({ childId: 'child-1', medicationId: 'panadol', scheduledAt: '2026-05-27T11:00:00.000Z', administeredAt: '2026-05-27T11:05:00.000Z' })

    const filtered = doseStore.listFor('child-1', {
      since: new Date('2026-05-27T10:00:00.000Z'),
      until: new Date('2026-05-27T12:00:00.000Z'),
    })

    expect(filtered).toHaveLength(1)
    expect(filtered[0].medicationId).toBe('panadol')
  })

  it('records persist across reload (localStorage)', () => {
    doseStore.record({
      childId: 'child-1',
      medicationId: 'nurofen',
      scheduledAt: '2026-05-27T10:00:00.000Z',
      administeredAt: '2026-05-27T10:05:00.000Z',
    })

    // Simulate reload: directly wipe in-memory state (bypass clear which removes from localStorage)
    const originalDoses = (doseStore as any).doses
    void originalDoses // suppress unused-var warning
    ;(doseStore as any).doses = []
    doseStore.reloadFromStorage()

    const reloaded = doseStore.list()
    expect(reloaded).toHaveLength(1)
    expect(reloaded[0].medicationId).toBe('nurofen')
  })

  it('subscribe(fn) fires on record() and clear()', () => {
    const fn = vi.fn()
    const unsubscribe = doseStore.subscribe(fn)

    doseStore.record({
      childId: 'child-1',
      medicationId: 'nurofen',
      scheduledAt: '2026-05-27T10:00:00.000Z',
      administeredAt: '2026-05-27T10:05:00.000Z',
    })
    expect(fn).toHaveBeenCalledTimes(1)

    doseStore.clear()
    expect(fn).toHaveBeenCalledTimes(2)

    unsubscribe()
  })

  it('uses localStorage key tratament-copii-administered-doses', () => {
    doseStore.record({
      childId: 'child-1',
      medicationId: 'nurofen',
      scheduledAt: '2026-05-27T10:00:00.000Z',
      administeredAt: '2026-05-27T10:05:00.000Z',
    })

    const raw = localStorage.getItem('tratament-copii-administered-doses')
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw!)
    expect(parsed).toHaveLength(1)
  })

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('tratament-copii-administered-doses', 'not-valid-json')

    // Force reload so loadFromStorage runs against the corrupted value
    doseStore.reloadFromStorage()

    const doses = doseStore.list()
    expect(doses).toHaveLength(0)
  })
})