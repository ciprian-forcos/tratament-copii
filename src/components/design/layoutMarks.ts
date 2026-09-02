import { fmtHHMM } from './dosePlan'

/** Fever-strip axis: now ± 6h. Independent of isNightWindow / anchorStrip. */
export const STRIP_HALF_MS = 6 * 3600_000
export const STRIP_SPAN_MS = 12 * 3600_000
export const DEFAULT_CHAR_WIDTH_PX = 7.2
export const DEFAULT_MAX_LABEL_PX = 88
export const MARK_LANE_HEIGHT_PX = 52

const DOT_PX = 16
const H_PAD = 4

export type StripMarkIn = {
  at: Date
  med: string
  next?: boolean
}

export type LaidOutMark = {
  leftPx: number
  widthPx: number
  lane: number
  centerPx: number
  at: Date
  med: string
  label: string
  timeLabel: string
  next: boolean
  pinned: boolean
}

export type LayoutMarksOpts = {
  widthPx: number
  now: Date
  measure: (text: string) => number
  maxLabelPx?: number
}

export type MarkBox = { l: number; r: number; t: number; b: number }

export function estimateTextWidth(text: string, charWidthPx = DEFAULT_CHAR_WIDTH_PX): number {
  return text.length * charWidthPx
}

export function stripAxis(now: Date): { start: Date; end: Date } {
  return {
    start: new Date(now.getTime() - STRIP_HALF_MS),
    end: new Date(now.getTime() + STRIP_HALF_MS),
  }
}

export function markBox(m: Pick<LaidOutMark, 'leftPx' | 'widthPx' | 'lane'>): MarkBox {
  const t = m.lane * MARK_LANE_HEIGHT_PX
  return { l: m.leftPx, r: m.leftPx + m.widthPx, t, b: t + MARK_LANE_HEIGHT_PX }
}

export function boxesIntersect(a: MarkBox, b: MarkBox): boolean {
  return a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b
}

export function ellipsize(text: string, maxPx: number, measure: (t: string) => number): string {
  if (measure(text) <= maxPx) return text
  const ell = '…'
  let lo = 0
  let hi = text.length
  let best = ell
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    const candidate = text.slice(0, Math.max(0, mid)) + ell
    if (measure(candidate) <= maxPx) {
      best = candidate
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  return best
}

function clampBox(centerPx: number, width: number, stripW: number): { leftPx: number; widthPx: number } {
  const w = Math.min(Math.max(width, DOT_PX + H_PAD * 2), stripW)
  let left = centerPx - w / 2
  if (left < 0) left = 0
  if (left + w > stripW) left = Math.max(0, stripW - w)
  return { leftPx: left, widthPx: w }
}

function uniqueJoin(parts: string[]): string {
  const seen = new Set<string>()
  const out: string[] = []
  for (const p of parts) {
    if (seen.has(p)) continue
    seen.add(p)
    out.push(p)
  }
  return out.join(' · ')
}

function decorateLabel(label: string, pinned: boolean, centerPx: number, widthPx: number): string {
  if (!pinned) return label
  return centerPx <= widthPx / 2 ? `‹ ${label}` : `${label} ›`
}

function buildMark(
  m: StripMarkIn,
  centerPx: number,
  pinned: boolean,
  opts: { widthPx: number; measure: (t: string) => number; maxLabelPx: number },
): LaidOutMark {
  const base = ellipsize(m.med, opts.maxLabelPx, opts.measure)
  const label = decorateLabel(base, pinned, centerPx, opts.widthPx)
  const box = clampBox(centerPx, opts.measure(label) + H_PAD * 2, opts.widthPx)
  return {
    leftPx: box.leftPx,
    widthPx: box.widthPx,
    lane: 0,
    centerPx: box.leftPx + box.widthPx / 2,
    at: m.at,
    med: m.med,
    label,
    timeLabel: fmtHHMM(m.at),
    next: m.next === true,
    pinned,
  }
}

function mergeMarks(
  a: LaidOutMark,
  b: LaidOutMark,
  opts: { widthPx: number; measure: (t: string) => number; maxLabelPx: number },
): LaidOutMark {
  const next = a.next || b.next
  const primary = a.next && !b.next ? a : b.next && !a.next ? b : a.at.getTime() <= b.at.getTime() ? a : b
  const pinned = primary.pinned
  const centerPx = primary.next
    ? (a.next ? a.centerPx : b.centerPx)
    : (a.centerPx + b.centerPx) / 2
  const med = uniqueJoin([a.med, b.med].filter(Boolean))
  const base = ellipsize(med, opts.maxLabelPx, opts.measure)
  const label = decorateLabel(base, pinned, centerPx, opts.widthPx)
  const box = clampBox(centerPx, opts.measure(label) + H_PAD * 2, opts.widthPx)
  const earlier = a.at.getTime() <= b.at.getTime() ? a : b
  const later = earlier === a ? b : a
  const timeLabel =
    a.at.getTime() === b.at.getTime()
      ? primary.timeLabel
      : `${earlier.timeLabel}–${later.timeLabel}`
  return {
    leftPx: box.leftPx,
    widthPx: box.widthPx,
    lane: 0,
    centerPx: box.leftPx + box.widthPx / 2,
    at: primary.at,
    med,
    label,
    timeLabel,
    next,
    pinned,
  }
}

export function layoutMarks(marks: StripMarkIn[], opts: LayoutMarksOpts): LaidOutMark[] {
  const { widthPx, now, measure, maxLabelPx = DEFAULT_MAX_LABEL_PX } = opts
  if (!(widthPx > 0)) return []
  const startMs = now.getTime() - STRIP_HALF_MS
  const endMs = now.getTime() + STRIP_HALF_MS
  const buildOpts = { widthPx, measure, maxLabelPx }

  const seeds: LaidOutMark[] = []
  for (const m of marks) {
    const t = m.at.getTime()
    const isNext = m.next === true
    if (t < startMs || t > endMs) {
      if (!isNext) continue
      const centerPx = t < startMs ? 0 : widthPx
      seeds.push(buildMark(m, centerPx, true, buildOpts))
      continue
    }
    const centerPx = ((t - startMs) / STRIP_SPAN_MS) * widthPx
    seeds.push(buildMark(m, centerPx, false, buildOpts))
  }

  seeds.sort((a, b) => a.leftPx - b.leftPx || a.at.getTime() - b.at.getTime())

  const out: LaidOutMark[] = []
  for (const s of seeds) {
    const prev = out[out.length - 1]
    if (prev && boxesIntersect(markBox(prev), markBox(s))) {
      out[out.length - 1] = mergeMarks(prev, s, buildOpts)
    } else {
      out.push(s)
    }
  }

  let changed = true
  while (changed) {
    changed = false
    for (let i = 1; i < out.length; i++) {
      if (boxesIntersect(markBox(out[i - 1]), markBox(out[i]))) {
        const merged = mergeMarks(out[i - 1], out[i], buildOpts)
        out.splice(i - 1, 2, merged)
        changed = true
        break
      }
    }
  }

  return out
}
