/**
 * Pure-function share encoder/decoder.
 *
 * Encoding strategy: JSON → URL-safe base64 (btoa + replace +→- /→_ strip =).
 * gzip via CompressionStream is deferred to keep the API synchronous — see
 * Deviations note in 05-01-SUMMARY: JSON+base64url is sufficient for V1 sizes.
 *
 * Wire format: `v=1&d=<base64url>`
 * Full share URL:  `<base>?import=<encoded>`
 */

import type { Child } from '../../../types'
import { ShareDecodeError } from './types'
export type { SharePayload } from './types'
export { ShareDecodeError } from './types'

import type { SharePayload } from './types'

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function toBase64Url(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function fromBase64Url(b64: string): string {
  // Restore standard base64 padding
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - (b64.length % 4)) % 4)
  return atob(padded)
}

/** Strip the transient `temp` field — it's privacy-bearing and must never be shared. */
function sanitizeChild(child: Child): Omit<Child, 'temp'> {
  // Explicit destructure ensures `temp` is never serialised even if the type evolves.
  const { temp: _temp, ...safe } = child
  return safe
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Encode a SharePayload into a querystring fragment value: `v=1&d=<b64url>`.
 * Children's transient `temp` field is stripped before encoding.
 */
export function encodeShare(payload: SharePayload): string {
  const sanitized: SharePayload = {
    ...payload,
    children: payload.children.map(sanitizeChild) as Child[],
  }
  const json = JSON.stringify(sanitized)
  const b64 = toBase64Url(unescape(encodeURIComponent(json)))
  return `v=1&d=${b64}`
}

/**
 * Build a full share URL.
 * base defaults to `window.location.origin + import.meta.env.BASE_URL` when
 * called in a browser context; callers can always supply it explicitly (tests do).
 */
export function buildShareUrl(payload: SharePayload, base?: string): string {
  const resolvedBase =
    base ??
    (typeof window !== 'undefined'
      ? window.location.origin + (import.meta.env.BASE_URL ?? '/')
      : 'http://localhost/')

  const encoded = encodeShare(payload)
  // Ensure base ends without trailing slash confusion
  const separator = resolvedBase.includes('?') ? '&' : '?'
  return `${resolvedBase.replace(/\/$/, '')}/${separator}import=${encodeURIComponent(encoded)}`
}

/**
 * Decode the querystring value (the result of encodeShare) OR a full URL
 * that contains `?import=...`.
 *
 * Throws ShareDecodeError on any failure:
 *   code 'format'  — missing v= or d= parameter
 *   code 'version' — v !== 1
 *   code 'corrupt' — base64/JSON parse failure
 */
export function decodeShare(value: string): SharePayload {
  // Accept full URL — extract the import= query parameter
  let fragment = value.trim()
  if (fragment.startsWith('http://') || fragment.startsWith('https://')) {
    try {
      const url = new URL(fragment)
      const importParam = url.searchParams.get('import')
      if (!importParam) {
        throw new ShareDecodeError('No import parameter in URL', 'format')
      }
      fragment = decodeURIComponent(importParam)
    } catch (e) {
      if (e instanceof ShareDecodeError) throw e
      throw new ShareDecodeError('Invalid URL', 'format')
    }
  }

  // Parse querystring fragment: v=1&d=<b64>
  let params: URLSearchParams
  try {
    params = new URLSearchParams(fragment)
  } catch {
    throw new ShareDecodeError('Cannot parse querystring', 'format')
  }

  const vParam = params.get('v')
  const dParam = params.get('d')

  if (!vParam || !dParam) {
    throw new ShareDecodeError('Missing v or d parameter', 'format')
  }

  // Decode base64url → JSON
  let json: string
  try {
    json = decodeURIComponent(escape(fromBase64Url(dParam)))
  } catch {
    throw new ShareDecodeError('Base64 decode failed', 'corrupt')
  }

  // Parse JSON
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new ShareDecodeError('JSON parse failed', 'corrupt')
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new ShareDecodeError('Payload is not an object', 'corrupt')
  }

  const obj = parsed as Record<string, unknown>

  // Version check
  if (obj.v !== 1) {
    throw new ShareDecodeError(`Unsupported version: ${String(obj.v)}`, 'version')
  }

  return obj as unknown as SharePayload
}
