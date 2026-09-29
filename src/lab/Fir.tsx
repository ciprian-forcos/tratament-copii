import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Medication, TimelineFact, TimelineMark } from '../types'
import { activeChild, childStore, useChildren } from '../components/design/childStore'
import { Presence } from '../components/design/Presence'
import { fmtHHMM } from '../components/design/dosePlan'
import { loadMedications, MEDICATIONS_CHANGED_EVENT, notifyMedicationsChanged, saveMedications } from '../components/design/medicineStorage'
import { doseAmount, materializeWindow, nextProjectedDose, projectRange } from '../components/design/timeline/project'
import { shortName } from '../components/design/timeline/shortName'
import { timelineStore, useTimelineFacts } from '../components/design/timeline/store'
import { splitAmount } from '../components/design/variants/fane'
import { AddSheet, type NewMedicine } from './AddSheet'
import { BeadCard } from './BeadCard'
import { Glyph } from './Glyph'
import { NextCard, StartCard } from './NextCard'
import { Thread, type BeadSelection } from './Thread'
import { UndoToast } from './UndoToast'
import { threadWindow } from './thread'
import './fir.css'

const NEW_COLORS = ['#0e7490', '#7c3aed', '#be185d', '#15803d', '#b45309']

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
  const [toast, setToast] = useState<{ text: string; undo: () => void } | null>(null)
  const [selected, setSelected] = useState<BeadSelection | null>(null)
  const [adding, setAdding] = useState(false)

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

  const record = useCallback((fact: Omit<TimelineFact, 'id'>, text: string) => {
    const saved = timelineStore.append(fact)
    setToast({ text, undo: () => timelineStore.remove(saved.id) })
    navigator.vibrate?.(15)
    return saved
  }, [])

  const nameOf = useCallback(
    (medicationId: string) => {
      const med = medications.find((m) => m.id === medicationId)
      return med ? shortName(med.name) : medicationId
    },
    [medications],
  )

  const give = useCallback(
    (medicationId: string, n: number | undefined, unit: string | undefined, at = new Date()) => {
      const saved = record(
        {
          childId: child.id,
          at: at.toISOString(),
          payload: { kind: 'dose', medicationId, source: 'given', ...(n != null ? { amount: n, unit } : {}) },
        },
        `${nameOf(medicationId)}${n != null ? ` ${String(n).replace('.', ',')} ${unit}` : ''} dat la ${fmtHHMM(at)}`,
      )
      setOverrides((prev) => {
        const rest = { ...prev }
        delete rest[medicationId]
        return rest
      })
      return saved
    },
    [child.id, nameOf, record],
  )

  function createMedicine({ name, form }: NewMedicine, unit: string): Medication {
    const med: Medication = {
      id: 'alt-' + Date.now().toString(36),
      name,
      doseType: 'fixed',
      doseConfig: { type: 'fixed', amount: '1', unit },
      color: NEW_COLORS[medications.length % NEW_COLORS.length],
      notes: '',
      form,
      kind: 'support',
    }
    saveMedications([...medications, med])
    notifyMedicationsChanged()
    childStore.patchActive({ enabledMedications: [...child.enabledMedications, med.id] })
    return med
  }

  function remove(fact: TimelineFact) {
    timelineStore.remove(fact.id)
    setSelected(null)
    setToast({ text: 'Șters', undo: () => timelineStore.append(fact) })
  }

  const startMeds = medications.filter((m) => m.kind === 'fever' && ['nurofen', 'panadol'].includes(m.id))
  const hideToast = useCallback(() => setToast(null), [])

  return (
    <div className="phone fir">
      <header className="fir-top">
        <div className="fir-child">{child.name}</div>
        <button type="button" className="ui-btn fir-fab" aria-label="adaugă" onClick={() => setAdding(true)}>
          <Glyph name="plus" size={26} />
        </button>
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

      <Presence show={adding}>
        {adding && (
          <div className="fir-scrim" onClick={() => setAdding(false)}>
            <div onClick={(e) => e.stopPropagation()}>
              <AddSheet
                child={child}
                medications={medications}
                suggestedMedId={next?.medicationId}
                onClose={() => setAdding(false)}
                onDose={(m, a, at) => {
                  const med = 'id' in m ? m : createMedicine(m, a.unit)
                  setAdding(false)
                  give(med.id, a.n, a.unit, at)
                }}
                onTemperature={(celsius, at) => {
                  setAdding(false)
                  record(
                    { childId: child.id, at: at.toISOString(), payload: { kind: 'temperature', celsius } },
                    `${celsius.toFixed(1).replace('.', ',')}° la ${fmtHHMM(at)}`,
                  )
                }}
                onNote={(text, at) => {
                  setAdding(false)
                  record({ childId: child.id, at: at.toISOString(), payload: { kind: 'note', text } }, `${text} · ${fmtHHMM(at)}`)
                }}
              />
            </div>
          </div>
        )}
      </Presence>

      <Presence show={selected != null}>
        {selected && (
          <div className="fir-scrim" onClick={() => setSelected(null)}>
            <div onClick={(e) => e.stopPropagation()}>
              <BeadCard
                bead={selected}
                facts={facts}
                medications={medications}
                now={now}
                onClose={() => setSelected(null)}
                onDelete={remove}
                onGiveNow={(medicationId, label) => {
                  const a = label ? splitAmount(label) : undefined
                  setSelected(null)
                  give(medicationId, overrides[medicationId] ?? a?.n, a?.unit)
                }}
              />
            </div>
          </div>
        )}
      </Presence>

      {toast && (
        <UndoToast
          text={toast.text}
          onUndo={() => {
            toast.undo()
            setToast(null)
          }}
          onDone={hideToast}
        />
      )}
    </div>
  )
}
