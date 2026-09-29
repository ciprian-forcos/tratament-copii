import { describe, expect, it } from 'vitest'
import {
  HOUR_PX,
  acumSide,
  assignLanes,
  countdownWords,
  nightSpans,
  ringProgress,
  threadWindow,
  xOf,
} from './thread'

const at = (s: string) => new Date(s)

describe('threadWindow', () => {
  it('covers two days back and three ahead, midnight to midnight', () => {
    const w = threadWindow(at('2026-09-29T20:10:00'))
    expect(w.from).toEqual(at('2026-09-27T00:00:00'))
    expect(w.to).toEqual(at('2026-10-03T00:00:00'))
    expect(w.width).toBe(6 * 24 * HOUR_PX)
  })
})

describe('xOf', () => {
  it('places a time by hours from the window start', () => {
    const from = at('2026-09-29T00:00:00')
    expect(xOf(at('2026-09-29T02:30:00'), from)).toBe(2.5 * HOUR_PX)
  })
})

describe('acumSide', () => {
  it('says where now went when it scrolls out of view', () => {
    expect(acumSide(1000, 0, 390)).toBe('right')
    expect(acumSide(100, 400, 390)).toBe('left')
    expect(acumSide(500, 300, 390)).toBeNull()
  })
})

describe('countdownWords', () => {
  const now = at('2026-09-29T20:10:00')
  it('counts down in hours and minutes', () => {
    expect(countdownWords(now, at('2026-09-29T21:22:00'))).toBe('peste 1 h 12 min')
    expect(countdownWords(now, at('2026-09-29T20:40:00'))).toBe('peste 30 min')
    expect(countdownWords(now, at('2026-09-29T23:10:00'))).toBe('peste 3 h')
  })
  it('says now within a minute, and how late after that', () => {
    expect(countdownWords(now, at('2026-09-29T20:10:30'))).toBe('acum')
    expect(countdownWords(now, at('2026-09-29T19:55:00'))).toBe('de 15 min')
  })
})

describe('ringProgress', () => {
  it('fills from the last dose to the next', () => {
    const last = at('2026-09-29T18:00:00')
    const next = at('2026-09-29T22:00:00')
    expect(ringProgress(at('2026-09-29T20:00:00'), last, next)).toBeCloseTo(0.5)
    expect(ringProgress(at('2026-09-29T23:00:00'), last, next)).toBe(1)
    expect(ringProgress(at('2026-09-29T20:00:00'), null, next)).toBe(0)
  })
})

describe('assignLanes', () => {
  it('lifts a bead that would overlap the one before it', () => {
    expect(assignLanes([0, 100, 120, 130, 400], 44)).toEqual([0, 0, 1, 2, 0])
  })
})

describe('nightSpans', () => {
  it('shades 20:00 to 07:00 across the window', () => {
    const spans = nightSpans(at('2026-09-29T00:00:00'), at('2026-09-30T00:00:00'))
    expect(spans).toEqual([
      { from: at('2026-09-29T00:00:00'), to: at('2026-09-29T07:00:00') },
      { from: at('2026-09-29T20:00:00'), to: at('2026-09-30T00:00:00') },
    ])
  })
})
