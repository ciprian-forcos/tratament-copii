import { useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { DIAL_MAX, DIAL_MIN, angleFor, heatFor, pointerAngle, tempAt } from './dial'

const SIZE = 220
const C = SIZE / 2
const R = 78

function polar(angle: number, r = R) {
  const a = (angle * Math.PI) / 180
  return [C + r * Math.sin(a), C - r * Math.cos(a)]
}

function arc(from: number, to: number) {
  const [x1, y1] = polar(from)
  const [x2, y2] = polar(to)
  const large = to - from > 180 ? 1 : 0
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
}

const WORDS = { normal: 'normală', warm: 'subfebrilă', fever: 'febră', high: 'febră mare' }

/** Drag round the arc, or use the arrow keys, or the − / + buttons. */
export function TempDial({ value, onChange }: { value: number; onChange: (t: number) => void }) {
  const svg = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)
  const heat = heatFor(value)
  const angle = angleFor(value)
  const [kx, ky] = polar(angle)

  function fromPointer(e: PointerEvent<SVGSVGElement>) {
    const box = svg.current?.getBoundingClientRect()
    if (!box || !box.width) return
    const scale = SIZE / box.width
    onChange(tempAt(pointerAngle((e.clientX - box.left) * scale, (e.clientY - box.top) * scale, C, C)))
  }

  function onKey(e: KeyboardEvent<SVGSVGElement>) {
    const step = e.key === 'ArrowUp' || e.key === 'ArrowRight' ? 0.1 : e.key === 'ArrowDown' || e.key === 'ArrowLeft' ? -0.1 : 0
    if (!step) return
    e.preventDefault()
    onChange(Math.round(Math.min(DIAL_MAX, Math.max(DIAL_MIN, value + step)) * 10) / 10)
  }

  return (
    <div className={`fir-dial fir-dial--${heat}`}>
      <svg
        ref={svg}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="slider"
        tabIndex={0}
        aria-label="temperatură"
        aria-valuemin={DIAL_MIN}
        aria-valuemax={DIAL_MAX}
        aria-valuenow={value}
        aria-valuetext={`${value.toFixed(1)} grade, ${WORDS[heat]}`}
        onKeyDown={onKey}
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture?.(e.pointerId)
          fromPointer(e)
        }}
        onPointerMove={(e) => {
          if (dragging.current) fromPointer(e)
        }}
        onPointerUp={() => {
          dragging.current = false
        }}
      >
        <path className="fir-dial-track" d={arc(-135, 135)} />
        {angle > -134.9 && <path className="fir-dial-fill" d={arc(-135, angle)} />}
        {[36, 37, 38, 39, 40].map((t) => {
          const [x1, y1] = polar(angleFor(t), R - 12)
          const [x2, y2] = polar(angleFor(t), R - 19)
          const [tx, ty] = polar(angleFor(t), R + 20)
          return (
            <g key={t} className="fir-dial-tick">
              <line x1={x1} y1={y1} x2={x2} y2={y2} />
              <text x={tx} y={ty + 4}>
                {t}
              </text>
            </g>
          )
        })}
        <circle className="fir-dial-knob" cx={kx} cy={ky} r={13} />
      </svg>
      <div className="fir-dial-read" aria-hidden="true">
        <b>{value.toFixed(1).replace('.', ',')}°</b>
        <span>{WORDS[heat]}</span>
      </div>
    </div>
  )
}
