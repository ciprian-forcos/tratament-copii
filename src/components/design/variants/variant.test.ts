import { describe, expect, it } from 'vitest'
import { readVariant } from './variant'

describe('readVariant', () => {
  it('defaults to the current timeline', () => {
    expect(readVariant('')).toBe('acum')
    expect(readVariant('?x=1')).toBe('acum')
  })

  it('reads edi and fane', () => {
    expect(readVariant('?v=edi')).toBe('edi')
    expect(readVariant('?v=fane')).toBe('fane')
  })
})
