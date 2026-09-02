import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { InstallPrompt } from './InstallPrompt'

function setStandalone(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === '(display-mode: standalone)' ? matches : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
    configurable: true,
  })
}

describe('InstallPrompt', () => {
  it('prompts install when beforeinstallprompt is available', () => {
    setStandalone(false)
    const prompt = vi.fn().mockResolvedValue(undefined)
    render(<InstallPrompt />)

    const event = new Event('beforeinstallprompt') as Event & { prompt: () => Promise<void> }
    Object.assign(event, { prompt })
    const preventDefault = vi.spyOn(event, 'preventDefault')
    window.dispatchEvent(event)

    expect(preventDefault).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByRole('button', { name: /instaleaz/i }))
    expect(prompt).toHaveBeenCalledOnce()
  })

  it('shows manual install guidance when install prompt is unsupported', () => {
    setStandalone(false)
    render(<InstallPrompt />)

    fireEvent.click(screen.getByRole('button', { name: /instaleaz/i }))

    expect(screen.getByText(/adaug/i)).toBeInTheDocument()
    expect(screen.getByText(/ecran/i)).toBeInTheDocument()
  })

  it('hides install affordance when already running standalone', () => {
    setStandalone(true)
    render(<InstallPrompt />)
    expect(screen.queryByRole('button', { name: /instaleaz/i })).not.toBeInTheDocument()
  })
})
