import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { TabBar } from './TabBar'

describe('TabBar', () => {
  it('marks the current tab and reports a different tab', () => {
    const onSelect = vi.fn()
    render(<TabBar current="program" onSelect={onSelect} />)

    expect(screen.getByRole('button', { name: 'Program' })).toHaveAttribute('aria-current', 'page')
    fireEvent.click(screen.getByRole('button', { name: 'Febră' }))
    expect(onSelect).toHaveBeenCalledWith('fever')
  })
})
