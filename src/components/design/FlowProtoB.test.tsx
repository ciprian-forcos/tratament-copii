import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { childStore } from './childStore'
import { doseStore } from './doseStore'
import { FlowProtoB } from './FlowProtoB'
import { ImportGate } from './share/ImportGate'
import { encodeShare } from './share/encoder'
import type { SharePayload } from './share/types'

beforeEach(() => {
  localStorage.clear()
  doseStore.clear()
  window.history.pushState({}, '', '/')
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
    expect(screen.getAllByText(/Nurofen/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Panadol/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Novocalmin/i).length).toBeGreaterThan(0)
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

  it('shows imported medicines without requiring a reload', async () => {
    const user = userEvent.setup()
    const payload: SharePayload = {
      v: 1,
      children: childStore.get().children,
      medications: [
        {
          id: 'imported-med',
          name: 'Import sirop',
          doseType: 'fixed',
          doseConfig: { type: 'fixed', amount: '5', unit: 'ml' },
          color: '#3b82f6',
          notes: '',
        },
      ],
      sentAt: new Date().toISOString(),
    }
    window.history.pushState({}, '', `?import=${encodeURIComponent(encodeShare(payload))}`)

    render(
      <ImportGate>
        <FlowProtoB />
      </ImportGate>,
    )

    await waitFor(() => screen.getByRole('button', { name: /^importă$/i }))
    await user.click(screen.getByRole('button', { name: /^importă$/i }))
    await openMedicines(user)

    expect(screen.getByText('Import sirop')).toBeInTheDocument()
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

describe('FlowProtoB treatment episode', () => {
  it('starts the wizard when there is no in-episode history', async () => {
    const user = userEvent.setup()
    render(<FlowProtoB />)

    await user.click(screen.getByRole('button', { name: /începe tratamentul/i }))

    expect(screen.getByText(/cât are acum/i)).toBeInTheDocument()
  })

  it('opens the plan card from Home when a recent dose exists', async () => {
    const user = userEvent.setup()
    const lastAt = new Date(Date.now() - 30 * 60_000).toISOString()
    doseStore.record({
      childId: 'maya',
      medicationId: 'nurofen',
      scheduledAt: lastAt,
      administeredAt: lastAt,
    })

    render(<FlowProtoB />)

    await user.click(screen.getByRole('button', { name: /urm/i }))

    expect(screen.getByRole('heading', { name: /Panadol/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /am dat doza/i })).toBeDisabled()
  })

  it('after recording the first dose, Home continues the episode', async () => {
    const user = userEvent.setup()
    render(<FlowProtoB />)

    await user.click(screen.getByRole('button', { name: /începe tratamentul/i }))
    await user.click(screen.getByRole('button', { name: /continuă/i }))
    await user.click(screen.getByRole('button', { name: /generează planul/i }))
    await user.click(screen.getByRole('button', { name: /am dat doza/i }))

    expect(screen.getByText('noaptea asta')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /urm/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /urm/i }))

    expect(screen.getByRole('heading', { name: /Panadol/i })).toBeInTheDocument()
  })
})
