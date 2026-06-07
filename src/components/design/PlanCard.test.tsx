import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PlanCard } from './PlanCard'
import { doseStore } from './doseStore'
import { vi } from 'vitest'

describe('PlanCard', () => {
  beforeEach(() => {
    doseStore.clear()
    localStorage.clear()
  })

  it('records a dose when "Am dat doza" is clicked', async () => {
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
    await userEvent.click(button)

    const doses = doseStore.list()
    expect(doses).toHaveLength(1)
    expect(doses[0].medicationId).toBe('nurofen') // default from buildPlan for first treatment
    expect(onDone).toHaveBeenCalled()
  })
})