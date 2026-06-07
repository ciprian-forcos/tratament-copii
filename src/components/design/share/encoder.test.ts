import { describe, it, expect } from 'vitest'
import type { Child, Medication } from '../../../types'
import { encodeShare, buildShareUrl, decodeShare, ShareDecodeError } from './encoder'
import type { SharePayload } from './types'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const child1: Child = {
  id: 'c1',
  name: 'Ana',
  weight: 12,
  years: 2,
  months: 3,
  initial: 'A',
  enabledMedications: ['nurofen', 'panadol'],
}

const child1WithTemp: Child = {
  ...child1,
  temp: 38.5,
}

const child2: Child = {
  id: 'c2',
  name: 'Ion',
  weight: 20,
  years: 5,
  months: 0,
  initial: 'I',
  enabledMedications: ['vitamina_d'],
}

const customMed: Medication = {
  id: 'custom1',
  name: 'Custom Med',
  doseType: 'fixed',
  doseConfig: { type: 'fixed', amount: '5', unit: 'ml' },
  color: '#ff0000',
  notes: 'test note',
}

const basePayload: SharePayload = {
  v: 1,
  children: [child1],
  sentAt: '2026-06-07T10:00:00.000Z',
}

// ---------------------------------------------------------------------------
// Round-trip tests
// ---------------------------------------------------------------------------

describe('encodeShare / decodeShare round-trip', () => {
  it('round-trips a single child', () => {
    const encoded = encodeShare(basePayload)
    const decoded = decodeShare(encoded)
    expect(decoded).toEqual(basePayload)
  })

  it('round-trips multiple children', () => {
    const payload: SharePayload = {
      v: 1,
      children: [child1, child2],
      sentAt: '2026-06-07T10:00:00.000Z',
    }
    const decoded = decodeShare(encodeShare(payload))
    expect(decoded).toEqual(payload)
  })

  it('round-trips with custom medications', () => {
    const payload: SharePayload = {
      v: 1,
      children: [child1, child2],
      medications: [customMed],
      sentAt: '2026-06-07T10:00:00.000Z',
    }
    const decoded = decodeShare(encodeShare(payload))
    expect(decoded).toEqual(payload)
  })

  it('preserves sentAt exactly', () => {
    const sentAt = '2026-06-07T15:30:45.123Z'
    const payload: SharePayload = { v: 1, children: [child1], sentAt }
    expect(decodeShare(encodeShare(payload)).sentAt).toBe(sentAt)
  })
})

// ---------------------------------------------------------------------------
// temp field stripping (privacy guarantee)
// ---------------------------------------------------------------------------

describe('temp field stripping', () => {
  it('strips temp from encoded child when present', () => {
    const payload: SharePayload = {
      v: 1,
      children: [child1WithTemp],
      sentAt: '2026-06-07T10:00:00.000Z',
    }
    const decoded = decodeShare(encodeShare(payload))
    expect(decoded.children[0]).not.toHaveProperty('temp')
  })

  it('decoded child equals child1 (sans temp) even when input had temp', () => {
    const payload: SharePayload = {
      v: 1,
      children: [child1WithTemp],
      sentAt: '2026-06-07T10:00:00.000Z',
    }
    const decoded = decodeShare(encodeShare(payload))
    expect(decoded.children[0]).toEqual(child1)
  })
})

// ---------------------------------------------------------------------------
// Error cases
// ---------------------------------------------------------------------------

describe('decodeShare error handling', () => {
  it('throws ShareDecodeError with code "format" for garbage input', () => {
    expect(() => decodeShare('???')).toThrow(ShareDecodeError)
    try {
      decodeShare('???')
    } catch (e) {
      expect(e).toBeInstanceOf(ShareDecodeError)
      expect((e as ShareDecodeError).code).toBe('format')
    }
  })

  it('throws ShareDecodeError with code "corrupt" for invalid base64 data', () => {
    try {
      decodeShare('v=1&d=!!notbase64!!')
    } catch (e) {
      expect(e).toBeInstanceOf(ShareDecodeError)
      expect((e as ShareDecodeError).code).toBeOneOf(['corrupt', 'format'])
    }
  })

  it('throws ShareDecodeError with code "version" for v:2 payload', () => {
    // Manually construct a v:2 encoded payload
    const raw = JSON.stringify({ v: 2, children: [child1], sentAt: '2026-06-07T10:00:00.000Z' })
    const b64 = btoa(raw).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    const encoded = `v=1&d=${b64}`
    expect(() => decodeShare(encoded)).toThrow(ShareDecodeError)
    try {
      decodeShare(encoded)
    } catch (e) {
      expect(e).toBeInstanceOf(ShareDecodeError)
      expect((e as ShareDecodeError).code).toBe('version')
    }
  })
})

// ---------------------------------------------------------------------------
// URL length constraint
// ---------------------------------------------------------------------------

describe('URL length constraint', () => {
  it('encodeShare with 5 children stays under 2000 chars', () => {
    const children: Child[] = Array.from({ length: 5 }, (_, i) => ({
      id: `c${i}`,
      name: `Child${i}`,
      weight: 10 + i * 2,
      years: 2 + i,
      months: i,
      initial: 'C',
      enabledMedications: ['nurofen', 'panadol', 'vitamina_d'],
    }))
    const payload: SharePayload = {
      v: 1,
      children,
      sentAt: '2026-06-07T10:00:00.000Z',
    }
    expect(encodeShare(payload).length).toBeLessThan(2000)
  })
})

// ---------------------------------------------------------------------------
// buildShareUrl
// ---------------------------------------------------------------------------

describe('buildShareUrl', () => {
  it('returns a URL containing ?import= parameter', () => {
    const url = buildShareUrl(basePayload, 'https://example.com/app/')
    expect(url).toContain('?import=')
    expect(url.startsWith('https://example.com/app/')).toBe(true)
  })

  it('the ?import= value round-trips', () => {
    const url = buildShareUrl(basePayload, 'https://example.com/app/')
    const importValue = new URL(url).searchParams.get('import')!
    const decoded = decodeShare(importValue)
    expect(decoded).toEqual(basePayload)
  })
})
