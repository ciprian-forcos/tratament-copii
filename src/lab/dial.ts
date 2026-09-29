/** A 270° dial from 35.0 °C (−135°) to 41.0 °C (+135°), 0° at the top. */
export const DIAL_MIN = 35
export const DIAL_MAX = 41
const SWEEP = 270

export function tempAt(angle: number) {
  const a = Math.max(-SWEEP / 2, Math.min(SWEEP / 2, angle))
  const t = DIAL_MIN + ((a + SWEEP / 2) / SWEEP) * (DIAL_MAX - DIAL_MIN)
  return Math.round(t * 10) / 10
}

export function angleFor(temp: number) {
  const t = Math.max(DIAL_MIN, Math.min(DIAL_MAX, temp))
  return ((t - DIAL_MIN) / (DIAL_MAX - DIAL_MIN)) * SWEEP - SWEEP / 2
}

/** Angle of a pointer relative to the dial centre, 0° at the top, clockwise positive. */
export function pointerAngle(x: number, y: number, cx: number, cy: number) {
  return (Math.atan2(x - cx, cy - y) * 180) / Math.PI
}

export function heatFor(temp: number): 'normal' | 'warm' | 'fever' | 'high' {
  if (temp >= 39.5) return 'high'
  if (temp >= 38) return 'fever'
  if (temp >= 37.5) return 'warm'
  return 'normal'
}
