import { render } from '@testing-library/react'
import { AnalogClock } from './AnalogClock'

describe('AnalogClock', () => {
  it('renders 12 tick lines + 2 hand lines + 1 next-dose marker (15 total lines) and the 12/3/6/9 numerals', () => {
    const { container } = render(
      <AnalogClock hour={3} minute={33} nextHour={5} nextMinute={30} />
    )

    const lines = container.querySelectorAll('svg line')
    expect(lines.length).toBe(15)

    const text = container.textContent || ''
    expect(text).toContain('12')
    expect(text).toContain('3')
    expect(text).toContain('6')
    expect(text).toContain('9')
  })
})