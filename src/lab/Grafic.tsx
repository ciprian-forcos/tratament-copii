import { useCallback, useMemo, useState } from 'react'
import type { Child, Medication, TimelineFact } from '../types'
import { activeChild, childStore, useChildren } from '../components/design/childStore'
import { fmtHHMM } from '../components/design/dosePlan'
import { notifyMedicationsChanged, saveMedications } from '../components/design/medicineStorage'
import { Presence } from '../components/design/Presence'
import { materializeWindow, nextProjectedDose, projectRange } from '../components/design/timeline/project'
import { shortName } from '../components/design/timeline/shortName'
import { timelineStore, useTimelineFacts } from '../components/design/timeline/store'
import { AddSheet, type NewMedicine, type Tab } from './AddSheet'
import { Chart, type VolumeBar } from './Chart'
import { demoEpisode } from './demo'
import { FaceGlyph } from './Face'
import { RANGES, change, chartWindow, smoothPath, stats, tempSeries, valueAt, type RangeId } from './grafic'
import { useMedications, useNow } from './hooks'
import { moodFor } from './mood'
import { countdownWords } from './thread'
import { UndoToast } from './UndoToast'
import './fir.css'
import './grafic.css'

const fmt = (v: number) => v.toFixed(1).replace('.', ',')
const signed = (v: number) => `${v > 0 ? '+' : v < 0 ? '−' : '±'}${fmt(Math.abs(v))}°`
const H = 3600_000

function ago(now: number, t: number) {
  const mins = Math.round((now - t) / 60_000)
  if (mins < 60) return `acum ${Math.max(1, mins)} min`
  const h = Math.floor(mins / 60)
  return `acum ${h} h${mins % 60 ? ` ${mins % 60} min` : ''}`
}

