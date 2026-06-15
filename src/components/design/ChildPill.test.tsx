import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { childStore } from './childStore'
import { ChildPill } from './ChildPill'

describe('ChildPill', () => {
  beforeEach(() => {
    localStorage.clear()
    childStore.setState({
      children: [
        {
          id: 'maya',
          name: 'Maya',
          weight: 13,
          years: 2,
          months: 4,
          initial: 'M',
          temp: 38.5,
          enabledMedications: [],
        },
      ],
      activeId: 'maya',
    })
  })

  it('exposes child identity, profile, and temperature as separate controls', () => {
    const onChildClick = vi.fn()
    const onProfileClick = vi.fn()
    const onTemperatureClick = vi.fn()

    render(
      <ChildPill
        onChildClick={onChildClick}
        onProfileClick={onProfileClick}
        onTemperatureClick={onTemperatureClick}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /copil maya/i }))
    fireEvent.click(screen.getByRole('button', { name: /profil/i }))
    fireEvent.click(screen.getByRole('button', { name: /temperatura/i }))

    expect(onChildClick).toHaveBeenCalledOnce()
    expect(onProfileClick).toHaveBeenCalledOnce()
    expect(onTemperatureClick).toHaveBeenCalledOnce()
  })
})
