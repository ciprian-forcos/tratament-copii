import { describe, expect, it } from 'vitest'
import { readLook } from './looks'

describe('readLook', () => {
  it('falls back to the Greek look', () => {
    expect(readLook(null)).toBe('grec')
    expect(readLook('nope')).toBe('grec')
  })

  it('accepts a known look', () => {
    expect(readLook('material')).toBe('material')
    expect(readLook('sticla')).toBe('sticla')
  })
})
