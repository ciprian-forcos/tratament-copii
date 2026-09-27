import { describe, expect, it } from 'vitest'
import { readSkin } from './skins'

describe('readSkin', () => {
  it('falls back to the marble skin', () => {
    expect(readSkin(null)).toBe('grec')
    expect(readSkin('nope')).toBe('grec')
  })

  it('accepts a known palette', () => {
    expect(readSkin('mario')).toBe('mario')
    expect(readSkin('bluey')).toBe('bluey')
  })
})
