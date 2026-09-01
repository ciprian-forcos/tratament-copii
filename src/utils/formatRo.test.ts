import { describe, expect, it } from 'vitest'
import { formatRoDateTime } from './formatRo'

describe('formatRoDateTime', () => {
  it('formats in day.month.year 24h order', () => {
    const formatted = formatRoDateTime(new Date(2026, 8, 1, 16, 18, 0))
    expect(formatted).toMatch(/01\.09\.2026/)
    expect(formatted).toMatch(/16:18/)
    expect(formatted).not.toMatch(/PM/)
  })
})