/** Grafic: the fever read like a stock. Temperature is the price, doses are the volume. */
export function Grafic() {
  const state = useChildren()
  const child = activeChild(state)
  const facts = useTimelineFacts(child.id)
  const medications = useMedications()
  const now = useNow(30_000)
  const [range, setRange] = useState<RangeId>('12h')
  const [scrub, setScrub] = useState<number | null>(null)
  const [adding, setAdding] = useState<Tab | null>(null)
  const [toast, setToast] = useState<{ text: string; undo: () => void } | null>(null)

  const nowMs = now.getTime()
  const rangeMs = RANGES.find((r) => r.id === range)!.ms
  const win = chartWindow(nowMs, rangeMs)
  const points = useMemo(() => tempSeries(facts), [facts])
  const quote = change(points, nowMs, rangeMs)
  const s = stats(facts, nowMs)
  const lastPoint = [...points].reverse().find((p) => p.t <= nowMs)

  const span = materializeWindow(now)
  const marks = useMemo(
    () => projectRange({ child, facts, medications, now, from: span.from, to: span.to }),
    [child, facts, medications, now, span.from.getTime(), span.to.getTime()],
  )
  const next = nextProjectedDose(marks)
  const colorOf = (id: string) => medications.find((m) => m.id === id)?.color ?? 'var(--accent)'
  const bars: VolumeBar[] = marks
    .filter((m) => m.at.getTime() >= win.from && m.at.getTime() <= win.to)
    .map((m) => ({ t: m.at.getTime(), color: colorOf(m.medicationId), given: m.source === 'fact', label: m.label }))

  const shown = scrub != null ? valueAt(points, scrub) : lastPoint?.v ?? null
  const delta = scrub != null && quote && shown != null ? shown - quote.from : quote?.delta ?? null
  const rangeLabel = RANGES.find((r) => r.id === range)!.label

  const record = useCallback((fact: Omit<TimelineFact, 'id'>, text: string) => {
    const saved = timelineStore.append(fact)
    setToast({ text, undo: () => timelineStore.remove(saved.id) })
    navigator.vibrate?.(15)
  }, [])

  function createMedicine({ name, form }: NewMedicine, unit: string): Medication {
    const med: Medication = {
      id: 'alt-' + Date.now().toString(36),
      name,
      doseType: 'fixed',
      doseConfig: { type: 'fixed', amount: '1', unit },
      color: '#0e7490',
      notes: '',
      form,
      kind: 'support',
    }
    saveMedications([...medications, med])
    notifyMedicationsChanged()
    childStore.patchActive({ enabledMedications: [...child.enabledMedications, med.id] })
    return med
  }

  function loadDemo() {
    const added = demoEpisode(child.id, now).map((f) => timelineStore.append(f))
    setToast({ text: 'Exemplu încărcat', undo: () => added.forEach((f) => timelineStore.remove(f.id)) })
  }

  return (
    <div className="phone fir grafic">
      <div className="gr-scroll">
        <section className="gr-quote" role="region" aria-label="cotație">
          <div className="gr-ticker">
            <FaceGlyph child={child} mood={moodFor(facts, now)} size={28} />
            <span>{child.name.toUpperCase()} · TEMP °C</span>
          </div>
          <div className={`gr-price${shown != null && shown >= 38 ? ' is-hot' : ''}`}>{shown != null ? `${fmt(shown)}°` : '—'}</div>
          <div className="gr-quote-row">
            {delta != null ? (
              <span className={`gr-change ${delta > 0.05 ? 'is-up' : delta < -0.05 ? 'is-down' : 'is-flat'}`}>
                {delta > 0.05 ? '▲' : delta < -0.05 ? '▼' : '■'} {signed(delta)}
              </span>
            ) : null}
            <span className="gr-sub">
              {scrub != null
                ? fmtHHMM(new Date(scrub))
                : lastPoint
                  ? `${rangeLabel} · ultima ${ago(nowMs, lastPoint.t)}`
                  : 'nicio măsurătoare'}
            </span>
          </div>
        </section>

        {points.length > 0 ? (
          <div className="gr-chart-wrap">
            <Chart points={points} from={win.from} to={win.to} now={nowMs} bars={bars} scrub={scrub} onScrub={setScrub} />
          </div>
        ) : (
          <div className="gr-empty">
            <p>Încă nu e nicio temperatură pe grafic.</p>
            <button type="button" className="ui-btn gr-demo" onClick={loadDemo}>
              Încarcă un exemplu
            </button>
          </div>
        )}

        <div className="gr-ranges" role="tablist" aria-label="interval">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={r.id === range}
              className="gr-range"
              onClick={() => {
                setRange(r.id)
                setScrub(null)
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        <dl className="gr-stats">
          <div>
            <dt>Max 24h</dt>
            <dd className={s.max != null && s.max >= 38 ? 'is-hot' : undefined}>{s.max != null ? `${fmt(s.max)}°` : '—'}</dd>
          </div>
          <div>
            <dt>Min 24h</dt>
            <dd>{s.min != null ? `${fmt(s.min)}°` : '—'}</dd>
          </div>
          <div>
            <dt>Doze 24h</dt>
            <dd>{s.doses}</dd>
          </div>
          <div>
            <dt>Ultima doză</dt>
            <dd>{s.lastDoseAt != null ? fmtHHMM(new Date(s.lastDoseAt)) : '—'}</dd>
          </div>
        </dl>

        {next && (
          <div className="gr-next" style={{ ['--med' as string]: colorOf(next.medicationId) }}>
            <span className="gr-next-dot" />
            <span>
              Urmează <b>{shortName(medications.find((m) => m.id === next.medicationId)?.name ?? next.label)}</b>
              {next.amount ? ` ${next.amount}` : ''}
            </span>
            <span className="gr-next-when">
              {countdownWords(now, next.at)} · {fmtHHMM(next.at)}
            </span>
          </div>
        )}

        <section className="gr-watch">
          <div className="eyebrow">Copii</div>
          <ul role="list" aria-label="copii">
            {state.children.map((c) => (
              <WatchRow key={c.id} child={c} active={c.id === child.id} now={now} onPick={() => childStore.setActive(c.id)} />
            ))}
          </ul>
        </section>
      </div>

      <div className="gr-ticket">
        {toast && (
          <UndoToast
            text={toast.text}
            onUndo={() => {
              toast.undo()
              setToast(null)
            }}
            onDone={() => setToast(null)}
          />
        )}
        <button type="button" className="ui-btn gr-ticket-temp" onClick={() => setAdding('temp')}>
          Temperatură
        </button>
        <button type="button" className="btn-primary gr-ticket-dose" onClick={() => setAdding('doza')}>
          Am dat doza
        </button>
      </div>

      <Presence show={adding != null}>
        {adding && (
          <div className="fir-scrim" onClick={() => setAdding(null)}>
            <div onClick={(e) => e.stopPropagation()}>
              <AddSheet
                child={child}
                medications={medications}
                suggestedMedId={next?.medicationId}
                initialTab={adding}
                onClose={() => setAdding(null)}
                onDose={(m, a, at) => {
                  const med = 'id' in m ? m : createMedicine(m, a.unit)
                  setAdding(null)
                  record(
                    {
                      childId: child.id,
                      at: at.toISOString(),
                      payload: { kind: 'dose', medicationId: med.id, source: 'given', amount: a.n, unit: a.unit },
                    },
                    `${shortName(med.name)} ${fmt(a.n).replace(',0', '')} ${a.unit} · ${fmtHHMM(at)}`,
                  )
                }}
                onTemperature={(celsius, at) => {
                  setAdding(null)
                  record({ childId: child.id, at: at.toISOString(), payload: { kind: 'temperature', celsius } }, `${fmt(celsius)}° · ${fmtHHMM(at)}`)
                }}
                onNote={(text, at) => {
                  setAdding(null)
                  record({ childId: child.id, at: at.toISOString(), payload: { kind: 'note', text } }, `${text} · ${fmtHHMM(at)}`)
                }}
              />
            </div>
          </div>
        )}
      </Presence>
    </div>
  )
}

function WatchRow({ child, active, now, onPick }: { child: Child; active: boolean; now: Date; onPick: () => void }) {
  const facts = useTimelineFacts(child.id)
  const points = tempSeries(facts)
  const nowMs = now.getTime()
  const day = points.filter((p) => p.t >= nowMs - 24 * H && p.t <= nowMs)
  const last = day[day.length - 1]
  const c = change(points, nowMs, 24 * H)
  const lo = Math.min(36.5, ...day.map((p) => p.v))
  const hi = Math.max(38.5, ...day.map((p) => p.v))
  const spark = smoothPath(day.map((p) => [((p.t - (nowMs - 24 * H)) / (24 * H)) * 72, 24 - ((p.v - lo) / (hi - lo)) * 22]))
  const hot = last ? last.v >= 38 : false
  return (
    <li>
      <button type="button" className={`gr-row${active ? ' is-active' : ''}`} aria-pressed={active} onClick={onPick}>
        <FaceGlyph child={child} mood={moodFor(facts, now)} size={34} />
        <span className="gr-row-name">{child.name}</span>
        <svg className={`gr-spark${hot ? ' is-hot' : ''}`} viewBox="0 0 72 26" width={72} height={26} aria-hidden="true">
          {spark && <path d={spark} />}
        </svg>
        <span className="gr-row-quote">
          <b>{last ? `${fmt(last.v)}°` : '—'}</b>
          {c && (
            <span className={`gr-pill ${c.delta > 0.05 ? 'is-up' : c.delta < -0.05 ? 'is-down' : 'is-flat'}`}>{signed(c.delta)}</span>
          )}
        </span>
      </button>
    </li>
  )
}
