import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { childStore } from '../childStore'
import { encodeShare } from './encoder'
import type { SharePayload } from './types'
import type { Child } from '../../../types'
import { ImportGate } from './ImportGate'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const LOCAL_CHILD: Child = {
  id: 'local-1',
  name: 'Maya',
  weight: 13,
  years: 2,
  months: 4,
  initial: 'M',
  temp: 39.5,
  enabledMedications: ['nurofen'],
}

const INCOMING_CHILD_UPDATE: Child = {
  id: 'local-1',
  name: 'Maya Updated',
  weight: 14,
  years: 2,
  months: 5,
  initial: 'M',
  // no temp — stripped by encoder
  enabledMedications: ['nurofen', 'panadol'],
}

const INCOMING_NEW_CHILD: Child = {
  id: 'new-child',
  name: 'Luca',
  weight: 20,
  years: 5,
  months: 0,
  initial: 'L',
  enabledMedications: [],
}

function makePayload(children: Child[]): SharePayload {
  return { v: 1, children, sentAt: new Date().toISOString() }
}

function makeImportSearch(payload: SharePayload): string {
  const encoded = encodeShare(payload)
  return `?import=${encodeURIComponent(encoded)}`
}

// ---------------------------------------------------------------------------
// Setup: control window.location.search + history via jsdom history API
// ---------------------------------------------------------------------------

function setSearch(search: string) {
  // Use history.pushState to set the URL without navigation
  window.history.pushState({}, '', search)
}

function clearSearch() {
  window.history.pushState({}, '', '/')
}

const mockReplaceState = vi.spyOn(window.history, 'replaceState')

beforeEach(() => {
  localStorage.clear()
  childStore.setState({ children: [LOCAL_CHILD], activeId: LOCAL_CHILD.id })
  mockReplaceState.mockClear()
  clearSearch()
})

