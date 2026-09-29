import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { childStore } from '../components/design/childStore'
import { doseStore } from '../components/design/doseStore'
import { timelineStore } from '../components/design/timeline/store'
import { Fir } from './Fir'

describe('Fir faces and settings', () => {
  beforeEach(() => {
    doseStore.clear()
    timelineStore.clear()
    localStorage.clear()
    timelineStore.reloadFromStorage()
    childStore.setState({
      children: [
        { id: 'maya', name: 'Maya', weight: 13, years: 2, months: 4, initial: 'M', enabledMedications: [] },
        { id: 'luca', name: 'Luca', weight: 18, years: 4, months: 1, initial: 'L', enabledMedications: [] },
      ],
      activeId: 'maya',
    })
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-07T23:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('switches child by tapping a face', () => {
    render(<Fir />)
    const faces = screen.getByRole('group', { name: 'copii' })
    expect(within(faces).getByRole('button', { name: 'Maya' })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(within(faces).getByRole('button', { name: 'Luca' }))
    expect(childStore.get().activeId).toBe('luca')
    expect(within(faces).getByRole('button', { name: 'Luca' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('flushes the face of a child with a recent fever', () => {
    act(() => {
      timelineStore.append({
        childId: 'maya',
        at: new Date('2026-06-07T22:30:00').toISOString(),
        payload: { kind: 'temperature', celsius: 38.7 },
      })
    })
    render(<Fir />)
    const faces = screen.getByRole('group', { name: 'copii' })
    expect(within(faces).getByRole('button', { name: 'Maya' }).querySelector('[data-mood]')).toHaveAttribute('data-mood', 'febra')
    expect(within(faces).getByRole('button', { name: 'Luca' }).querySelector('[data-mood]')).toHaveAttribute('data-mood', 'bine')
  })

  it('opens the child editor on a long press of a face', () => {
    render(<Fir />)
    fireEvent.contextMenu(within(screen.getByRole('group', { name: 'copii' })).getByRole('button', { name: 'Maya' }))
    expect(screen.getAllByRole('button', { name: 'plus' }).length).toBeGreaterThan(0)
  })

  it('turns a medicine on for the child from the treatment settings', () => {
    render(<Fir />)
    fireEvent.click(screen.getByRole('button', { name: 'setări tratament' }))
    const sheet = screen.getByRole('dialog', { name: 'tratament' })
    fireEvent.click(within(sheet).getByRole('switch', { name: /Vitamina D/ }))
    expect(childStore.get().children.find((c) => c.id === 'maya')?.enabledMedications).toContain('vitamina_d')
  })

  it('opens sharing from the treatment settings', () => {
    render(<Fir />)
    fireEvent.click(screen.getByRole('button', { name: 'setări tratament' }))
    fireEvent.click(within(screen.getByRole('dialog', { name: 'tratament' })).getByRole('button', { name: /Trimite/ }))
    expect(screen.getByText('Trimite toată aplicația')).toBeInTheDocument()
  })
})
