import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Medication, TimelineMark } from '../types'
import { activeChild, useChildren } from '../components/design/childStore'
import { fmtHHMM } from '../components/design/dosePlan'
import { loadMedications, MEDICATIONS_CHANGED_EVENT } from '../components/design/medicineStorage'
import { doseAmount, materializeWindow, nextProjectedDose, projectRange } from '../components/design/timeline/project'
import { shortName } from '../components/design/timeline/shortName'
import { timelineStore, useTimelineFacts } from '../components/design/timeline/store'
import { splitAmount } from '../components/design/variants/fane'
import { NextCard, StartCard } from './NextCard'
import { Thread, type BeadSelection } from './Thread'
import { UndoToast } from './UndoToast'
import { threadWindow } from './thread'
import './fir.css'

function useNow(everyMs: number) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), everyMs)
    return () => window.clearInterval(id)
  }, [everyMs])
  return now
}

function useMedications() {
  const [meds, setMeds] = useState<Medication[]>(loadMedications)
  useEffect(() => {
    const reload = () => setMeds(loadMedications())
    window.addEventListener(MEDICATIONS_CHANGED_EVENT, reload)
    return () => window.removeEventListener(MEDICATIONS_CHANGED_EVENT, reload)
  }, [])
  return meds
}

/** Fir: one thread you throw with your thumb, one card that says what's next. */
export function Fir() {
  const state = useChildren()
  const child = activeChild(state)
  const facts = useTimelineFacts(child.id)
  const medications = useMedications()
  const now = useNow(30_000)
  const [overrides, setOverrides] = useState<Record<string, number>>({})
  const [toast, setToast] = useState<{ id: string; text: string } | null>(null)
  const [, setSelected] = useState<BeadSelection | null>(null)

  const window_ = threadWindow(now)
  const range = materializeWindow(now)
  const marks = useMemo(
    () =>
      projectRange({
        child,
        facts,
        medications,
        now,
        from: range.from < window_.from ? range.from : window_.from,
        to: range.to > window_.to ? range.to : window_.to,
      }),
    [child, facts, medications, now, range.from.getTime(), range.to.getTime(), window_.from.getTime(), window_.to.getTime()],
  )
  const doses = marks.filter((m) => m.at >= window_.from && m.at < window_.to)
  const next = nextProjectedDose(marks)
  const lastGiven = facts
    .filter((f) => f.payload.kind === 'dose' && new Date(f.at) <= now)
    .map((f) => new Date(f.at))
    .sort((a, b) => b.getTime() - a.getTime())[0] ?? null

  const nextMed = next ? medications.find((m) => m.id === next.medicationId) : undefined
  const base = next ? splitAmount(next.amount) : null
  const amount = next && base ? { n: overrides[next.medicationId] ?? base.n, unit: base.unit } : null

  const give = useCallback(
    (medicationId: string, n: number | undefined, unit: string | undefined) => {
      const fact = timelineStore.append({
        childId: child.id,
        at: new Date().toISOString(),
        payload: { kind: 'dose', medicationId, source: 'given', ...(n != null ? { amount: n, unit } : {}) },
      })
      const med = medications.find((m) => m.id === medicationId)
      const name = med ? shortName(med.name) : medicationId
      setToast({ id: fact.id, text: `${name}${n != null ? ` ${String(n).replace('.', ',')} ${unit}` : ''} dat la ${fmtHHMM(new Date(fact.at))}` })
      setOverrides((prev) => {
        const rest = { ...prev }
        delete rest[medicationId]
        return rest
      })
      navigator.vibrate?.(15)
    },
    [child.id, medications],
  )

  const startMeds = medications.filter((m) => m.kind === 'fever' && ['nurofen', 'panadol'].includes(m.id))
  const hideToast = useCallback(() => setToast(null), [])

  return (
    <div className="phone fir">
      <header className="fir-top">
        <div className="fir-child">{child.name}</div>
      </header>

      <Thread
        now={now}
        from={window_.from}
        to={window_.to}
        width={window_.width}
        doses={doses}
        facts={facts}
        medications={medications}
        nextAt={next ? next.at.getTime() : null}
        onSelect={setSelected}
      />

      <div className="fir-dock">
        {next && amount ? (
          <NextCard
            mark={next as TimelineMark}
            med={nextMed}
            amount={amount}
            lastAt={lastGiven}
            now={now}
            onAmount={(n) => setOverrides((prev) => ({ ...prev, [next.medicationId]: n }))}
            onGive={() => give(next.medicationId, amount.n, amount.unit)}
          />
        ) : (
          <StartCard
            meds={startMeds}
            onGive={(med) => {
              const a = splitAmount(doseAmount(med.id, child, medications))
              give(med.id, a.n, a.unit)
            }}
          />
        )}
      </div>

      {toast && (
        <UndoToast
          text={toast.text}
          onUndo={() => {
            timelineStore.remove(toast.id)
            setToast(null)
          }}
          onDone={hideToast}
        />
      )}
    </div>
  )
}
