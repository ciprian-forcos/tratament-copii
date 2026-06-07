import type { Child, Medication } from '../../../types'

/**
 * Versioned share payload — the canonical shape serialized into the URL.
 * v: 1 is the only supported version in V1.
 */
export interface SharePayload {
  v: 1
  children: Child[]
  medications?: Medication[]
  sentAt: string // ISO datetime
}

/**
 * Typed error thrown by decodeShare on any failure.
 * code:
 *   'format'  — missing or malformed querystring structure
 *   'version' — payload carries an unsupported version number
 *   'corrupt' — base64 or JSON parse failed
 */
export class ShareDecodeError extends Error {
  readonly code: 'format' | 'version' | 'corrupt'

  constructor(message: string, code: 'format' | 'version' | 'corrupt') {
    super(message)
    this.name = 'ShareDecodeError'
    this.code = code
    // Restore prototype chain for instanceof checks in transpiled envs.
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
