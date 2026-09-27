import { describe, expect, it, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'
import { childStore } from './components/design/childStore'

describe('design variant switch', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
    childStore.setState({
      children: [
        { id: 'maya', name: 'Maya', weight: 13, years: 2, months: 4, initial: 'M', enabledMedications: [] },
      ],
      activeId: 'maya',
    })
  })

  it('changes the screen when a variant tab is clicked', () => {
    render(<App />)
    expect(screen.queryByRole('button', { name: /setări tratament/i })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('tab', { name: 'Fane' }))
    expect(screen.getByRole('button', { name: /setări tratament/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Fane' })).toHaveAttribute('aria-selected', 'true')

    fireEvent.click(screen.getByRole('tab', { name: 'Edi' }))
    expect(screen.getByRole('button', { name: /copil maya/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /setări tratament/i })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('tab', { name: 'Acum' }))
    expect(screen.getByRole('button', { name: /copii și medicamente/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Acum' })).toHaveAttribute('aria-selected', 'true')
  })
})
