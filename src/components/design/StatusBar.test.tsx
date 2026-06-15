import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusBar } from './StatusBar'

describe('StatusBar', () => {
  it('keeps useful time text without fake phone status icons', () => {
    const { container } = render(<StatusBar timeLabel="23:00" />)

    expect(screen.getByText('23:00')).toBeInTheDocument()
    expect(container.querySelector('.battery')).not.toBeInTheDocument()
    expect(container.querySelector('.right')).not.toBeInTheDocument()
  })
})
