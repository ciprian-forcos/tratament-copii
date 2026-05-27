interface Props {
  size?: number
  hour: number
  minute: number
  nextHour?: number | null
  nextMinute?: number | null
  variant?: 'big' | 'mini'
  showNumbers?: boolean
  glow?: boolean
}

/** Sketchy hand-drawn analog clock. Direct port of clock.jsx from the design. */
export function AnalogClock({
  size = 240,
  hour,
  minute,
  nextHour = null,
  nextMinute = null,
  variant = 'big',
  showNumbers = true,
  glow = true,
}: Props) {
  const s = size
  const c = s / 2
  const r = s / 2 - 8

  const minAng = (minute / 60) * 360 - 90
  const hrAng = (((hour % 12) + minute / 60) / 12) * 360 - 90
  const handLenMin = r * 0.78
  const handLenHr = r * 0.52

  const pt = (ang: number, len: number): [number, number] => [
    c + Math.cos((ang * Math.PI) / 180) * len,
    c + Math.sin((ang * Math.PI) / 180) * len,
  ]
  const [mx, my] = pt(minAng, handLenMin)
  const [hx, hy] = pt(hrAng, handLenHr)

  const ticks: { x1: number; y1: number; x2: number; y2: number; big: boolean }[] = []
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * 360 - 90
    const [x1, y1] = pt(a, r - 4)
    const [x2, y2] = pt(a, r - (i % 3 === 0 ? 16 : 10))
    ticks.push({ x1, y1, x2, y2, big: i % 3 === 0 })
  }

  let nextMarker: { nx: number; ny: number; tx: number; ty: number } | null = null
  if (nextHour != null && nextMinute != null) {
    const a = (((nextHour % 12) + nextMinute / 60) / 12) * 360 - 90
    const [nx, ny] = pt(a, r - 2)
    const [tx, ty] = pt(a, r - 28)
    nextMarker = { nx, ny, tx, ty }
  }

  const stroke = '#e9ecef'
  const dim = '#5f6a76'
  const accent = '#f5b14a'

  return (
    <div
      style={{
        position: 'relative',
        width: s,
        height: s,
        filter: glow ? 'drop-shadow(0 0 24px rgba(245,177,74,0.07))' : 'none',
      }}
    >
      {/* Rough-noise filter used by the outer circle. Self-contained per clock. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="rough">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={3} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" />
          </filter>
        </defs>
      </svg>
      <svg viewBox={`0 0 ${s} ${s}`} width={s} height={s}>
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth={variant === 'big' ? 2 : 1.6}
          style={{ filter: 'url(#rough)' }}
        />
        <circle cx={c} cy={c} r={r - 6} fill="none" stroke={dim} strokeWidth={0.8} strokeDasharray="2 4" />

        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.big ? stroke : dim}
            strokeWidth={t.big ? 2 : 1}
            strokeLinecap="round"
          />
        ))}

        {showNumbers &&
          [12, 3, 6, 9].map((n) => {
            const idx = n === 12 ? 0 : n
            const a = (idx / 12) * 360 - 90
            const [tx, ty] = pt(a, r - 32)
            return (
              <text
                key={n}
                x={tx}
                y={ty + (variant === 'big' ? 7 : 5)}
                textAnchor="middle"
                fontFamily="Caveat, cursive"
                fontSize={variant === 'big' ? 24 : 16}
                fill={stroke}
              >
                {n}
              </text>
            )
          })}

        {nextMarker && (
          <>
            <line
              x1={nextMarker.tx}
              y1={nextMarker.ty}
              x2={nextMarker.nx}
              y2={nextMarker.ny}
              stroke={accent}
              strokeWidth={3}
              strokeLinecap="round"
            />
            <circle cx={nextMarker.nx} cy={nextMarker.ny} r={5} fill={accent} />
          </>
        )}

        {nextMarker &&
          nextHour != null &&
          nextMinute != null &&
          (() => {
            const nowAng = (((hour % 12) + minute / 60) / 12) * 360 - 90
            const nextAng = (((nextHour % 12) + nextMinute / 60) / 12) * 360 - 90
            const [x1, y1] = pt(nowAng, r - 20)
            const [x2, y2] = pt(nextAng, r - 20)
            let delta = nextAng - nowAng
            if (delta < 0) delta += 360
            const large = delta > 180 ? 1 : 0
            return (
              <path
                d={`M ${x1} ${y1} A ${r - 20} ${r - 20} 0 ${large} 1 ${x2} ${y2}`}
                fill="none"
                stroke={accent}
                strokeWidth={1.6}
                strokeDasharray="3 5"
                opacity={0.7}
              />
            )
          })()}

        <line x1={c} y1={c} x2={hx} y2={hy} stroke={stroke} strokeWidth={variant === 'big' ? 5 : 3.5} strokeLinecap="round" />
        <line x1={c} y1={c} x2={mx} y2={my} stroke={stroke} strokeWidth={variant === 'big' ? 3 : 2.2} strokeLinecap="round" />
        <circle cx={c} cy={c} r={variant === 'big' ? 5 : 3.5} fill={stroke} />
        <circle cx={c} cy={c} r={variant === 'big' ? 2 : 1.5} fill="#0d1115" />
      </svg>
    </div>
  )
}
