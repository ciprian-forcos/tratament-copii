import { describe, expect, it } from 'vitest'
import { demoEpisode } from './demo'

describe('demoEpisode', () => {
  const now = new Date('2026-06-07T23:00:00')
  const facts = demoEpisode('maya', now)

  it('tells a fever story: temperatures, alternating doses and a nap', () => {
    const temps = facts.filter((f) => f.payload.kind === 'temperature')
    const doses = facts.filter((f) => f.payload.kind === 'dose')
    expect(temps.length).toBeGreaterThanOrEqual(8)
    expect(doses.length).toBeGreaterThanOrEqual(4)
    expect(facts.some((f) => f.payload.kind === 'note' && f.payload.text === 'Doarme')).toBe(true)
    const meds = doses.map((d) => (d.payload.kind === 'dose' ? d.payload.medicationId : ''))
    expect(meds.every((m, i) => i === 0 || m !== meds[i - 1])).toBe(true)
  })

  it('stays in the past and belongs to the child', () => {
    expect(facts.every((f) => new Date(f.at).getTime() <= now.getTime())).toBe(true)
    expect(facts.every((f) => f.childId === 'maya')).toBe(true)
  })
})
