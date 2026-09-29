import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { EXIT_MS, Presence } from './Presence'

describe('Presence', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps a closed sheet on screen for its exit animation, then removes it', () => {
    vi.useFakeTimers()
    const { rerender } = render(
      <Presence show>
        <div className="ui-sheet">sheet</div>
      </Presence>,
    )
    rerender(<Presence show={false}>{null}</Presence>)

    const leaving = screen.getByText('sheet')
    expect(leaving.closest('.ui-exit')).not.toBeNull()

    act(() => {
      vi.advanceTimersByTime(EXIT_MS + 10)
    })
    expect(screen.queryByText('sheet')).not.toBeInTheDocument()
  })

  it('renders nothing when it was never shown', () => {
    render(<Presence show={false}>{null}</Presence>)
    expect(document.querySelector('.ui-exit')).toBeNull()
  })
})
