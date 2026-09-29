/** Geometry and words for Fir's thread. Pure, so it is easy to test. */

export const HOUR_PX = 56
const HOUR = 3600_000
const DAYS_BACK = 2
const DAYS_AHEAD = 4
export const NIGHT_FROM = 20
export const NIGHT_TO = 7

function midnight(d: Date, addDays = 0) {
  const out = new Date(d)
  out.setHours(0, 0, 0, 0)
  out.setDate(out.getDate() + addDays)
  return out
}

/** From midnight two days back to midnight four days on (six days of thread). */
export function threadWindow(now: Date) {
  const from = midnight(now, -DAYS_BACK)
  const to = midnight(now, DAYS_AHEAD)
  return { from, to, width: ((to.getTime() - from.getTime()) / HOUR) * HOUR_PX }
}

export function xOf(at: Date, from: Date) {
  return ((at.getTime() - from.getTime()) / HOUR) * HOUR_PX
}

/** Which way now went when the thread is scrolled; null while it is on screen. */
export function acumSide(nowX: number, scrollLeft: number, viewport: number): 'left' | 'right' | null {
  if (nowX < scrollLeft) return 'left'
  if (nowX > scrollLeft + viewport) return 'right'
  return null
}

export function countdownWords(now: Date, at: Date) {
  const diff = at.getTime() - now.getTime()
  if (Math.abs(diff) < 60_000) return 'acum'
  const mins = Math.round(Math.abs(diff) / 60_000)
  const h = Math.floor(mins / 60)
  const m = mins % 60
  const span = h && m ? `${h} h ${m} min` : h ? `${h} h` : `${m} min`
  return diff > 0 ? `peste ${span}` : `de ${span}`
}

/** 0 right after the last dose, 1 when the next one is due. */
export function ringProgress(now: Date, last: Date | null, next: Date) {
  if (!last) return 0
  const total = next.getTime() - last.getTime()
  if (total <= 0) return 1
  return Math.max(0, Math.min(1, (now.getTime() - last.getTime()) / total))
}

/** Lane per bead (sorted by x): a bead too close to the previous one in a lane goes up a lane. */
export function assignLanes(xs: number[], minGap: number) {
  const laneEnds: number[] = []
  return xs.map((x) => {
    let lane = 0
    while (laneEnds[lane] !== undefined && x - laneEnds[lane] < minGap) lane++
    laneEnds[lane] = x
    return lane
  })
}

/** Night bands (20:00–07:00) clipped to the window. */
export function nightSpans(from: Date, to: Date) {
  const spans: { from: Date; to: Date }[] = []
  for (let day = midnight(from, -1); day < to; day = midnight(day, 1)) {
    const start = new Date(day)
    start.setHours(NIGHT_FROM)
    const end = midnight(day, 1)
    end.setHours(NIGHT_TO)
    const a = start < from ? from : start
    const b = end > to ? to : end
    if (a < b) spans.push({ from: a, to: b })
  }
  return spans
}
