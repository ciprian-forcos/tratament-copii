import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { childStore } from './childStore'
import { FlowProtoB } from './FlowProtoB'

beforeEach(() => {
  localStorage.clear()
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
        enabledMedications: [],
      },
    ],
    activeId: 'maya',
  })
})

describe('FlowProtoB medicine routing', () => {
  it('opens the restored Medicamente route from ChildrenScreen', async () => {
    const user = userEvent.setup()
    render(<FlowProtoB />)

    await openMedicines(user)

    expect(screen.getByRole('button', { name: /adaug/i })).toBeInTheDocument()
    expect(screen.getByText(/Nurofen/i)).toBeInTheDocument()
    expect(screen.getByText(/Panadol/i)).toBeInTheDocument()
    expect(screen.getByText(/Novocalmin/i)).toBeInTheDocument()
  })

  it('persists a medicine added through Medicamente and reads it after remount', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<FlowProtoB />)

    await openMedicines(user)
    await user.click(screen.getByRole('button', { name: /adaug/i }))
    await user.type(screen.getByPlaceholderText(/ibuprofen/i), 'Test sirop')
    await user.click(screen.getByRole('button', { name: /salveaz/i }))

    expect(localStorage.getItem('tratament-copii-medications')).toContain('Test sirop')

    unmount()
    render(<FlowProtoB />)
    await openMedicines(user)

    expect(screen.getByText('Test sirop')).toBeInTheDocument()
  })
})

async function openMedicines(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /meniu/i }))
  await user.click(screen.getByRole('button', { name: /medicamente/i }))
}

describe('FlowProtoB ≡ menu routing', () => {
  it('tapping ≡ opens ChildrenScreen', async () => {
    const user = userEvent.setup()
    render(<FlowProtoB />)

    // Should be on home screen
    expect(screen.getByText('noaptea asta')).toBeInTheDocument()

    // Tap ≡
    const menuBtn = screen.getByRole('button', { name: /meniu/i })
    await user.click(menuBtn)

    // ChildrenScreen should be visible
    expect(screen.getByText('Copii')).toBeInTheDocument()
  })

  it('tapping Înapoi from ChildrenScreen returns to HomeB', async () => {
    const user = userEvent.setup()
    render(<FlowProtoB />)

    // Navigate to ChildrenScreen
    const menuBtn = screen.getByRole('button', { name: /meniu/i })
    await user.click(menuBtn)
    expect(screen.getByText('Copii')).toBeInTheDocument()

    // Tap Înapoi
    const backBtn = screen.getByRole('button', { name: /^Înapoi$/i })
    await user.click(backBtn)

    // Back on home screen
    expect(screen.getByText('noaptea asta')).toBeInTheDocument()
  })
})
