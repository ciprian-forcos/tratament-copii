import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { childStore } from '../components/design/childStore'
import { doseStore } from '../components/design/doseStore'
import { timelineStore } from '../components/design/timeline/store'
import { Fir } from './Fir'

const doses = () => timelineStore.listFor('maya').filter((f) => f.payload.kind === 'dose')

describe('Fir', () => {
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
    act(() => {
      timelineStore.append({
        childId: 'maya',
        at: new Date(at).toISOString(),
        payload: { kind: 'dose', medicationId: 'nurofen', source: 'given' },
      })
    })
  }

  it('starts a treatment with one tap and lets you undo it', () => {
    render(<Fir />)
    expect(screen.getByText('Ce ai dat?')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^Am dat Nurofen/ }))
    expect(doses()).toHaveLength(1)
    expect(screen.getByRole('status')).toHaveTextContent('Nurofen')

    fireEvent.click(screen.getByRole('button', { name: 'Anulează' }))
    expect(doses()).toHaveLength(0)
  })

  it('shows the next dose with its amount and how long until it is due', () => {
    recordNurofen('2026-06-07T21:00:00')
    render(<Fir />)
    const card = screen.getByRole('region', { name: 'urmează' })
    expect(card).toHaveTextContent('Panadol Baby')
    expect(card).toHaveTextContent('8 ml')
    expect(card).toHaveTextContent('peste 2 h')
  })

  it('records the next dose once even when Am dat is tapped twice', () => {
    recordNurofen('2026-06-07T21:00:00')
    render(<Fir />)
    const give = screen.getByRole('button', { name: /^Am dat Panadol Baby/ })
    fireEvent.click(give)
    fireEvent.click(give)
    expect(doses()).toHaveLength(2)
  })

  it('hides the undo after six seconds', () => {
    render(<Fir />)
    fireEvent.click(screen.getByRole('button', { name: /^Am dat Nurofen/ }))
    expect(screen.getByRole('status')).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(6500)
    })
    expect(screen.queryByRole('button', { name: 'Anulează' })).not.toBeInTheDocument()
  })

  it('threads given and planned doses and temperature pins', () => {
    recordNurofen('2026-06-07T21:00:00')
    act(() => {
      timelineStore.append({
        childId: 'maya',
        at: new Date('2026-06-07T21:30:00').toISOString(),
        payload: { kind: 'temperature', celsius: 38.5 },
      })
    })
    const { container } = render(<Fir />)
    expect(container.querySelectorAll('[data-bead="dose-given"]')).toHaveLength(1)
    expect(container.querySelectorAll('[data-bead="dose-planned"]').length).toBeGreaterThan(0)
    expect(screen.getByText('38,5°')).toBeInTheDocument()
  })
})
