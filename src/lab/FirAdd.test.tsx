import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { childStore } from '../components/design/childStore'
import { doseStore } from '../components/design/doseStore'
import { loadMedications } from '../components/design/medicineStorage'
import { timelineStore } from '../components/design/timeline/store'
import { Fir } from './Fir'

const NOW = new Date('2026-06-07T23:00:00')
const facts = () => timelineStore.listFor('maya')

describe('Fir quick add and bead cards', () => {
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
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function openAdd() {
    render(<Fir />)
    fireEvent.click(screen.getByRole('button', { name: 'adaugă' }))
    return screen.getByRole('dialog', { name: 'adaugă' })
  }

  it('adds a temperature from the dial', () => {
    const sheet = openAdd()
    fireEvent.click(within(sheet).getByRole('tab', { name: /Temperatură/ }))
    fireEvent.click(within(sheet).getByRole('button', { name: 'mai cald' }))
    fireEvent.click(within(sheet).getByRole('button', { name: 'mai cald' }))
    expect(within(sheet).getByRole('slider', { name: 'temperatură' })).toHaveAttribute('aria-valuenow', '38.2')
    fireEvent.click(within(sheet).getByRole('button', { name: 'Adaugă' }))

    const temp = facts().find((f) => f.payload.kind === 'temperature')
    expect(temp?.payload).toEqual({ kind: 'temperature', celsius: 38.2 })
    expect(screen.getByText('38,2°')).toBeInTheDocument()
  })

  it('adds a dose given earlier', () => {
    const sheet = openAdd()
    fireEvent.click(within(sheet).getByRole('button', { name: /^Panadol Baby/ }))
    fireEvent.click(within(sheet).getByRole('radio', { name: 'acum 30 min' }))
    fireEvent.click(within(sheet).getByRole('button', { name: 'Adaugă' }))

    const dose = facts().find((f) => f.payload.kind === 'dose')
    expect(dose?.payload).toMatchObject({ medicationId: 'panadol', source: 'given' })
    expect(new Date(dose!.at).getTime()).toBe(NOW.getTime() - 30 * 60_000)
  })

  it('creates a new medicine inline and gives it', () => {
    const sheet = openAdd()
    fireEvent.click(within(sheet).getByRole('button', { name: 'Alt medicament' }))
    fireEvent.change(within(sheet).getByRole('textbox', { name: 'nume medicament' }), { target: { value: 'Sirop tuse' } })
    fireEvent.click(within(sheet).getByRole('radio', { name: 'picături' }))
    fireEvent.click(within(sheet).getByRole('button', { name: 'Adaugă' }))

    const med = loadMedications().find((m) => m.name === 'Sirop tuse')
    expect(med?.form).toBe('picaturi')
    expect(facts().some((f) => f.payload.kind === 'dose' && f.payload.medicationId === med?.id)).toBe(true)
  })

  it('adds a note from a pictogram preset', () => {
    const sheet = openAdd()
    fireEvent.click(within(sheet).getByRole('tab', { name: /Notă/ }))
    fireEvent.click(within(sheet).getByRole('button', { name: 'Doarme' }))
    fireEvent.click(within(sheet).getByRole('button', { name: 'Adaugă' }))
    expect(facts().find((f) => f.payload.kind === 'note')?.payload).toEqual({ kind: 'note', text: 'Doarme' })
  })

  it('deletes a given dose from its bead card, with undo', () => {
    act(() => {
      timelineStore.append({
        childId: 'maya',
        at: new Date('2026-06-07T21:00:00').toISOString(),
        payload: { kind: 'dose', medicationId: 'nurofen', source: 'given' },
      })
    })
    const { container } = render(<Fir />)
    fireEvent.click(container.querySelector('[data-bead="dose-given"]')!)
    fireEvent.click(within(screen.getByRole('dialog', { name: 'eveniment' })).getByRole('button', { name: 'Șterge' }))
    expect(facts()).toHaveLength(0)

    fireEvent.click(screen.getByRole('button', { name: 'Anulează' }))
    expect(facts()).toHaveLength(1)
  })

  it('gives a planned dose now from its bead card', () => {
    act(() => {
      timelineStore.append({
        childId: 'maya',
        at: new Date('2026-06-07T21:00:00').toISOString(),
        payload: { kind: 'dose', medicationId: 'nurofen', source: 'given' },
      })
    })
    const { container } = render(<Fir />)
    fireEvent.click(container.querySelector('.fir-bead--next')!)
    fireEvent.click(within(screen.getByRole('dialog', { name: 'eveniment' })).getByRole('button', { name: /^Am dat acum/ }))
    expect(facts().filter((f) => f.payload.kind === 'dose')).toHaveLength(2)
  })
})
