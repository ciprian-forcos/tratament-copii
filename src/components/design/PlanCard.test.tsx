import { fireEvent, render, screen } from '@testing-library/react'
import { PlanCard } from './PlanCard'
import { childStore } from './childStore'
import { doseStore } from './doseStore'
import { vi } from 'vitest'

describe('PlanCard', () => {
  beforeEach(() => {
    doseStore.clear()
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
          enabledMedications: ['nurofen', 'panadol'],
        },
      ],
      activeId: 'maya',
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('records a dose when "Am dat doza" is clicked', () => {
    const onDone = vi.fn()
    const onBack = vi.fn()

    render(
      <PlanCard
        step2={{ kind: 'first' }}
        onBack={onBack}
        onDone={onDone}
      />
    )

    const button = screen.getByRole('button', { name: /am dat doza/i })
    fireEvent.click(button)

    const doses = doseStore.list()
    expect(doses).toHaveLength(1)
    expect(doses[0].medicationId).toBe('nurofen') // default from buildPlan for first treatment
    expect(onDone).toHaveBeenCalled()
  })

  it('does not allow recording a deferred first dose before its scheduled time', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 0, 15, 3, 0, 0))

    const onDone = vi.fn()

    render(
      <PlanCard
        step2={{ kind: 'last', med: 'nurofen', lastAt: '2025-01-15T02:30' }}
        onBack={vi.fn()}
        onDone={onDone}
      />,
    )

    expect(screen.getByRole('heading', { name: /la 06:30/i })).toBeInTheDocument()

    const button = screen.getByRole('button', { name: /am dat doza/i })
    expect(button).toBeDisabled()

    fireEvent.click(button)

    expect(doseStore.list()).toHaveLength(0)
    expect(onDone).not.toHaveBeenCalled()
  })
})