afterEach(() => {
  clearSearch()
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ImportGate', () => {
  it('renders children without a sheet when no import param present', async () => {
    render(
      <ImportGate>
        <div>App content</div>
      </ImportGate>,
    )
    await waitFor(() => {
      expect(screen.getByText('App content')).toBeInTheDocument()
    })
    expect(screen.queryByText(/importă date partajate/i)).not.toBeInTheDocument()
  })

  it('renders children (app) behind the sheet when import param present', async () => {
    setSearch(makeImportSearch(makePayload([INCOMING_NEW_CHILD])))
    render(
      <ImportGate>
        <div>App content</div>
      </ImportGate>,
    )
    await waitFor(() => {
      expect(screen.getByText('App content')).toBeInTheDocument()
      expect(screen.getByText(/importă date partajate/i)).toBeInTheDocument()
    })
  })

  it('shows "Adaugă" in summary for new children', async () => {
    setSearch(makeImportSearch(makePayload([INCOMING_NEW_CHILD])))
    render(<ImportGate><div>App</div></ImportGate>)
    await waitFor(() => {
      expect(screen.getByText(/luca/i)).toBeInTheDocument()
    })
    // Should show something like "Adaugă: Luca"
    expect(screen.getByText(/adaugă/i)).toBeInTheDocument()
  })

  it('shows "Actualizează" in summary for updated children', async () => {
    setSearch(makeImportSearch(makePayload([INCOMING_CHILD_UPDATE])))
    render(<ImportGate><div>App</div></ImportGate>)
    await waitFor(() => {
      expect(screen.getByText(/actualizează/i)).toBeInTheDocument()
      expect(screen.getByText(/maya updated/i)).toBeInTheDocument()
    })
  })

  it('has "Importă" and "Anulează" buttons', async () => {
    setSearch(makeImportSearch(makePayload([INCOMING_NEW_CHILD])))
    render(<ImportGate><div>App</div></ImportGate>)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^importă$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^anulează$/i })).toBeInTheDocument()
    })
  })

  it('"Importă" merges new children into childStore and closes sheet', async () => {
    const user = userEvent.setup()
    setSearch(makeImportSearch(makePayload([INCOMING_NEW_CHILD])))
    render(<ImportGate><div>App</div></ImportGate>)

    await waitFor(() => screen.getByRole('button', { name: /^importă$/i }))
    await user.click(screen.getByRole('button', { name: /^importă$/i }))

    await waitFor(() => {
      expect(screen.queryByText(/importă date partajate/i)).not.toBeInTheDocument()
    })

    const { children } = childStore.get()
    expect(children.some((c) => c.id === INCOMING_NEW_CHILD.id)).toBe(true)
  })

  it('"Importă" overwrites updated child fields in childStore', async () => {
    const user = userEvent.setup()
    setSearch(makeImportSearch(makePayload([INCOMING_CHILD_UPDATE])))
    render(<ImportGate><div>App</div></ImportGate>)

    await waitFor(() => screen.getByRole('button', { name: /^importă$/i }))
    await user.click(screen.getByRole('button', { name: /^importă$/i }))

    await waitFor(() => {
      const { children } = childStore.get()
      const child = children.find((c) => c.id === 'local-1')!
      expect(child.name).toBe('Maya Updated')
      expect(child.weight).toBe(14)
    })
  })

  it('"Importă" preserves local temp on updated child', async () => {
    const user = userEvent.setup()
    setSearch(makeImportSearch(makePayload([INCOMING_CHILD_UPDATE])))
    render(<ImportGate><div>App</div></ImportGate>)

    await waitFor(() => screen.getByRole('button', { name: /^importă$/i }))
    await user.click(screen.getByRole('button', { name: /^importă$/i }))

    await waitFor(() => {
      const { children } = childStore.get()
      const child = children.find((c) => c.id === 'local-1')!
      expect(child.temp).toBe(39.5) // local temp preserved
    })
  })

  it('"Importă" calls history.replaceState to clean URL', async () => {
    const user = userEvent.setup()
    setSearch(makeImportSearch(makePayload([INCOMING_NEW_CHILD])))
    render(<ImportGate><div>App</div></ImportGate>)

    await waitFor(() => screen.getByRole('button', { name: /^importă$/i }))
    await user.click(screen.getByRole('button', { name: /^importă$/i }))

    await waitFor(() => {
      expect(mockReplaceState).toHaveBeenCalledWith(null, '', window.location.pathname)
    })
  })

  it('"Anulează" closes sheet without merging', async () => {
    const user = userEvent.setup()
    setSearch(makeImportSearch(makePayload([INCOMING_NEW_CHILD])))
    render(<ImportGate><div>App</div></ImportGate>)

    await waitFor(() => screen.getByRole('button', { name: /^anulează$/i }))
    await user.click(screen.getByRole('button', { name: /^anulează$/i }))

    await waitFor(() => {
      expect(screen.queryByText(/importă date partajate/i)).not.toBeInTheDocument()
    })

    const { children } = childStore.get()
    expect(children.every((c) => c.id !== INCOMING_NEW_CHILD.id)).toBe(true)
  })

  it('"Anulează" cleans the URL', async () => {
    const user = userEvent.setup()
    setSearch(makeImportSearch(makePayload([INCOMING_NEW_CHILD])))
    render(<ImportGate><div>App</div></ImportGate>)

    await waitFor(() => screen.getByRole('button', { name: /^anulează$/i }))
    await user.click(screen.getByRole('button', { name: /^anulează$/i }))

    await waitFor(() => {
      expect(mockReplaceState).toHaveBeenCalledWith(null, '', window.location.pathname)
    })
  })

  it('shows error sheet for undecodable import param', async () => {
    window.history.pushState({}, '', '?import=garbage_not_valid')
    render(<ImportGate><div>App</div></ImportGate>)

    await waitFor(() => {
      expect(screen.getByText(/link invalid/i)).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: /^închide$/i })).toBeInTheDocument()
  })

  it('"Închide" on error sheet cleans the URL', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '?import=garbage_not_valid')
    render(<ImportGate><div>App</div></ImportGate>)

    await waitFor(() => screen.getByRole('button', { name: /^închide$/i }))
    await user.click(screen.getByRole('button', { name: /^închide$/i }))

    await waitFor(() => {
      expect(mockReplaceState).toHaveBeenCalledWith(null, '', window.location.pathname)
    })
  })

  it('"Importă" also writes medications to localStorage when payload has medications', async () => {
    const user = userEvent.setup()
    const payloadWithMeds: SharePayload = {
      ...makePayload([INCOMING_NEW_CHILD]),
      medications: [
        {
          id: 'custom-med',
          name: 'Custom',
          doseType: 'fixed',
          doseConfig: { type: 'fixed', amount: '5', unit: 'ml' },
          color: '#ff0',
          notes: '',
        },
      ],
    }
    setSearch(makeImportSearch(payloadWithMeds))
    render(<ImportGate><div>App</div></ImportGate>)

    await waitFor(() => screen.getByRole('button', { name: /^importă$/i }))
    await user.click(screen.getByRole('button', { name: /^importă$/i }))

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('tratament-copii-medications') ?? '[]')
      expect(stored.some((m: { id: string }) => m.id === 'custom-med')).toBe(true)
    })
  })
})
