import { describe, expect, it } from 'vitest'
import { tapeY, wavyPath } from './wave'

function points(d: string) {
  return [...d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])])
}

describe('wavyPath', () => {
  it('follows the tape from start to now within the wave amplitude', () => {
    const pts = points(wavyPath(6, 160))
    expect(pts.length).toBeGreaterThan(50)
    expect(pts[0][0]).toBeCloseTo(6, 0)
    expect(pts[pts.length - 1][0]).toBeCloseTo(160, 0)
    for (const [x, y] of pts) {
      expect(Math.abs(y - tapeY(x))).toBeLessThanOrEqual(3)
    }
  })

  it('is empty when now is at or before the start of the tape', () => {
    expect(wavyPath(6, 6)).toBe('')
    expect(wavyPath(6, -20)).toBe('')
  })

  it('stops at the end of the tape when now is off to the right', () => {
    const pts = points(wavyPath(6, 999))
    expect(pts[pts.length - 1][0]).toBeLessThanOrEqual(314)
  })
})

describe('tapeY', () => {
  it('matches the tape path at its ends and joint', () => {
    expect(tapeY(6)).toBeCloseTo(38, 1)
    expect(tapeY(160)).toBeCloseTo(40, 1)
    expect(tapeY(314)).toBeCloseTo(36, 1)
  })
})
