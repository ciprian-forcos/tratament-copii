import { describe, expect, it } from 'vitest'
import {
  boxesIntersect,
  estimateTextWidth,
  layoutMarks,
  markBox,
  type LaidOutMark,
  type StripMarkIn,
} from './layoutMarks'

const measure = (text: string) => estimateTextWidth(text)

function at(iso: string): Date {
  return new Date(iso)
}

/** dd9f141 placement: center at time %, width = full label, no clamp, no collision. */
function naiveLayout(
  marks: StripMarkIn[],
  widthPx: number,
  now: Date,
): LaidOutMark[] {
  const start = now.getTime() - 6 * 3600_000
  const span = 12 * 3600_000
  return marks.map((m) => {
    const pct = Math.max(0, Math.min(1, (m.at.getTime() - start) / span))
    const center = pct * widthPx
    const width = measure(m.med)
    return {
      leftPx: center - width / 2,
      widthPx: width,
      lane: 0,
      centerPx: center,
      at: m.at,
      med: m.med,
      label: m.med,
      timeLabel: '',
      next: m.next === true,
      pinned: false,
    }
  })
}

function anyIntersect(marks: LaidOutMark[]): boolean {
  for (let i = 0; i < marks.length; i++) {
    for (let j = i + 1; j < marks.length; j++) {
      if (boxesIntersect(markBox(marks[i]), markBox(marks[j]))) return true
    }
  }
  return false
}

function withinStrip(marks: LaidOutMark[], widthPx: number): boolean {
  return marks.every((m) => m.leftPx >= 0 && m.leftPx + m.widthPx <= widthPx + 1e-6)
}

describe('layoutMarks', () => {
  const now = at('2026-06-08T03:12:00')
  const cluster: StripMarkIn[] = [
    { at: at('2026-06-07T22:42:00'), med: 'Nurofen' },
    { at: at('2026-06-07T23:00:00'), med: 'Panadol Baby' },
    { at: at('2026-06-07T23:12:00'), med: 'Spray Vitamina D - Devit500' },
  ]

  it('keeps clustered 22:42 / 23:00 / 23:12 marks from intersecting at 390 and 360', () => {
    for (const widthPx of [390, 360]) {
      const naive = naiveLayout(cluster, widthPx, now)
      expect(anyIntersect(naive)).toBe(true)

      const laid = layoutMarks(cluster, { widthPx, now, measure })
      expect(laid.length).toBeGreaterThanOrEqual(1)
      expect(anyIntersect(laid)).toBe(false)
      expect(withinStrip(laid, widthPx)).toBe(true)
    }
  })

  it('caps a long label so it cannot span 140px on a 320px strip', () => {
    const laid = layoutMarks(
      [{ at: at('2026-06-08T03:12:00'), med: 'Spray Vitamina D - Devit500' }],
      { widthPx: 320, now, measure },
    )
    expect(laid).toHaveLength(1)
    expect(laid[0].widthPx).toBeLessThanOrEqual(88 + 8)
    expect(laid[0].label.includes('…') || laid[0].label.length < 'Spray Vitamina D - Devit500'.length).toBe(
      true,
    )
    expect(withinStrip(laid, 320)).toBe(true)
  })

  it('pushes a mark at 0% fully onto the strip instead of overflowing left', () => {
    const edgeNow = at('2026-06-08T03:12:00')
    const start = new Date(edgeNow.getTime() - 6 * 3600_000)
    const laid = layoutMarks(
      [{ at: start, med: 'Nurofen' }],
      { widthPx: 390, now: edgeNow, measure },
    )
    expect(laid).toHaveLength(1)
    expect(laid[0].leftPx).toBeGreaterThanOrEqual(0)
    expect(laid[0].leftPx + laid[0].widthPx).toBeLessThanOrEqual(390)
    const naive = naiveLayout([{ at: start, med: 'Nurofen' }], 390, edgeNow)
    expect(naive[0].leftPx).toBeLessThan(0)
  })

  it('drops recorded marks outside now ± 6h', () => {
    const evening = at('2026-06-07T20:30:00')
    const laid = layoutMarks(
      [
        { at: at('2026-06-06T22:30:00'), med: 'Nurofen' },
        { at: at('2026-06-07T00:00:00'), med: 'Panadol Baby' },
      ],
      { widthPx: 390, now: evening, measure },
    )
    expect(laid).toHaveLength(0)
  })

  it('pins a next-dose mark that falls beyond the axis and keeps the real time', () => {
    const evening = at('2026-06-07T20:30:00')
    const nextAt = at('2026-06-08T04:00:00')
    const laid = layoutMarks(
      [{ at: nextAt, med: 'Panadol Baby', next: true }],
      { widthPx: 390, now: evening, measure },
    )
    expect(laid).toHaveLength(1)
    expect(laid[0].next).toBe(true)
    expect(laid[0].pinned).toBe(true)
    expect(laid[0].timeLabel).toBe('04:00')
    expect(laid[0].label).toMatch(/›/)
    expect(withinStrip(laid, 390)).toBe(true)
  })

  it('does not drop an in-axis next-dose mark', () => {
    const laid = layoutMarks(
      [{ at: at('2026-06-08T06:00:00'), med: 'Panadol Baby', next: true }],
      { widthPx: 390, now, measure },
    )
    expect(laid).toHaveLength(1)
    expect(laid[0].pinned).toBe(false)
    expect(laid[0].next).toBe(true)
    expect(laid[0].timeLabel).toBe('06:00')
  })
})
