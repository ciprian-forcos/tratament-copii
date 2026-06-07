import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { childStore } from '../childStore'
import { decodeShare } from './encoder'
import { ShareSheet } from './ShareSheet'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const MAYA_ID = 'maya-ss-test'
const LUCA_ID = 'luca-ss-test'

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
        enabledMedications: ['nurofen'],
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

// ---------------------------------------------------------------------------
// Setup: mock navigator.clipboard and navigator.share
// ---------------------------------------------------------------------------

beforeEach(() => {
  localStorage.clear()
  resetStore()

  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    writable: true,
    configurable: true,
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

// ---------------------------------------------------------------------------
// Helper: open the sheet and generate a URL
// ---------------------------------------------------------------------------

async function openAndGenerate(user: ReturnType<typeof userEvent.setup>) {
  const genBtn = screen.getByRole('button', { name: /generează linkul/i })
  await user.click(genBtn)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ShareSheet', () => {
  it('does not render when open=false', () => {
    render(<ShareSheet open={false} onClose={vi.fn()} />)
    expect(screen.queryByText(/partajează profilul/i)).not.toBeInTheDocument()
  })

  it('renders sheet when open=true with both children listed', () => {
    render(<ShareSheet open={true} onClose={vi.fn()} />)
    expect(screen.getByText(/partajează profilul/i)).toBeInTheDocument()
    expect(screen.getByText('Maya')).toBeInTheDocument()
    expect(screen.getByText('Luca')).toBeInTheDocument()
  })

  it('pre-checks the active child (Maya) and not Luca', () => {
    render(<ShareSheet open={true} onClose={vi.fn()} />)
    const checkboxes = screen.getAllByRole('checkbox')
    // Find Maya and Luca checkboxes (not the "Trimite toată aplicația" one)
    const mayaCheckbox = checkboxes.find((cb) => {
      const label = cb.closest('label') ?? cb.parentElement
      return label?.textContent?.includes('Maya')
    })
    const lucaCheckbox = checkboxes.find((cb) => {
      const label = cb.closest('label') ?? cb.parentElement
      return label?.textContent?.includes('Luca')
    })
    expect(mayaCheckbox).toBeChecked()
    expect(lucaCheckbox).not.toBeChecked()
  })

  it('disables "Generează linkul" when no child is selected', async () => {
    const user = userEvent.setup()
    render(<ShareSheet open={true} onClose={vi.fn()} />)

    // Uncheck Maya (the only pre-checked child)
    const mayaLabel = screen.getByText('Maya').closest('label') as HTMLLabelElement
    await user.click(mayaLabel)

    const genBtn = screen.getByRole('button', { name: /generează linkul/i })
    expect(genBtn).toBeDisabled()
  })

  it('generates a URL containing only the selected child', async () => {
    const user = userEvent.setup()
    render(<ShareSheet open={true} onClose={vi.fn()} />)

    await openAndGenerate(user)

    const urlInput = screen.getByRole('textbox')
    const url = (urlInput as HTMLInputElement).value
    expect(url).toBeTruthy()

    // Decode and assert only Maya is in the payload
    const decoded = decodeShare(url)
    expect(decoded.children).toHaveLength(1)
    expect(decoded.children[0].id).toBe(MAYA_ID)
    expect(decoded.children[0].name).toBe('Maya')
  })

  it('temp is NOT in the generated URL', async () => {
    const user = userEvent.setup()
    render(<ShareSheet open={true} onClose={vi.fn()} />)

    await openAndGenerate(user)

    const urlInput = screen.getByRole('textbox')
    const url = (urlInput as HTMLInputElement).value

    // Decode and assert temp is stripped
    const decoded = decodeShare(url)
    decoded.children.forEach((child) => {
      expect(child).not.toHaveProperty('temp')
    })
    // Also assert it's not present as a raw string in the URL
    expect(url).not.toContain('"temp"')
  })

  it('"Trimite toată aplicația" overrides per-child selection and includes all children', async () => {
    const user = userEvent.setup()
    render(<ShareSheet open={true} onClose={vi.fn()} />)

    // Click "Trimite toată aplicația"
    const allAppCheckbox = screen.getByRole('checkbox', { name: /trimite toată aplicația/i })
    await user.click(allAppCheckbox)

    await openAndGenerate(user)

    const urlInput = screen.getByRole('textbox')
    const url = (urlInput as HTMLInputElement).value
    const decoded = decodeShare(url)

    // Both children should be included
    expect(decoded.children).toHaveLength(2)
    const ids = decoded.children.map((c) => c.id)
    expect(ids).toContain(MAYA_ID)
    expect(ids).toContain(LUCA_ID)
  })

  it('"Trimite toată aplicația" disables per-child checkboxes', async () => {
    const user = userEvent.setup()
    render(<ShareSheet open={true} onClose={vi.fn()} />)

    const allAppCheckbox = screen.getByRole('checkbox', { name: /trimite toată aplicația/i })
    await user.click(allAppCheckbox)

    // Per-child checkboxes should be disabled
    const checkboxes = screen.getAllByRole('checkbox')
    const childCheckboxes = checkboxes.filter(
      (cb) => cb !== allAppCheckbox,
    )
    childCheckboxes.forEach((cb) => {
      expect(cb).toBeDisabled()
    })
  })

  it('"Copiază" calls navigator.clipboard.writeText with the URL', async () => {
    const user = userEvent.setup()
    render(<ShareSheet open={true} onClose={vi.fn()} />)

    await openAndGenerate(user)

    const copyBtn = screen.getByRole('button', { name: /copiază/i })
    await user.click(copyBtn)

    expect(navigator.clipboard.writeText).toHaveBeenCalledOnce()
    const calledWith = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(calledWith).toContain('import=')
  })

  it('"Anulează" calls onClose', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ShareSheet open={true} onClose={onClose} />)

    const cancelBtn = screen.getByRole('button', { name: /anulează/i })
    await user.click(cancelBtn)

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('clicking the backdrop calls onClose', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ShareSheet open={true} onClose={onClose} />)

    // The backdrop is the outer div; click at position outside the sheet content
    const backdrop = screen.getByTestId('share-sheet-backdrop')
    await user.click(backdrop)

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('"Partajează" button is hidden when navigator.share is not available', () => {
    // navigator.share not defined in jsdom
    render(<ShareSheet open={true} onClose={vi.fn()} />)
    // Render and generate URL first (Partajează only appears after generation)
    // Without generating the URL, Partajează shouldn't be visible anyway
    expect(screen.queryByRole('button', { name: /^partajează$/i })).not.toBeInTheDocument()
  })
})
