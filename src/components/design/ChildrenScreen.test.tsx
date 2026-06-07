import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { childStore } from './childStore'
import { ChildrenScreen } from './ChildrenScreen'

const MAYA_ID = 'maya'
const LUCA_ID = 'luca-cs-test'

function resetStore() {
  childStore.setState({
    children: [
      {
        id: MAYA_ID,
        name: 'Maya',
        weight: 13,
        years: 2,
        months: 4,
        initial: 'M',
        temp: 38.5,
        enabledMedications: ['nurofen', 'panadol'],
      },
      {
        id: LUCA_ID,
        name: 'Luca',
        weight: 20,
        years: 5,
        months: 0,
        initial: 'L',
        temp: 37.0,
        enabledMedications: [],
      },
    ],
    activeId: MAYA_ID,
  })
}

describe('ChildrenScreen', () => {
  beforeEach(() => {
    localStorage.clear()
    resetStore()
  })

  it('renders all children', () => {
    render(<ChildrenScreen onBack={vi.fn()} />)
    expect(screen.getByText('Maya')).toBeInTheDocument()
    expect(screen.getByText('Luca')).toBeInTheDocument()
  })

  it('marks the active child distinctly (aria-current or "activ" text)', () => {
    render(<ChildrenScreen onBack={vi.fn()} />)
    // Active child row should have "activ" marker or aria-current
    const activMarker = screen.queryByText('activ') ?? document.querySelector('[aria-current="true"]')
    expect(activMarker).toBeTruthy()
  })

  it('renders BSA and estimated height for each child', () => {
    render(<ChildrenScreen onBack={vi.fn()} />)
    // BSA values should appear — Maya 13kg → height 95cm → BSA ≈ 0.60
    // Luca 20kg → height 105cm → BSA ≈ 0.76
    const bsaElements = screen.getAllByText(/BSA/i)
    expect(bsaElements.length).toBeGreaterThanOrEqual(1)
    // Should show cm height estimate somewhere
    const cmElements = screen.getAllByText(/cm/i)
    expect(cmElements.length).toBeGreaterThanOrEqual(1)
  })

  it('shows "Editează" button per child and opens ChildEditor on click', async () => {
    const user = userEvent.setup()
    render(<ChildrenScreen onBack={vi.fn()} />)

    const editButtons = screen.getAllByRole('button', { name: /editează/i })
    expect(editButtons.length).toBeGreaterThanOrEqual(1)

    await user.click(editButtons[0])

    // ChildEditor opens — it shows "profil copil" eyebrow when open
    expect(screen.getByText(/profil copil/i)).toBeInTheDocument()
  })

  it('shows "Setează activ" only for non-active children', () => {
    render(<ChildrenScreen onBack={vi.fn()} />)
    // Luca is not active → has "Setează activ"
    const setActiveButtons = screen.getAllByRole('button', { name: /setează activ/i })
    expect(setActiveButtons).toHaveLength(1)
  })

  it('tapping "Setează activ" changes the active child', async () => {
    const user = userEvent.setup()
    render(<ChildrenScreen onBack={vi.fn()} />)

    const setActive = screen.getByRole('button', { name: /setează activ/i })
    await user.click(setActive)

    expect(childStore.get().activeId).toBe(LUCA_ID)
  })

  it('tapping "+ Adaugă copil" calls childStore.add()', async () => {
    const user = userEvent.setup()
    const addSpy = vi.spyOn(childStore, 'add')
    render(<ChildrenScreen onBack={vi.fn()} />)

    const addBtn = screen.getByRole('button', { name: /adaugă copil/i })
    await user.click(addBtn)

    expect(addSpy).toHaveBeenCalledOnce()
    addSpy.mockRestore()
  })

  it('tapping "Înapoi" calls onBack', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<ChildrenScreen onBack={onBack} />)

    // Footer Înapoi button
    const backBtn = screen.getByRole('button', { name: /^Înapoi$/i })
    await user.click(backBtn)

    expect(onBack).toHaveBeenCalledOnce()
  })

  it('shows enabled medications for the active child by name', () => {
    render(<ChildrenScreen onBack={vi.fn()} />)
    // Maya has nurofen and panadol enabled
    // Section heading should mention active name
    expect(screen.getByText(/medicamente active pentru Maya/i)).toBeInTheDocument()
    // Medication names should appear
    expect(screen.getByText(/Nurofen/i)).toBeInTheDocument()
    expect(screen.getByText(/Panadol/i)).toBeInTheDocument()
  })

  it('shows a message when active child has no enabled medications', () => {
    // Set Luca as active (no medications)
    act(() => {
      childStore.setActive(LUCA_ID)
    })
    render(<ChildrenScreen onBack={vi.fn()} />)
    expect(screen.getByText(/medicamente active pentru Luca/i)).toBeInTheDocument()
    // Should indicate no medications
    expect(screen.getByText(/niciun medicament/i)).toBeInTheDocument()
  })
})
