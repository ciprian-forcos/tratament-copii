import type { TimelineFact } from '../types'

const H = 3600_000

/** A made-up 30-hour fever for exploring the design without real data. */
export function demoEpisode(childId: string, now: Date): Omit<TimelineFact, 'id'>[] {
  const at = (hoursAgo: number) => new Date(now.getTime() - hoursAgo * H).toISOString()
  const temps: [number, number][] = [
    [30, 37.2], [27, 37.9], [25, 38.6], [23.5, 39.3], [21, 38.4], [18.5, 37.8],
    [16, 38.7], [14, 39.4], [11.5, 38.3], [9, 37.6], [6.5, 38.2], [4.5, 38.9],
    [2.5, 38.1], [0.8, 37.6],
  ]
  const doses: [number, string][] = [
    [23.5, 'nurofen'], [19.5, 'panadol'], [14, 'nurofen'], [10, 'panadol'], [4.5, 'nurofen'],
  ]
  return [
    ...temps.map(([h, celsius]) => ({ childId, at: at(h), payload: { kind: 'temperature' as const, celsius } })),
    ...doses.map(([h, medicationId]) => ({
      childId,
      at: at(h),
      payload: { kind: 'dose' as const, medicationId, source: 'given' as const },
    })),
    { childId, at: at(3), payload: { kind: 'note' as const, text: 'Doarme' } },
  ]
}
