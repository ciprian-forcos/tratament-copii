import { useRef } from 'react'

/** NHS: people double-tap (slow phone, tremor, 3am). A dose must not be logged twice. */
export const TAP_GUARD_MS = 1000

export function useGuardedTap(action: () => void, ms = TAP_GUARD_MS) {
  const last = useRef(-Infinity)
  return () => {
    const now = Date.now()
    if (now - last.current < ms) return
    last.current = now
    action()
  }
}
