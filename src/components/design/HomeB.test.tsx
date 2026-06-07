import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { doseStore } from './doseStore'
import { childStore } from './childStore'
import { HomeB } from './HomeB'

// Seed a second child for cross-child isolation tests
const MAYA_ID = 'maya'
const LUCA_ID = 'luca-test'

function seedLuca() {
  childStore.setState((s) => ({
    ...s,
    children: [
      ...s.children,
      { id: LUCA_ID, name: 'Luca', weight: 15, years: 3, months: 0, initial: 'L', enabledMedications: [] },
    ],
  }))
}

describe('HomeB night timeline', () => {
  beforeEach(() => {
    doseStore.clear()
    localStorage.clear()
    // Reset childStore to default (Maya active)
    childStore.setState({
      children: [
        { id: MAYA_ID, name: 'Maya', weight: 13, years: 2, months: 4, initial: 'M', temp: 38.5, enabledMedications: [] },
      ],
      activeId: MAYA_ID,
    })
    vi.useFakeTimers()
    // now = 2026-06-07 23:00 local — inside window starting 21:00
    vi.setSystemTime(new Date('2026-06-07T23:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders "noaptea asta" eyebrow', () => {
    render(<HomeB onStart={vi.fn()} />)
    expect(screen.getByText('noaptea asta')).toBeInTheDocument()
  })

  it('renders dose short names for doses within the window', () => {
    const t1 = new Date('2026-06-07T21:30:00').toISOString()
    const t2 = new Date('2026-06-07T22:00:00').toISOString()
    act(() => {
      doseStore.record({ childId: MAYA_ID, medicationId: 'nurofen', scheduledAt: t1, administeredAt: t1 })
      doseStore.record({ childId: MAYA_ID, medicationId: 'panadol', scheduledAt: t2, administeredAt: t2 })
    })

    render(<HomeB onStart={vi.fn()} />)

    // Short names from DEFAULT_MEDICATIONS should appear in the timeline
    expect(screen.getAllByText('Nurofen').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Panadol Baby').length).toBeGreaterThanOrEqual(1)
  })

  it('does NOT render doses for another child', () => {
    seedLuca()
    const t1 = new Date('2026-06-07T22:00:00').toISOString()
    act(() => {
      // Record dose for Luca only
      doseStore.record({ childId: LUCA_ID, medicationId: 'nurofen', scheduledAt: t1, administeredAt: t1 })
    })

    // Ensure Maya is active
    childStore.setActive(MAYA_ID)
    render(<HomeB onStart={vi.fn()} />)

    // Nurofen should NOT appear in Maya's timeline
    // (The button "Următoarea doză" shows the next-dose med name, not past doses)
    // We check that no past-dose dot appears — easiest is to check the rendered meds
    // The timeline area only shows doses via useNightTimeline — Luca's dose excluded
    const nurofenElements = screen.queryAllByText('Nurofen')
    // There might be 0 (no Maya doses) — the key assertion is Luca's dose is not in Maya view
    // Since no Maya doses were recorded, timeline should be empty (only the next-dose mark exists)
    // The next-dose mark shows 'Panadol' (default fallback) not 'Nurofen'
    // So if Nurofen appears, it leaked from Luca's records
    expect(nurofenElements).toHaveLength(0)
  })

  it('shows nothing from defaultTimeline stub (stub is removed)', () => {
    // With no doses seeded and now=23:00, there should be NO past dose dots
    // The only mark on the strip should be the next-dose dot
    render(<HomeB onStart={vi.fn()} />)

    // defaultTimeline stub added 'Nurofen' and 'Panadol' entries — verify they're gone
    // (the stub would render 3 dots: 2x Nurofen, 1x Panadol)
    // After removal, only the next-dose name appears in the button text, not on the strip
    const stripContainer = document.querySelector('[style*="position: relative"][style*="height: 90"]')
    // Since no doses are seeded, there should be no past-dose labels in the timeline
    // "Panadol" might appear in the button label only
    const allNurofen = screen.queryAllByText('Nurofen')
    expect(allNurofen).toHaveLength(0)
  })
})
