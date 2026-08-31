import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { fireEvent, render, screen, act } from '@testing-library/react'
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
    setStandalone(false)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders "noaptea asta" eyebrow', () => {
    render(<HomeB onStart={vi.fn()} onMenu={vi.fn()} />)
    expect(screen.getByText('noaptea asta')).toBeInTheDocument()
  })

  it('renders dose short names for doses within the window', () => {
    const t1 = new Date('2026-06-07T21:30:00').toISOString()
    const t2 = new Date('2026-06-07T22:00:00').toISOString()
    act(() => {
      doseStore.record({ childId: MAYA_ID, medicationId: 'nurofen', scheduledAt: t1, administeredAt: t1 })
      doseStore.record({ childId: MAYA_ID, medicationId: 'panadol', scheduledAt: t2, administeredAt: t2 })
    })

    render(<HomeB onStart={vi.fn()} onMenu={vi.fn()} />)

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
    render(<HomeB onStart={vi.fn()} onMenu={vi.fn()} />)

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
    render(<HomeB onStart={vi.fn()} onMenu={vi.fn()} />)

    // defaultTimeline stub added 'Nurofen' and 'Panadol' entries — verify they're gone
    // (the stub would render 3 dots: 2x Nurofen, 1x Panadol)
    // After removal, only the next-dose name appears in the button text, not on the strip
    // Since no doses are seeded, there should be no past-dose labels in the timeline
    // "Panadol" might appear in the button label only
    const allNurofen = screen.queryAllByText('Nurofen')
    expect(allNurofen).toHaveLength(0)
  })

  it('does not show a countdown, next marker, or fake Panadol before treatment exists', () => {
    render(<HomeB onStart={vi.fn()} onMenu={vi.fn()} />)

    expect(screen.queryByText(/mai sunt/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Panadol/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /urm/i })).not.toBeInTheDocument()
  })

  it('shows a Panadol countdown after a recorded Nurofen dose', () => {
    const lastAt = new Date('2026-06-07T21:00:00').toISOString()
    act(() => {
      doseStore.record({
        childId: MAYA_ID,
        medicationId: 'nurofen',
        scheduledAt: lastAt,
        administeredAt: lastAt,
      })
    })

    render(<HomeB onStart={vi.fn()} onMenu={vi.fn()} />)

    expect(screen.getByText(/mai sunt/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /urm/i })).toBeInTheDocument()
    expect(screen.getAllByText(/Panadol/i).length).toBeGreaterThanOrEqual(1)
  })

  it("does not show a countdown from another child's recorded dose", () => {
    seedLuca()
    const lastAt = new Date('2026-06-07T21:00:00').toISOString()
    act(() => {
      doseStore.record({
        childId: LUCA_ID,
        medicationId: 'nurofen',
        scheduledAt: lastAt,
        administeredAt: lastAt,
      })
    })
    childStore.setActive(MAYA_ID)

    render(<HomeB onStart={vi.fn()} onMenu={vi.fn()} />)

    expect(screen.queryByText(/mai sunt/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /urm/i })).not.toBeInTheDocument()
  })

  it('tells the parent to give the next medicine now when the 4h floor has elapsed', () => {
    const lastAt = new Date('2026-06-07T18:00:00').toISOString()
    act(() => {
      doseStore.record({
        childId: MAYA_ID,
        medicationId: 'nurofen',
        scheduledAt: lastAt,
        administeredAt: lastAt,
      })
    })

    render(<HomeB onStart={vi.fn()} onMenu={vi.fn()} />)

    expect(screen.getByText(/dă/i)).toBeInTheDocument()
    expect(screen.queryByText(/mai sunt/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /urm/i })).toBeInTheDocument()
  })

  it('keeps the now marker centered and puts the acum label below the timeline', () => {
    render(<HomeB onStart={vi.fn()} onMenu={vi.fn()} />)

    const marker = screen.getByTestId('now-marker')
    expect(marker).toHaveStyle({ left: '50%' })
    expect(marker).not.toHaveTextContent('▼')
    expect(screen.getByTestId('now-dot')).toBeInTheDocument()

    const label = screen.getByText('acum')
    expect(marker).toContainElement(label)
    expect(Number.parseFloat(label.style.top)).toBeGreaterThanOrEqual(70)
  })

  it('keeps acum below the timeline when a recent dose dot sits near now', () => {
    const lastAt = new Date('2026-06-07T22:50:00').toISOString()
    act(() => {
      doseStore.record({
        childId: MAYA_ID,
        medicationId: 'nurofen',
        scheduledAt: lastAt,
        administeredAt: lastAt,
      })
    })

    render(<HomeB onStart={vi.fn()} onMenu={vi.fn()} />)

    const label = screen.getByText('acum')
    expect(Number.parseFloat(label.style.top)).toBeGreaterThanOrEqual(70)
    expect(screen.getByTestId('now-dot')).toBeInTheDocument()
  })

  it('renders separate child, profile, and temperature controls', () => {
    const onMenu = vi.fn()
    render(<HomeB onStart={vi.fn()} onMenu={onMenu} />)

    fireEvent.click(screen.getByRole('button', { name: /copil maya/i }))
    expect(onMenu).toHaveBeenCalledOnce()

    fireEvent.click(screen.getByRole('button', { name: /profil/i }))
    expect(screen.getByText(/profil copil/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /temperatura/i }))
    expect(screen.getByText(/salveaz/i)).toBeInTheDocument()
  })

  it('prompts install when beforeinstallprompt is available', () => {
    const prompt = vi.fn().mockResolvedValue(undefined)
    render(<HomeB onStart={vi.fn()} onMenu={vi.fn()} />)

    const event = new Event('beforeinstallprompt') as Event & { prompt: () => Promise<void> }
    Object.assign(event, { prompt })
    const preventDefault = vi.spyOn(event, 'preventDefault')
    window.dispatchEvent(event)

    expect(preventDefault).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByRole('button', { name: /instaleaz/i }))
    expect(prompt).toHaveBeenCalledOnce()
  })

  it('shows manual install guidance when install prompt is unsupported', () => {
    render(<HomeB onStart={vi.fn()} onMenu={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: /instaleaz/i }))

    expect(screen.getByText(/adaug/i)).toBeInTheDocument()
    expect(screen.getByText(/ecran/i)).toBeInTheDocument()
  })

  it('hides install affordance when already running standalone', () => {
    setStandalone(true)

    render(<HomeB onStart={vi.fn()} onMenu={vi.fn()} />)

    expect(screen.queryByRole('button', { name: /instaleaz/i })).not.toBeInTheDocument()
  })
})

function setStandalone(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === '(display-mode: standalone)' ? matches : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
    configurable: true,
  })
}
