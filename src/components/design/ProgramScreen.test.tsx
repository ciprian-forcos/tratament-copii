import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { DEFAULT_MEDICATIONS } from '../../data/medications'
import { childStore } from './childStore'
import { doseStore } from './doseStore'
import { ProgramScreen, START_TIME_KEY } from './ProgramScreen'

function seedMaya() {
  childStore.setState({
    children: [
      {
        id: 'maya',
        name: 'Maya',
        weight: 13,
        years: 2,
        months: 4,
        initial: 'M',
        temp: 38.5,
        enabledMedications: ['nurofen', 'panadol'],
      },
    ],
    activeId: 'maya',
  })
}

describe('ProgramScreen', () => {
  beforeEach(() => {
    localStorage.clear()
    doseStore.clear()
    seedMaya()
    localStorage.setItem(START_TIME_KEY, JSON.stringify('2026-08-25T08:00'))
  })

  it('renders the 24h program for enabled medicines', () => {
    render(
      <ProgramScreen
        medications={DEFAULT_MEDICATIONS}
        onFever={vi.fn()}
      />,
    )

    expect(screen.getByText('Program')).toBeInTheDocument()
    expect(screen.getAllByText('Nurofen').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /tratament febră/i })).toBeInTheDocument()
  })

  it('records and unrecords a scheduled dose', () => {
    render(
      <ProgramScreen
        medications={DEFAULT_MEDICATIONS}
        onFever={vi.fn()}
      />,
    )

    const mark = screen.getAllByRole('button', { name: /marchează ca administrat/i })[0]
    fireEvent.click(mark)
    expect(doseStore.list()).toHaveLength(1)

    fireEvent.click(screen.getAllByRole('button', { name: /marchează ca neadministrat/i })[0])
    expect(doseStore.list()).toHaveLength(0)
  })

  it('opens rule editing from the rules list', () => {
    render(
      <ProgramScreen
        medications={DEFAULT_MEDICATIONS}
        onFever={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /reguli de administrare/i }))
    fireEvent.click(screen.getAllByRole('button', { name: /editează regulă/i })[0])
    expect(screen.getByText(/editează regula/i)).toBeInTheDocument()
  })
})
