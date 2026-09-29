/** Maths for Grafic: temperature as a price chart. Pure, so it is easy to test. */
import type { TimelineFact } from '../types'

export type Pt = { t: number; v: number }

const H = 3600_000
export const FEVER = 38

export const RANGES = [
  { id: '6h', label: '6O', ms: 6 * H },
  { id: '12h', label: '12O', ms: 12 * H },
  { id: '1d', label: '1Z', ms: 24 * H },
  { id: '3d', label: '3Z', ms: 72 * H },
  { id: '1w', label: '1S', ms: 7 * 24 * H },
] as const
export type RangeId = (typeof RANGES)[number]['id']

export function tempSeries(facts: TimelineFact[]): Pt[] {
  return facts
    .flatMap((f) => (f.payload.kind === 'temperature' ? [{ t: new Date(f.at).getTime(), v: f.payload.celsius }] : []))
    .sort((a, b) => a.t - b.t)
}

/** The range behind now, plus a quarter of it ahead for the forecast zone. */
export function chartWindow(now: number, rangeMs: number) {
  return { from: now - rangeMs, to: now + rangeMs / 4 }
}

export function valueAt(points: Pt[], t: number): number | null {
  if (points.length === 0 || t < points[0].t) return null
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    if (t <= b.t) return a.v + ((b.v - a.v) * (t - a.t)) / (b.t - a.t || 1)
  }
  return points[points.length - 1].v
}

/** Latest reading against the value at the start of the range. */
export function change(points: Pt[], now: number, rangeMs: number) {
  const past = points.filter((p) => p.t <= now)
  if (past.length === 0) return null
  const to = past[past.length - 1].v
  const start = now - rangeMs
  const from = valueAt(past, start) ?? past.find((p) => p.t >= start)?.v ?? to
  return { from, to, delta: to - from }
}

/** Vertical scale: always shows 36.5–38.5 (so the fever line is on screen), padded to half degrees. */
export function extent(points: Pt[]) {
  const vs = points.map((p) => p.v)
  const lo = Math.floor(Math.min(36.5, ...vs.map((v) => v - 0.2)) * 2) / 2
  const hi = Math.ceil(Math.max(38.5, ...vs.map((v) => v + 0.2)) * 2) / 2
  return { lo, hi }
}

export function ticks(lo: number, hi: number, step = 0.5) {
  const out: number[] = []
  for (let v = lo; v <= hi + 1e-9; v += step) out.push(Math.round(v * 10) / 10)
  return out
}

/** Monotone cubic (Fritsch–Carlson) through the points: smooth, never overshoots a reading. */
export function smoothPath(xy: [number, number][]) {
  const n = xy.length
  if (n === 0) return ''
  const f = (v: number) => Number(v.toFixed(2))
  if (n === 1) return `M ${f(xy[0][0])} ${f(xy[0][1])}`
  const dx: number[] = []
  const slope: number[] = []
  for (let i = 0; i < n - 1; i++) {
    dx.push(xy[i + 1][0] - xy[i][0])
    slope.push((xy[i + 1][1] - xy[i][1]) / (dx[i] || 1))
  }
  const m: number[] = [slope[0]]
  for (let i = 1; i < n - 1; i++) m.push(slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2)
  m.push(slope[n - 2])
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      m[i] = 0
      m[i + 1] = 0
      continue
    }
    const a = m[i] / slope[i]
    const b = m[i + 1] / slope[i]
    const s = a * a + b * b
    if (s > 9) {
      const tau = 3 / Math.sqrt(s)
      m[i] = tau * a * slope[i]
      m[i + 1] = tau * b * slope[i]
    }
  }
  let d = `M ${f(xy[0][0])} ${f(xy[0][1])}`
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = xy[i]
    const [x1, y1] = xy[i + 1]
    const h = dx[i] / 3
    d += ` C ${f(x0 + h)} ${f(y0 + m[i] * h)} ${f(x1 - h)} ${f(y1 - m[i + 1] * h)} ${f(x1)} ${f(y1)}`
  }
  return d
}

/** The market-stats row: last 24 hours. */
export function stats(facts: TimelineFact[], now: number) {
  const day = facts.filter((f) => {
    const t = new Date(f.at).getTime()
    return t <= now && now - t <= 24 * H
  })
  const temps = day.flatMap((f) => (f.payload.kind === 'temperature' ? [f.payload.celsius] : []))
  const doseTimes = day.filter((f) => f.payload.kind === 'dose').map((f) => new Date(f.at).getTime())
  return {
    max: temps.length ? Math.max(...temps) : null,
    min: temps.length ? Math.min(...temps) : null,
    doses: doseTimes.length,
    lastDoseAt: doseTimes.length ? Math.max(...doseTimes) : null,
  }
}
