import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render } from '@testing-library/react'
import { childStore } from '../childStore'
import { doseStore } from '../doseStore'
import { timelineStore } from '../timeline/store'
import { HomeEdi } from './HomeEdi'
import { HomeFane } from './HomeFane'

/** Edi and Fane use the same per-look dose marks as Acum, so a look restyles all three. */
describe('dose marks on the Edi and Fane tapes', () => {
  beforeEach(() => {
    doseStore.clear()
    timelineStore.clear()
    localStorage.clear()
    timelineStore.reloadFromStorage()
    childStore.setState({
      children: [{ id: 'maya', name: 'Maya', weight: 13, years: 2, months: 4, initial: 'M', enabledMedications: [] }],
      activeId: 'maya',
    })
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-07T23:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function recordNurofen(at: string) {
    const iso = new Date(at).toISOString()
    act(() => {
      doseStore.record({ childId: 'maya', medicationId: 'nurofen', scheduledAt: iso, administeredAt: iso })
    })
  }

  for (const [name, Screen] of [
    ['Edi', HomeEdi],
    ['Fane', HomeFane],
  ] as const) {
    it(`${name}: draws the next dose inside the shared .tl-next mark`, () => {
      recordNurofen('2026-06-07T21:00:00')
      const { container } = render(<Screen />)
      expect(container.querySelectorAll('.tl-next')).toHaveLength(1)
    })

    it(`${name}: springs in only a dose given in the last minute`, () => {
      recordNurofen('2026-06-07T19:00:00')
      recordNurofen('2026-06-07T22:59:30')
      const { container } = render(<Screen />)
      expect(container.querySelectorAll('.tl-dot--fresh')).toHaveLength(1)
    })
  }

  it('Fane: uses the same ring shape as Acum, so Material can swap it', () => {
    recordNurofen('2026-06-07T21:00:00')
    const { container } = render(<HomeFane />)
    expect(container.querySelectorAll('.tl-next path.tl-next-shape')).toHaveLength(1)
    expect(container.querySelector('.tl-dot--given')).not.toBeNull()
  })
})
