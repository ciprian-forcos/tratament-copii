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

  it('switches the look from the Temă menu, independent of the palette', () => {
    localStorage.removeItem('tratament-copii-look')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /temă/i }))
    expect(screen.getByRole('tab', { name: 'Grec' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('radio', { name: 'Material' }))
    const inner = document.querySelector('.phone-inner')
    expect(inner).toHaveAttribute('data-look', 'material')
    expect(localStorage.getItem('tratament-copii-look')).toBe('material')

    fireEvent.click(screen.getByRole('button', { name: /temă/i }))
    fireEvent.click(screen.getByRole('radio', { name: 'Grec' }))
    expect(inner).not.toHaveAttribute('data-look')
  })

  it('opens the Fir lab from the Lab tab', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('tab', { name: 'Lab' }))
    expect(screen.getByLabelText('firul zilelor')).toBeInTheDocument()
    expect(window.location.search).toContain('v=lab')
  })

  it('opens the trading-chart lab from the Grafic tab', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('tab', { name: 'Grafic' }))
    expect(screen.getByRole('region', { name: 'cotație' })).toBeInTheDocument()
  })
})
