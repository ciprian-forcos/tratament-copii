import { useId, useRef, type PointerEvent } from 'react'
import { fmtHHMM } from '../components/design/dosePlan'
import { FEVER, extent, smoothPath, ticks, valueAt, type Pt } from './grafic'

export type VolumeBar = { t: number; color: string; given: boolean; label: string }

const W = 360
const RIGHT = 46 // price axis
const TOP = 14
const PRICE_H = 196
const VOL_H = 46
const AXIS_H = 20
const H = PRICE_H + VOL_H + AXIS_H
const PLOT_W = W - RIGHT

const fmt = (v: number) => v.toFixed(1).replace('.', ',')
const DAYS = ['Du', 'Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ']

/**
 * Temperature as a price chart: area line, fever line, price tag on the right
 * axis, a forecast zone after now, and doses as volume bars underneath.
 * Drag across it to scrub.
 */
export function Chart({
  points,
  from,
  to,
  now,
  bars,
  scrub,
  onScrub,
}: {
  points: Pt[]
  from: number
  to: number
  now: number
  bars: VolumeBar[]
  scrub: number | null
  onScrub: (t: number | null) => void
}) {
  const id = useId().replace(/:/g, '')
  const svg = useRef<SVGSVGElement>(null)
  const { lo, hi } = extent(points.filter((p) => p.t >= from - (to - from) && p.t <= to))
  const x = (t: number) => ((t - from) / (to - from)) * PLOT_W
  const y = (v: number) => TOP + ((hi - v) / (hi - lo)) * (PRICE_H - TOP - 8)

  // One reading either side of the window keeps the line running off the edges.
  const firstIn = points.findIndex((p) => p.t >= from)
  const start = firstIn === -1 ? points.length : Math.max(0, firstIn - 1)
  const visible = points.slice(start).filter((p, i, arr) => p.t <= to || (i > 0 && arr[i - 1].t <= to))
  const past = visible.filter((p) => p.t <= now)
  const xy = past.map((p) => [x(p.t), y(p.v)] as [number, number])
  const line = smoothPath(xy)
  const area = xy.length > 1 ? `${line} L ${xy[xy.length - 1][0]} ${PRICE_H} L ${xy[0][0]} ${PRICE_H} Z` : ''
  const last = past[past.length - 1]
  const hot = last ? last.v >= FEVER : false

  const span = to - from
  const step = span <= 7 * 3600_000 ? 2 * 3600_000 : span <= 16 * 3600_000 ? 4 * 3600_000 : span <= 30 * 3600_000 ? 6 * 3600_000 : span <= 4 * 86400_000 ? 24 * 3600_000 : 2 * 86400_000
  const labels: number[] = []
  // First label on a whole step (04:00, 08:00… or midnight), then every step.
  const first = new Date(from)
  first.setMinutes(0, 0, 0)
  if (step >= 86400_000) {
    first.setHours(0)
    first.setDate(first.getDate() + 1)
  } else {
    const stepH = step / 3600_000
    first.setHours(Math.ceil(first.getHours() / stepH) * stepH)
  }
  for (let t = first.getTime(); t <= to; t += step) labels.push(t)

  function onPointer(e: PointerEvent<SVGSVGElement>) {
    const box = svg.current?.getBoundingClientRect()
    if (!box || !box.width) return
    const fx = ((e.clientX - box.left) / box.width) * W
    const t = from + (Math.min(PLOT_W, Math.max(0, fx)) / PLOT_W) * (to - from)
    onScrub(Math.min(now, t))
  }

  const scrubV = scrub != null ? valueAt(points, scrub) : null

  return (
    <svg
      ref={svg}
      className={`gr-chart${hot ? ' is-hot' : ''}`}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="grafic temperatură"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture?.(e.pointerId)
        onPointer(e)
      }}
      onPointerMove={(e) => {
        if (e.buttons || e.pointerType === 'mouse') onPointer(e)
      }}
      onPointerUp={(e) => {
        if (e.pointerType !== 'mouse') onScrub(null)
      }}
      onPointerLeave={() => onScrub(null)}
    >
      <defs>
        <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.32" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`plot-${id}`}>
          <rect x="0" y="0" width={PLOT_W} height={H} />
        </clipPath>
      </defs>

      {/* Forecast zone */}
      <rect className="gr-forecast" x={x(now)} y={0} width={Math.max(0, PLOT_W - x(now))} height={PRICE_H + VOL_H} />
      <text className="gr-forecast-label" x={x(now) + 6} y={11}>
        PROGNOZĂ
      </text>

      {/* Grid and price axis */}
      {ticks(lo, hi).map((v) => (
        <g key={v}>
          <line className="gr-grid" x1={0} x2={PLOT_W} y1={y(v)} y2={y(v)} />
          <text className="gr-axis" x={W - 4} y={y(v) + 4} textAnchor="end">
            {fmt(v)}
          </text>
        </g>
      ))}
      <line className="gr-fever" x1={0} x2={PLOT_W} y1={y(FEVER)} y2={y(FEVER)} />
      <text className="gr-fever-label" x={4} y={y(FEVER) - 4}>
        FEBRĂ 38°
      </text>

      <g clipPath={`url(#plot-${id})`}>
        {area && <path className="gr-area" d={area} fill={`url(#fill-${id})`} />}
        {line && <path className="gr-line" d={line} />}
        {past.map((p) => (
          <circle key={p.t} className="gr-reading" cx={x(p.t)} cy={y(p.v)} r={2.2} />
        ))}
      </g>

      {/* Now */}
      <line className="gr-now" x1={x(now)} x2={x(now)} y1={0} y2={PRICE_H + VOL_H} />

      {/* Latest reading: pulse, level line and price tag */}
      {last && (
        <g>
          <line className="gr-level" x1={x(last.t)} x2={PLOT_W} y1={y(last.v)} y2={y(last.v)} />
          <circle className="gr-pulse" cx={x(last.t)} cy={y(last.v)} r={5} />
          <circle className="gr-dot" cx={x(last.t)} cy={y(last.v)} r={4} />
          <rect className="gr-tag" x={PLOT_W + 2} y={y(last.v) - 10} width={RIGHT - 3} height={20} rx={3} />
          <text className="gr-tag-text" x={PLOT_W + 2 + (RIGHT - 3) / 2} y={y(last.v) + 4} textAnchor="middle">
            {fmt(last.v)}
          </text>
        </g>
      )}

      {/* Volume pane: doses */}
      <line className="gr-grid" x1={0} x2={PLOT_W} y1={PRICE_H} y2={PRICE_H} />
      <text className="gr-axis" x={W - 4} y={PRICE_H + 14} textAnchor="end">
        DOZE
      </text>
      {bars
        .filter((b) => b.t >= from && b.t <= to)
        .map((b) => (
          <rect
            key={`${b.t}-${b.label}`}
            data-vol={b.given ? 'given' : 'planned'}
            className={`gr-bar${b.given ? '' : ' is-planned'}`}
            x={x(b.t) - 4}
            y={PRICE_H + 8}
            width={8}
            height={VOL_H - 12}
            rx={2}
            style={{ ['--med' as string]: b.color }}
          >
            <title>{`${b.label} ${fmtHHMM(new Date(b.t))}`}</title>
          </rect>
        ))}

      {/* Time axis */}
      {labels.map((t) => {
        const d = new Date(t)
        const text = step >= 86400_000 ? `${DAYS[d.getDay()]} ${d.getDate()}` : fmtHHMM(d)
        return (
          <text key={t} className="gr-axis" x={x(t)} y={H - 5} textAnchor="middle">
            {text}
          </text>
        )
      })}

      {/* Crosshair */}
      {scrub != null && (
        <g className="gr-cross">
          <line x1={x(scrub)} x2={x(scrub)} y1={0} y2={PRICE_H + VOL_H} />
          {scrubV != null && (
            <>
              <line x1={0} x2={PLOT_W} y1={y(scrubV)} y2={y(scrubV)} />
              <circle cx={x(scrub)} cy={y(scrubV)} r={5} />
            </>
          )}
          <rect x={Math.min(PLOT_W - 44, Math.max(0, x(scrub) - 22))} y={H - 19} width={44} height={17} rx={3} />
          <text x={Math.min(PLOT_W - 22, Math.max(22, x(scrub)))} y={H - 6} textAnchor="middle">
            {fmtHHMM(new Date(scrub))}
          </text>
        </g>
      )}
    </svg>
  )
}
