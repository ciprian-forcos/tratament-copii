import { render, screen, act } from '@testing-library/react'
import { doseStore, useDoses } from './doseStore'

function DoseCounter() {
  const doses = useDoses()
  return <div data-testid="count">{doses.length}</div>
}

describe('useDoses', () => {
  beforeEach(() => {
    doseStore.clear()
    localStorage.clear()
  })

  it('re-renders when record() is called', () => {
    render(<DoseCounter />)
    expect(screen.getByTestId('count').textContent).toBe('0')

    act(() => {
      doseStore.record({
        childId: 'child-1',
        medicationId: 'nurofen',
        scheduledAt: '2026-05-27T10:00:00.000Z',
        administeredAt: '2026-05-27T10:05:00.000Z',
      })
    })

    expect(screen.getByTestId('count').textContent).toBe('1')
  })
})