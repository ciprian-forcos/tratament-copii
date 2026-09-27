import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { AttachSheet } from './AttachSheet'

describe('AttachSheet confirm', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('ignores a second tap on Confirmă within a second', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-27T22:51:00'))
    const onConfirm = vi.fn()
    render(
      <AttachSheet
        value={{ kind: 'dose', at: new Date(), medicationId: 'nurofen' }}
        medications={[]}
        onChange={() => {}}
        onConfirm={onConfirm}
        onClose={() => {}}
      />,
    )
    const confirm = screen.getByRole('button', { name: 'Confirmă' })
    fireEvent.click(confirm)
    fireEvent.click(confirm)
    expect(onConfirm).toHaveBeenCalledTimes(1)

    vi.setSystemTime(new Date('2026-09-27T22:51:02'))
    fireEvent.click(confirm)
    expect(onConfirm).toHaveBeenCalledTimes(2)
  })

  it('marks the selected event kind as pressed', () => {
    render(
      <AttachSheet
        value={{ kind: 'dose', at: new Date(), medicationId: 'nurofen' }}
        medications={[]}
        onChange={() => {}}
        onConfirm={() => {}}
        onClose={() => {}}
      />,
    )
    expect(screen.getByRole('button', { name: 'Am dat doza' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Notă' })).toHaveAttribute('aria-pressed', 'false')
  })
})
