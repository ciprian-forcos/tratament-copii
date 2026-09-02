export type PanicPref = 'auto' | 'on' | 'off'

export const PANIC_PREF_KEY = 'tratament-copii-panic-pref'

export function loadPanicPref(): PanicPref {
  try {
    const raw = window.localStorage.getItem(PANIC_PREF_KEY)
    if (!raw) return 'auto'
    const parsed = JSON.parse(raw) as unknown
    if (parsed === 'auto' || parsed === 'on' || parsed === 'off') return parsed
    return 'auto'
  } catch {
    return 'auto'
  }
}

export function savePanicPref(pref: PanicPref) {
  try {
    window.localStorage.setItem(PANIC_PREF_KEY, JSON.stringify(pref))
  } catch {
    /* ignore */
  }
}

export function isPanicActive(pref: PanicPref, now: Date): boolean {
  if (pref === 'on') return true
  if (pref === 'off') return false
  return isNightWindow(now)
}

/**
 * Canonical night for landing and the Home "noaptea asta" eyebrow: 20:00–07:59.
 * The fever strip uses a different window: now ± 6h (`layoutMarks` /
 * `useNightTimeline`). That is a geometry choice, not a second definition of
 * night. `anchorStrip` (21:00–09:00) is the older night-strip window; keep it
 * for that geometry's history, not for landing.
 */
export function isNightWindow(now: Date): boolean {
  const hour = now.getHours()
  return hour >= 20 || hour < 8
}
