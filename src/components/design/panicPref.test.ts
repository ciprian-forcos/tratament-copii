import { describe, it, expect, beforeEach } from 'vitest'
import { isPanicActive, loadPanicPref, PANIC_PREF_KEY, savePanicPref } from './panicPref'

describe('isPanicActive', () => {
  it('is always on when forced on', () => {
    expect(isPanicActive('on', new Date(2026, 7, 25, 10, 0, 0))).toBe(true)
  })

  it('is always off when forced off', () => {
    expect(isPanicActive('off', new Date(2026, 7, 25, 22, 0, 0))).toBe(false)
  })

  it('auto-enables for the night window 20:00–07:59', () => {
    expect(isPanicActive('auto', new Date(2026, 7, 25, 19, 59, 0))).toBe(false)
    expect(isPanicActive('auto', new Date(2026, 7, 25, 20, 0, 0))).toBe(true)
    expect(isPanicActive('auto', new Date(2026, 7, 25, 3, 12, 0))).toBe(true)
    expect(isPanicActive('auto', new Date(2026, 7, 25, 7, 59, 0))).toBe(true)
    expect(isPanicActive('auto', new Date(2026, 7, 25, 8, 0, 0))).toBe(false)
    expect(isPanicActive('auto', new Date(2026, 7, 25, 9, 5, 0))).toBe(false)
  })
})

describe('panic pref persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to auto', () => {
    expect(loadPanicPref()).toBe('auto')
  })

  it('round-trips on/off', () => {
    savePanicPref('off')
    expect(localStorage.getItem(PANIC_PREF_KEY)).toBe('"off"')
    expect(loadPanicPref()).toBe('off')
  })
})
