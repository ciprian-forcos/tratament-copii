import { describe, expect, it } from 'vitest'
import type { TimelineFact } from '../types'
import { chartWindow, change, extent, smoothPath, stats, tempSeries, ticks, valueAt } from './grafic'

const H = 3600_000
const NOW = new Date('2026-06-07T23:00:00').getTime()
let n = 0
const temp = (hoursAgo: number, c: number): TimelineFact => ({
  id: `t${n++}`,
  childId: 'maya',
  at: new Date(NOW - hoursAgo * H).toISOString(),
  payload: { kind: 'temperature', celsius: c },
})
const dose = (hoursAgo: number): TimelineFact => ({
  id: `d${n++}`,
  childId: 'maya',
  at: new Date(NOW - hoursAgo * H).toISOString(),
  payload: { kind: 'dose', medicationId: 'nurofen', source: 'given' },
})

describe('tempSeries', () => {
  it('keeps temperatures only, oldest first', () => {
    const pts = tempSeries([temp(1, 38.6), dose(2), temp(3, 37.8)])
    expect(pts.map((p) => p.v)).toEqual([37.8, 38.6])
  })
})

describe('chartWindow', () => {
  it('shows the range behind now and a quarter of it ahead for the forecast', () => {
    const w = chartWindow(NOW, 12 * H)
    expect(w.from).toBe(NOW - 12 * H)
    expect(w.to).toBe(NOW + 3 * H)
  })
})

describe('valueAt', () => {
  const pts = tempSeries([temp(4, 38), temp(2, 39)])
  it('interpolates between readings', () => {
    expect(valueAt(pts, NOW - 3 * H)).toBeCloseTo(38.5)
  })
  it('holds the last reading after it, and is empty before the first', () => {
    expect(valueAt(pts, NOW)).toBe(39)
    expect(valueAt(pts, NOW - 5 * H)).toBeNull()
  })
})

describe('change', () => {
  it('compares the latest reading with the value at the start of the range', () => {
    const pts = tempSeries([temp(8, 37.4), temp(4, 38), temp(1, 38.6)])
    const c = change(pts, NOW, 6 * H)!
    expect(c.to).toBe(38.6)
    expect(c.from).toBeCloseTo(37.7)
    expect(c.delta).toBeCloseTo(0.9)
  })
  it('uses the first reading in range when nothing came before it', () => {
    const c = change(tempSeries([temp(4, 38), temp(1, 38.6)]), NOW, 6 * H)!
    expect(c.from).toBe(38)
    expect(c.delta).toBeCloseTo(0.6)
  })
  it('is empty with no readings', () => {
    expect(change([], NOW, 6 * H)).toBeNull()
  })
})

describe('extent and ticks', () => {
  it('always includes the fever line and pads to half degrees', () => {
    expect(extent(tempSeries([temp(1, 37.2)]))).toEqual({ lo: 36.5, hi: 38.5 })
    expect(extent(tempSeries([temp(1, 40.1)]))).toEqual({ lo: 36.5, hi: 40.5 })
  })
  it('ticks every half degree', () => {
    expect(ticks(36.5, 38.5)).toEqual([36.5, 37, 37.5, 38, 38.5])
  })
})

describe('smoothPath', () => {
  it('starts and ends on the first and last points', () => {
    const d = smoothPath([
      [0, 50],
      [10, 20],
      [20, 40],
    ])
    expect(d.startsWith('M 0 50')).toBe(true)
    expect(d.endsWith('20 40')).toBe(true)
  })
  it('never overshoots between two readings (monotone)', () => {
    const d = smoothPath([
      [0, 50],
      [10, 50],
      [20, 10],
    ])
    const ys = [...d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].map((m) => Number(m[2]))
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(10)
    expect(Math.max(...ys)).toBeLessThanOrEqual(50)
  })
})

describe('stats', () => {
  it('summarises the last day', () => {
    const facts = [temp(30, 40), temp(10, 39.2), temp(5, 36.9), dose(3), dose(9), dose(26)]
    expect(stats(facts, NOW)).toEqual({ max: 39.2, min: 36.9, doses: 2, lastDoseAt: NOW - 3 * H })
  })
})
