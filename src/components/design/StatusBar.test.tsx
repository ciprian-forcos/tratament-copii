import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { StatusBar } from './StatusBar'

describe('StatusBar', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps useful time text without fake phone status icons', () => {
    const { container } = render(<StatusBar timeLabel="23:00" />)

    expect(screen.getByText('23:00')).toBeInTheDocument()
    expect(container.querySelector('.battery')).not.toBeInTheDocument()
    expect(container.querySelector('.right')).not.toBeInTheDocument()
  })

  it('pads the live clock like fmtHHMM', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 8, 3, 12, 0))
    render(<StatusBar />)
    expect(screen.getByText('03:12')).toBeInTheDocument()
  })

  it('advances the live clock on the 30s tick', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 8, 3, 12, 0))
    render(<StatusBar />)
    expect(screen.getByText('03:12')).toBeInTheDocument()
    act(() => {
      vi.setSystemTime(new Date(2026, 5, 8, 3, 13, 0))
      vi.advanceTimersByTime(30_000)
    })
    expect(screen.getByText('03:13')).toBeInTheDocument()
  })
})
