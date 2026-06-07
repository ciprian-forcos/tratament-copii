import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { doseStore } from './doseStore'

// We import what doesn't exist yet — this will fail until implemented
import { useNightTimeline, anchorStrip } from './useNightTimeline'

describe('anchorStrip', () => {
  it('returns 21:00 today when now is after 21:00', () => {
    // now = 2026-06-07 23:00 local
    const now = new Date('2026-06-07T21:30:00')
    const anchor = anchorStrip(now)
    expect(anchor.getHours()).toBe(21)
    expect(anchor.getMinutes()).toBe(0)
    expect(anchor.getDate()).toBe(now.getDate())
  })

  it('returns 21:00 yesterday when now is before 21:00', () => {
    // now = 2026-06-07 03:00 local
    const now = new Date('2026-06-07T03:00:00')
    const anchor = anchorStrip(now)
    expect(anchor.getHours()).toBe(21)
    expect(anchor.getMinutes()).toBe(0)
    // anchor should be June 6 (yesterday)
    expect(anchor.getDate()).toBe(6)
  })

  it('returns 21:00 today when now is exactly 21:00', () => {
    const now = new Date('2026-06-07T21:00:00')
    const anchor = anchorStrip(now)
    expect(anchor.getHours()).toBe(21)
    expect(anchor.getDate()).toBe(7)
  })
})

describe('useNightTimeline', () => {
  beforeEach(() => {
    doseStore.clear()
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns empty array when store is empty', () => {
    const now = new Date('2026-06-07T23:00:00')
    const { result } = renderHook(() => useNightTimeline('maya', now))
    expect(result.current).toEqual([])
  })

  it('includes one dose administered 30 min before now with correct shape', () => {
    const now = new Date('2026-06-07T23:00:00')
    const administeredAt = new Date('2026-06-07T22:30:00').toISOString()
    doseStore.record({
      childId: 'maya',
      medicationId: 'nurofen',
      scheduledAt: administeredAt,
      administeredAt,
    })

    const { result } = renderHook(() => useNightTimeline('maya', now))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].med).toBe('Nurofen')
    expect(result.current[0].medId).toBe('nurofen')
    expect(result.current[0].at).toEqual(new Date(administeredAt))
  })

  it('excludes doses for other children', () => {
    const now = new Date('2026-06-07T23:00:00')
    const administeredAt = new Date('2026-06-07T22:30:00').toISOString()
    doseStore.record({
      childId: 'other-child',
      medicationId: 'nurofen',
      scheduledAt: administeredAt,
      administeredAt,
    })

    const { result } = renderHook(() => useNightTimeline('maya', now))
    expect(result.current).toHaveLength(0)
  })

  it('excludes doses outside the 12h window', () => {
    const now = new Date('2026-06-07T23:00:00')
    // Window: 2026-06-07 21:00 → 2026-06-08 09:00
    // This dose is at 20:59, just before the window start
    const outsideBefore = new Date('2026-06-07T20:59:00').toISOString()
    // This dose is at 09:00, at the boundary (exclusive)
    const outsideAfter = new Date('2026-06-08T09:00:00').toISOString()
    doseStore.record({
      childId: 'maya',
      medicationId: 'nurofen',
      scheduledAt: outsideBefore,
      administeredAt: outsideBefore,
    })
    doseStore.record({
      childId: 'maya',
      medicationId: 'panadol',
      scheduledAt: outsideAfter,
      administeredAt: outsideAfter,
    })

    const { result } = renderHook(() => useNightTimeline('maya', now))
    expect(result.current).toHaveLength(0)
  })

  it('resolves Nurofen short name as "Nurofen" not full name', () => {
    const now = new Date('2026-06-07T23:00:00')
    const administeredAt = new Date('2026-06-07T22:30:00').toISOString()
    doseStore.record({
      childId: 'maya',
      medicationId: 'nurofen',
      scheduledAt: administeredAt,
      administeredAt,
    })

    const { result } = renderHook(() => useNightTimeline('maya', now))
    expect(result.current[0].med).toBe('Nurofen')
    expect(result.current[0].med).not.toContain('Ibuprofen')
  })

  it('falls back to medId when medication not found in DEFAULT_MEDICATIONS', () => {
    const now = new Date('2026-06-07T23:00:00')
    const administeredAt = new Date('2026-06-07T22:30:00').toISOString()
    doseStore.record({
      childId: 'maya',
      medicationId: 'unknown-med-xyz',
      scheduledAt: administeredAt,
      administeredAt,
    })

    const { result } = renderHook(() => useNightTimeline('maya', now))
    expect(result.current[0].med).toBe('unknown-med-xyz')
    expect(result.current[0].medId).toBe('unknown-med-xyz')
  })

  it('includes a dose at 21:30 previous day when now is 03:00', () => {
    // now = 2026-06-07 03:00 → window starts at 2026-06-06 21:00
    const now = new Date('2026-06-07T03:00:00')
    // Dose at 21:30 on June 6 — should be included
    const administeredAt = new Date('2026-06-06T21:30:00').toISOString()
    doseStore.record({
      childId: 'maya',
      medicationId: 'panadol',
      scheduledAt: administeredAt,
      administeredAt,
    })

    const { result } = renderHook(() => useNightTimeline('maya', now))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].medId).toBe('panadol')
  })

  it('returns results sorted by at ascending', () => {
    const now = new Date('2026-06-07T23:00:00')
    const t1 = new Date('2026-06-07T22:30:00').toISOString()
    const t2 = new Date('2026-06-07T21:15:00').toISOString()
    const t3 = new Date('2026-06-07T22:00:00').toISOString()
    for (const [administeredAt, medId] of [[t1, 'nurofen'], [t2, 'panadol'], [t3, 'nurofen']] as const) {
      doseStore.record({ childId: 'maya', medicationId: medId, scheduledAt: administeredAt, administeredAt })
    }

    const { result } = renderHook(() => useNightTimeline('maya', now))
    expect(result.current).toHaveLength(3)
    expect(result.current[0].at.toISOString()).toBe(new Date(t2).toISOString())
    expect(result.current[1].at.toISOString()).toBe(new Date(t3).toISOString())
    expect(result.current[2].at.toISOString()).toBe(new Date(t1).toISOString())
  })
})
