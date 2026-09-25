import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { fireEvent, render, screen, act } from '@testing-library/react'
import { doseStore } from './doseStore'
import { childStore } from './childStore'
import { HomeB } from './HomeB'
import { timelineStore } from './timeline/store'

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

describe('HomeB timeline', () => {
  beforeEach(() => {
    doseStore.clear()
    timelineStore.clear()
    localStorage.clear()
    timelineStore.reloadFromStorage()
    childStore.setState({
      children: [
        { id: MAYA_ID, name: 'Maya', weight: 13, years: 2, months: 4, initial: 'M', temp: 38.5, enabledMedications: [] },
      ],
      activeId: MAYA_ID,
    })
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-07T23:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps the now marker centered', () => {
    render(<HomeB />)
    expect(screen.getByText('acum').parentElement).toHaveStyle({ left: '50%' })
  })

  it('renders a pull-down grabber and no clock or panic toggle', () => {
    render(<HomeB />)
    expect(screen.getByRole('button', { name: /copii și medicamente/i })).toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: /calm/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('radiogroup', { name: /panic/i })).not.toBeInTheDocument()
  })

  it('renders dose short names for doses within the window', () => {
    const t1 = new Date('2026-06-07T21:30:00').toISOString()
    const t2 = new Date('2026-06-07T22:00:00').toISOString()
    act(() => {
      doseStore.record({ childId: MAYA_ID, medicationId: 'nurofen', scheduledAt: t1, administeredAt: t1 })
      doseStore.record({ childId: MAYA_ID, medicationId: 'panadol', scheduledAt: t2, administeredAt: t2 })
    })

    render(<HomeB />)

    expect(screen.getAllByText('Nurofen').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Panadol Baby').length).toBeGreaterThanOrEqual(1)
  })

  it('does not render doses for another child', () => {
    seedLuca()
    const t1 = new Date('2026-06-07T22:00:00').toISOString()
    act(() => {
      doseStore.record({ childId: LUCA_ID, medicationId: 'nurofen', scheduledAt: t1, administeredAt: t1 })
    })
    childStore.setActive(MAYA_ID)
    render(<HomeB />)
    expect(screen.queryAllByText('Nurofen')).toHaveLength(0)
  })

  it('does not show a next dose before treatment exists', () => {
    render(<HomeB />)
    expect(screen.queryByText(/dă/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Panadol/i)).not.toBeInTheDocument()
  })

  it('shows a Panadol mark after a recorded Nurofen dose', () => {
    const lastAt = new Date('2026-06-07T21:00:00').toISOString()
    act(() => {
      doseStore.record({
        childId: MAYA_ID,
        medicationId: 'nurofen',
        scheduledAt: lastAt,
        administeredAt: lastAt,
      })
    })

    render(<HomeB />)

    expect(screen.getAllByText(/Nurofen/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Panadol/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('8 ml')).toBeInTheDocument()
  })

  it("does not show a next dose from another child's recorded dose", () => {
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

    render(<HomeB />)

    expect(screen.queryByText(/dă/i)).not.toBeInTheDocument()
    expect(screen.queryAllByText(/Panadol/i)).toHaveLength(0)
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

    render(<HomeB />)

    expect(screen.getByText(/dă/i)).toBeInTheDocument()
  })

  it('opens child and medicine chips from the pull-down grabber', () => {
    render(<HomeB />)
    fireEvent.click(screen.getByRole('button', { name: /copii și medicamente/i }))
    expect(screen.getByRole('button', { name: /copil maya/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /nurofen/i })).toBeInTheDocument()
  })

  it('does not paint a temperature fact on the line', () => {
    act(() => {
      timelineStore.append({
        childId: MAYA_ID,
        at: '2026-06-07T22:10:00',
        payload: { kind: 'temperature', celsius: 38.4 },
      })
    })
    render(<HomeB />)
    expect(screen.queryByText(/38.4/)).not.toBeInTheDocument()
    expect(screen.getByText('acum')).toBeInTheDocument()
  })

  it('opens the attach sheet when the strip is tapped', () => {
    render(<HomeB />)
    const strip = screen.getByLabelText(/bandă de timp/i)
    fireEvent.pointerDown(strip, { pointerId: 1, clientX: 100, clientY: 40 })
    fireEvent.pointerUp(strip, { pointerId: 1, clientX: 100, clientY: 40 })
    expect(screen.getByRole('button', { name: /confirmă/i })).toBeInTheDocument()
    expect(screen.getByText('Am dat doza')).toBeInTheDocument()
    expect(screen.getByText('Temperatură')).toBeInTheDocument()
  })
})
