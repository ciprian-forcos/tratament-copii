import type { TimelineMark, TimelineZoom } from '../../../types'
import { FEVER_IDS } from './project'

export const VIEW_SPAN_MS: Record<TimelineZoom, number> = {
  hour: 12 * 3600_000,
  day: 24 * 3600_000,
  week: 7 * 24 * 3600_000,
}

export function viewWindow(now: Date, zoom: TimelineZoom, panMs: number) {
  const span = VIEW_SPAN_MS[zoom]
  const center = now.getTime() + panMs
  return {
    from: new Date(center - span / 2),
    to: new Date(center + span / 2),
    span,
  }
}

const FEVER_SET = new Set<string>(FEVER_IDS)

export function marksForView(marks: TimelineMark[], from: Date, to: Date, zoom: TimelineZoom) {
  return marks.filter((m) => {
    if (m.at.getTime() < from.getTime() || m.at.getTime() >= to.getTime()) return false
    if (zoom === 'hour' && m.source === 'projected' && !FEVER_SET.has(m.medicationId)) return false
    return true
  })
}
