/**
 * The tape is 'M 6 38 Q 80 32 160 40 T 314 36' in a 320×70 box.
 * Material draws the elapsed part as an M3 wavy progress line along it.
 */
export const TAPE_PATH = 'M 6 38 Q 80 32 160 40 T 314 36'

type Pt = [number, number]
// The two quadratic segments; the second control point is the reflection that T implies.
const SEGMENTS: [Pt, Pt, Pt][] = [
  [[6, 38], [80, 32], [160, 40]],
  [[160, 40], [240, 48], [314, 36]],
]
const START = 6
const END = 314

function at([p0, c, p1]: [Pt, Pt, Pt], t: number): Pt {
  const u = 1 - t
  return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]]
}

function tangent([p0, c, p1]: [Pt, Pt, Pt], t: number): Pt {
  return [2 * (1 - t) * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0]), 2 * (1 - t) * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1])]
}

/** Parameter on the segment whose x equals `x` (x rises monotonically along the tape). */
function locate(x: number): [[Pt, Pt, Pt], number] {
  const seg = x <= SEGMENTS[0][2][0] ? SEGMENTS[0] : SEGMENTS[1]
  let lo = 0
  let hi = 1
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2
    if (at(seg, mid)[0] < x) lo = mid
    else hi = mid
  }
  return [seg, (lo + hi) / 2]
}

export function tapeY(x: number) {
  const [seg, t] = locate(Math.max(START, Math.min(END, x)))
  return at(seg, t)[1]
}

/** A sine riding the tape from `fromX` to `toX`, offset along the tape's normal. */
export function wavyPath(fromX: number, toX: number, amplitude = 2.2, wavelength = 12) {
  const a = Math.max(START, fromX)
  const b = Math.min(END, toX)
  if (b <= a) return ''
  const out: string[] = []
  for (let x = a; x <= b + 0.001; x += 1) {
    const [seg, t] = locate(Math.min(x, b))
    const [px, py] = at(seg, t)
    const [tx, ty] = tangent(seg, t)
    const len = Math.hypot(tx, ty) || 1
    const off = amplitude * Math.sin(((x - a) / wavelength) * 2 * Math.PI)
    out.push(`${(px - (ty / len) * off).toFixed(2)} ${(py + (tx / len) * off).toFixed(2)}`)
  }
  return 'M ' + out.join(' L ')
}
