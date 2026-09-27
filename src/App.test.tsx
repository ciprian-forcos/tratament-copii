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

  it('opens the skin list from the top menu and closes it after a pick', () => {
    localStorage.removeItem('tratament-copii-skin')
    render(<App />)
    expect(screen.queryByRole('tablist', { name: 'teme' })).not.toBeInTheDocument()

    const toggle = screen.getByRole('button', { name: /temă/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('tab', { name: 'Grec' })).toHaveAttribute('aria-selected', 'true')

    fireEvent.click(screen.getByRole('tab', { name: 'Mario' }))
    expect(screen.queryByRole('tablist', { name: 'teme' })).not.toBeInTheDocument()
    expect(document.querySelector('.phone-inner')).toHaveAttribute('data-skin', 'mario')
    expect(localStorage.getItem('tratament-copii-skin')).toBe('mario')
  })
})
