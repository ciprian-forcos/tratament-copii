import { describe, expect, it } from 'vitest'
import type { TimelineFact } from '../types'
import { moodFor } from './mood'

const NOW = new Date('2026-06-07T23:00:00')
let n = 0
function fact(at: string, payload: TimelineFact['payload']): TimelineFact {
  return { id: `f${n++}`, childId: 'maya', at: new Date(at).toISOString(), payload }
}

describe('moodFor', () => {
  it('is fine with nothing recent', () => {
    expect(moodFor([], NOW)).toBe('bine')
  })

  it('flushes with a recent fever', () => {
    expect(moodFor([fact('2026-06-07T22:00:00', { kind: 'temperature', celsius: 38.6 })], NOW)).toBe('febra')
  })

  it('calms once a later temperature is normal', () => {
    const facts = [
      fact('2026-06-07T20:00:00', { kind: 'temperature', celsius: 39.1 }),
      fact('2026-06-07T22:30:00', { kind: 'temperature', celsius: 37.1 }),
    ]
    expect(moodFor(facts, NOW)).toBe('bine')
  })

  it('sleeps when the latest thing is a Doarme note', () => {
    const facts = [
      fact('2026-06-07T21:00:00', { kind: 'temperature', celsius: 38.6 }),
      fact('2026-06-07T22:15:00', { kind: 'note', text: 'Doarme' }),
    ]
    expect(moodFor(facts, NOW)).toBe('somn')
  })

  it('forgets a fever older than six hours', () => {
    expect(moodFor([fact('2026-06-07T15:00:00', { kind: 'temperature', celsius: 39 })], NOW)).toBe('bine')
  })
})
