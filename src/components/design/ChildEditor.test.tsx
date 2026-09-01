import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { applyStep, Stepper } from './ChildEditor'

describe('applyStep', () => {
  it('adds a 0.5 kg step and clamps to the range', () => {
    expect(applyStep(13, 0.5, 2, 80)).toBe(13.5)
    expect(applyStep(79.8, 0.5, 2, 80)).toBe(80)
    expect(applyStep(2.2, -0.5, 2, 80)).toBe(2)
  })
})

describe('ChildEditor Stepper', () => {
  it('applies 10 rapid plus taps from 13.0 kg to 18.0 kg before parent re-renders', () => {
    const onChange = vi.fn()
    render(
      <Stepper
        label="kilograme"
        value={13}
        min={2}
        max={80}
        step={0.5}
        onChange={onChange}
        format={(v) => `${v.toFixed(1)} kg`}
      />,
    )

    const plus = screen.getByRole('button', { name: 'plus' })
    for (let i = 0; i < 10; i++) fireEvent.click(plus)

    expect(onChange.mock.calls.map((call) => call[0])).toEqual([
      13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18,
    ])
  })
})
