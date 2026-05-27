import { render, screen } from '@testing-library/react'
import { doseStore, useDoses } from './doseStore'
import { vi } from 'vitest'

function DoseCounter() {
  const doses = useDoses()
  return <div data-testid="count">{doses.length}</div>
}

describe('useDoses', () => {
  beforeEach(() => {
    doseStore.clear()
    localStorage.clear()
  })

  it('re-renders when record() is called', async () => {
    render(<DoseCounter />)
    expect(screen.getByTestId('count').textContent).toBe('0')

    doseStore.record({
      childId: 'child-1',
      medicationId: 'nurofen',
      scheduledAt: '2026-05-27T10:00:00.000Z',
      administeredAt: '2026-05-27T10:05:00.000Z',
    })

    // The hook should have caused a re-render
    expect(screen.getByTestId('count').textContent).toBe('1')
  })
})