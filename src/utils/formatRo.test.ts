import { describe, expect, it } from 'vitest'
import { formatRoDateTime, parseDatetimeLocal, toDatetimeLocalString } from './formatRo'

describe('formatRoDateTime', () => {
  it('formats in day.month.year 24h order', () => {
    const formatted = formatRoDateTime(new Date(2026, 8, 1, 16, 18, 0))
    expect(formatted).toMatch(/01\.09\.2026/)
    expect(formatted).toMatch(/16:18/)
    expect(formatted).not.toMatch(/PM/)
  })
})

describe('parseDatetimeLocal', () => {
  it('reads YYYY-MM-DDTHH:mm as local wall time', () => {
    const parsed = parseDatetimeLocal('2026-06-14T23:30')
    expect(parsed).not.toBeNull()
    expect(parsed?.getFullYear()).toBe(2026)
    expect(parsed?.getMonth()).toBe(5)
    expect(parsed?.getDate()).toBe(14)
    expect(parsed?.getHours()).toBe(23)
    expect(parsed?.getMinutes()).toBe(30)
  })

  it('returns null for empty or malformed values', () => {
    expect(parseDatetimeLocal('')).toBeNull()
    expect(parseDatetimeLocal('14.06.2026 23:30')).toBeNull()
  })
})

describe('toDatetimeLocalString', () => {
  it('emits a datetime-local value', () => {
    expect(toDatetimeLocalString(new Date(2026, 8, 1, 17, 14, 0))).toBe('2026-09-01T17:14')
  })
})
