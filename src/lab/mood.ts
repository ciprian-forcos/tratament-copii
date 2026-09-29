import type { TimelineFact } from '../types'

export type Mood = 'bine' | 'febra' | 'somn'

const FEVER_WINDOW = 6 * 3600_000
const SLEEP_WINDOW = 3 * 3600_000

/** The face reflects the latest recent temperature or Doarme note. */
export function moodFor(facts: TimelineFact[], now: Date): Mood {
  const t = now.getTime()
  const recent = facts
    .filter((f) => {
      const age = t - new Date(f.at).getTime()
      if (age < 0) return false
      if (f.payload.kind === 'temperature') return age <= FEVER_WINDOW
      if (f.payload.kind === 'note') return f.payload.text === 'Doarme' && age <= SLEEP_WINDOW
      return false
    })
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
  const latest = recent[0]
  if (!latest) return 'bine'
  if (latest.payload.kind === 'note') return 'somn'
  if (latest.payload.kind === 'temperature' && latest.payload.celsius >= 38) return 'febra'
  return 'bine'
}
