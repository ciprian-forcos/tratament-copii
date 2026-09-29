import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { Medication, TimelineFact, TimelineMark } from '../types'
import { fmtHHMM } from '../components/design/dosePlan'
import { shortName } from '../components/design/timeline/shortName'
import { dayTickLabel, dayTicks } from '../components/design/variants/fane'
import { inferMedicationForm } from '../utils/medicationForm'
import { Glyph } from './Glyph'
import { HOUR_PX, acumSide, assignLanes, nightSpans, xOf } from './thread'

export type BeadSelection =
  | { kind: 'dose'; mark: TimelineMark }
  | { kind: 'fact'; fact: TimelineFact }

/** The line sits a little below the middle of the thread, so stacked beads have room above. */
const LINE = '58%'
const LANE_PX = 46
const BEAD_GAP = 40

/**
 * The thread: a native horizontal scroller (momentum, no custom pan).
 * Night bands, day lines, hour labels, the now needle and every event as a bead.
 */
export function Thread({
  now,
  from,
  to,
  width,
  doses,
  facts,
  medications,
  nextAt,
  onSelect,
}: {
  now: Date
  from: Date
  to: Date
  width: number
  doses: TimelineMark[]
  facts: TimelineFact[]
  medications: Medication[]
  nextAt: number | null
  onSelect: (bead: BeadSelection) => void
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const [side, setSide] = useState<'left' | 'right' | null>(null)
  const nowX = xOf(now, from)

  function update() {
    const el = scroller.current
    if (!el || !el.clientWidth) return setSide(null)
    setSide(acumSide(nowX, el.scrollLeft, el.clientWidth))
  }

  function goNow(smooth: boolean) {
    const el = scroller.current
    if (!el) return
    const left = Math.max(0, nowX - el.clientWidth * 0.25)
    if (smooth && el.scrollTo) el.scrollTo({ left, behavior: 'smooth' })
    else el.scrollLeft = left
  }

  // Land on now when the thread first appears.
  useLayoutEffect(() => {
    goNow(false)
  }, [])

  useEffect(update)

  const sortedDoses = useMemo(() => [...doses].sort((a, b) => a.at.getTime() - b.at.getTime()), [doses])
  const lanes = assignLanes(
    sortedDoses.map((m) => xOf(m.at, from)),
    BEAD_GAP,
  )
  const hours: Date[] = []
  for (let t = new Date(from); t < to; t = new Date(t.getTime() + 3 * 3600_000)) {
    if (t.getHours() !== 0) hours.push(t)
  }
  const temps = facts.filter((f) => f.payload.kind === 'temperature')
  const notes = facts.filter((f) => f.payload.kind === 'note')

  return (
    <div className="fir-thread-wrap">
      <div ref={scroller} className="fir-thread" onScroll={update} aria-label="firul zilelor">
        <div className="fir-track" style={{ width }}>
          {nightSpans(from, to).map((span) => (
            <div
              key={span.from.toISOString()}
              className="fir-night"
              style={{ left: xOf(span.from, from), width: xOf(span.to, from) - xOf(span.from, from) }}
            />
          ))}
          {dayTicks(from, to).map((d) => (
            <div key={d.toISOString()} className="fir-day" style={{ left: xOf(d, from) }}>
              <span>{dayTickLabel(d)}</span>
            </div>
          ))}
          {hours.map((h) => (
            <span key={h.toISOString()} className="fir-hour" style={{ left: xOf(h, from) }}>
              {String(h.getHours()).padStart(2, '0')}
            </span>
          ))}

          <div className="fir-line" style={{ top: LINE }} />
          <div className="fir-line fir-line--past" style={{ top: LINE, width: nowX }} />

          <div className="fir-needle" style={{ left: nowX }}>
            <span>acum</span>
          </div>

          {sortedDoses.map((m, i) => {
            const med = medications.find((x) => x.id === m.medicationId)
            const given = m.source === 'fact'
            const isNext = !given && m.at.getTime() === nextAt
            const lane = lanes[i]
            return (
              <button
                key={`${m.source}-${m.medicationId}-${m.at.toISOString()}`}
                type="button"
                data-bead={given ? 'dose-given' : 'dose-planned'}
                className={`fir-bead${given ? ' fir-bead--given' : ''}${isNext ? ' fir-bead--next' : ''}`}
                style={{
                  left: xOf(m.at, from),
                  top: `calc(${LINE} - ${lane * LANE_PX}px)`,
                  ['--med' as string]: med?.color ?? 'var(--accent)',
                }}
                aria-label={`${m.label} ${fmtHHMM(m.at)}${given ? ' dat' : ' planificat'}`}
                onClick={() => onSelect({ kind: 'dose', mark: m })}
              >
                <span className="fir-bead-dot">
                  <Glyph name={med ? inferMedicationForm(med) : 'sirop'} size={18} />
                </span>
                {lane === 0 && (
                  <span className="fir-bead-label">
                    <b>{fmtHHMM(m.at)}</b>
                    {med ? shortName(med.name) : m.label}
                  </span>
                )}
              </button>
            )
          })}

          {temps.map((f) => {
            const c = f.payload.kind === 'temperature' ? f.payload.celsius : 0
            return (
              <button
                key={f.id}
                type="button"
                className={`fir-pin${c >= 38 ? ' fir-pin--hot' : ''}`}
                style={{ left: xOf(new Date(f.at), from), top: `calc(${LINE} + 64px)` }}
                onClick={() => onSelect({ kind: 'fact', fact: f })}
              >
                {c.toFixed(1).replace('.', ',')}°
              </button>
            )
          })}
          {notes.map((f) => (
            <button
              key={f.id}
              type="button"
              className="fir-pin fir-pin--note"
              aria-label={`notă ${f.payload.kind === 'note' ? f.payload.text : ''}`}
              style={{ left: xOf(new Date(f.at), from), top: `calc(${LINE} + 100px)` }}
              onClick={() => onSelect({ kind: 'fact', fact: f })}
            >
              <Glyph name="nota" size={16} />
            </button>
          ))}
        </div>
      </div>
      {side && (
        <button type="button" className={`fir-acum fir-acum--${side} ui-btn`} onClick={() => goNow(true)}>
          {side === 'left' ? '« acum' : 'acum »'}
        </button>
      )}
    </div>
  )
}

export { HOUR_PX }
