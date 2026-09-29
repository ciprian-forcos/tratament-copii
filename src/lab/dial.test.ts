import { describe, expect, it } from 'vitest'
import { DIAL_MAX, DIAL_MIN, angleFor, heatFor, tempAt } from './dial'

describe('temperature dial', () => {
  it('maps the ends of the arc to 35.0 and 41.0', () => {
    expect(tempAt(-135)).toBe(DIAL_MIN)
    expect(tempAt(135)).toBe(DIAL_MAX)
    expect(tempAt(0)).toBe(38)
  })

  it('snaps to tenths and clamps past the ends', () => {
    expect(tempAt(4.6)).toBe(38.1)
    expect(tempAt(-170)).toBe(DIAL_MIN)
    expect(tempAt(170)).toBe(DIAL_MAX)
  })

  it('round-trips a temperature to its angle', () => {
    expect(angleFor(38)).toBe(0)
    expect(tempAt(angleFor(39.4))).toBe(39.4)
  })

  it('names the heat band', () => {
    expect(heatFor(36.6)).toBe('normal')
    expect(heatFor(37.8)).toBe('warm')
    expect(heatFor(38.5)).toBe('fever')
    expect(heatFor(39.6)).toBe('high')
  })
})
