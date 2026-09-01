import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Step2, type Step2Value } from './Step2'

function Step2Harness({
  initialValue = { kind: 'first' },
  onNext = vi.fn(),
}: {
  initialValue?: Step2Value
  onNext?: () => void
}) {
  const [value, setValue] = useState<Step2Value>(initialValue)

  return (
    <Step2
      value={value}
      onChange={setValue}
      onBack={vi.fn()}
      onNext={onNext}
    />
  )
}

describe('Step2', () => {
  it('uses the required title copy', () => {
    render(<Step2Harness />)

    expect(
      screen.getByRole('heading', { name: 'Ai mai administrat altceva?' }),
    ).toBeInTheDocument()
  })

  it('uses a native datetime input for previous dose timing', async () => {
    const user = userEvent.setup()
    render(<Step2Harness />)

    await user.click(screen.getByRole('button', { name: /ultima/i }))

    const input = screen.getByLabelText(/data si ora/i)
    expect(input).toHaveAttribute('type', 'datetime-local')
  })

  it('lists caller-provided fever medicines instead of the hardcoded pair', () => {
    render(
      <Step2
        value={{ kind: 'last' }}
        onChange={vi.fn()}
        onBack={vi.fn()}
        onNext={vi.fn()}
        medications={[{ id: 'custom-fever', label: 'Algin', sub: 'sirop · cu seringa' }]}
      />,
    )

    expect(screen.getByRole('button', { name: /algin/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /nurofen/i })).not.toBeInTheDocument()
  })

  it('offers only the timed antipyretic choices and excludes Virodep', async () => {
    const user = userEvent.setup()
    render(<Step2Harness />)

    await user.click(screen.getByRole('button', { name: /ultima/i }))

    expect(screen.getByRole('button', { name: /nurofen/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /panadol/i })).toBeInTheDocument()
    expect(screen.queryByText(/virodep/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/novocalmin/i)).not.toBeInTheDocument()
  })

  it('continues from previous-dose mode only after a medicine is chosen', async () => {
    const user = userEvent.setup()
    const onNext = vi.fn()
    render(<Step2Harness onNext={onNext} />)

    await user.click(screen.getByRole('button', { name: /ultima/i }))
    const continueButton = screen.getByRole('button', { name: /genereaz/i })

    await user.click(continueButton)
    expect(onNext).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: /nurofen/i }))
    await user.click(continueButton)
    expect(onNext).toHaveBeenCalledOnce()
  })

  it('shows the selected datetime in RO format above the native input', () => {
    render(
      <Step2
        value={{ kind: 'last', med: 'nurofen', lastAt: '2026-06-14T23:30' }}
        onChange={vi.fn()}
        onBack={vi.fn()}
        onNext={vi.fn()}
      />,
    )

    expect(screen.getByText(/14\.06\.2026/)).toBeInTheDocument()
    expect(screen.getByText(/23:30/)).toBeInTheDocument()
    expect(screen.getByLabelText(/data si ora/i)).toHaveAttribute('type', 'datetime-local')
  })

  it('fills an RO datetime line when last-dose mode opens', async () => {
    const user = userEvent.setup()
    render(<Step2Harness />)

    await user.click(screen.getByRole('button', { name: /ultima/i }))

    expect(screen.queryByText('—')).not.toBeInTheDocument()
    expect(screen.getByText(/\d{2}\.\d{2}\.\d{4}/)).toBeInTheDocument()
  })

  it('stores the previous dose as one local datetime value', () => {
    const onChange = vi.fn()
    render(
      <Step2
        value={{ kind: 'last', med: 'nurofen' }}
        onChange={onChange}
        onBack={vi.fn()}
        onNext={vi.fn()}
      />,
    )

    fireEvent.change(screen.getByLabelText(/data si ora/i), {
      target: { value: '2026-06-14T23:30' },
    })

    expect(onChange).toHaveBeenLastCalledWith({
      kind: 'last',
      med: 'nurofen',
      lastAt: '2026-06-14T23:30',
    })
  })
})
