import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { childStore } from '../components/design/childStore'
import { doseStore } from '../components/design/doseStore'
import { timelineStore } from '../components/design/timeline/store'
import { Grafic } from './Grafic'

const NOW = new Date('2026-06-07T23:00:00')
const H = 3600_000

function add(childId: string, hoursAgo: number, payload: Parameters<typeof timelineStore.append>[0]['payload']) {
  act(() => {
    timelineStore.append({ childId, at: new Date(NOW.getTime() - hoursAgo * H).toISOString(), payload })
  })
}

describe('Grafic', () => {
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
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('quotes the latest temperature like a price, with its change over the range', () => {
    add('maya', 4, { kind: 'temperature', celsius: 38 })
    add('maya', 1, { kind: 'temperature', celsius: 38.6 })
    render(<Grafic />)
    const quote = screen.getByRole('region', { name: 'cotație' })
    expect(quote).toHaveTextContent('38,6°')
    expect(quote).toHaveTextContent('+0,6°')
  })

  it('switches the range', () => {
    add('maya', 1, { kind: 'temperature', celsius: 38.6 })
    render(<Grafic />)
    fireEvent.click(screen.getByRole('tab', { name: '1Z' }))
    expect(screen.getByRole('tab', { name: '1Z' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: '6O' })).toHaveAttribute('aria-selected', 'false')
  })

  it('draws given doses as volume bars', () => {
    add('maya', 1, { kind: 'temperature', celsius: 38.6 })
    add('maya', 2, { kind: 'dose', medicationId: 'nurofen', source: 'given' })
    add('maya', 5, { kind: 'dose', medicationId: 'panadol', source: 'given' })
    const { container } = render(<Grafic />)
    expect(container.querySelectorAll('[data-vol="given"]')).toHaveLength(2)
    expect(container.querySelectorAll('[data-vol="planned"]').length).toBeGreaterThan(0)
  })

  it('lists every child on the watchlist and switches on tap', () => {
    add('luca', 1, { kind: 'temperature', celsius: 37.1 })
    render(<Grafic />)
    const list = screen.getByRole('list', { name: 'copii' })
    expect(within(list).getByRole('button', { name: /Luca/ })).toHaveTextContent('37,1°')
    fireEvent.click(within(list).getByRole('button', { name: /Luca/ }))
    expect(childStore.get().activeId).toBe('luca')
  })

  it('opens quick add on the temperature dial from the ticket', () => {
    add('maya', 1, { kind: 'temperature', celsius: 38.6 })
    render(<Grafic />)
    fireEvent.click(screen.getByRole('button', { name: 'Temperatură' }))
    const sheet = screen.getByRole('dialog', { name: 'adaugă' })
    expect(within(sheet).getByRole('tab', { name: /Temperatură/ })).toHaveAttribute('aria-selected', 'true')
  })

  it('loads a made-up episode when there is nothing to chart yet', () => {
    render(<Grafic />)
    fireEvent.click(screen.getByRole('button', { name: 'Încarcă un exemplu' }))
    expect(timelineStore.listFor('maya').filter((f) => f.payload.kind === 'temperature').length).toBeGreaterThan(5)
    expect(screen.getByRole('region', { name: 'cotație' })).toHaveTextContent('°')
  })
})
