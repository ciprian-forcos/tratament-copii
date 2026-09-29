import { useEffect, useRef, useState } from 'react'
import type { Child, Medication, MedicationForm } from '../types'
import { useGuardedTap } from '../components/design/guardTap'
import { doseAmount } from '../components/design/timeline/project'
import { shortName } from '../components/design/timeline/shortName'
import { splitAmount } from '../components/design/variants/fane'
import { formUnitLabel, inferMedicationForm } from '../utils/medicationForm'
import { Amount } from './Amount'
import { Glyph, type GlyphName } from './Glyph'
import { TempDial } from './TempDial'

export type Tab = 'doza' | 'temp' | 'nota'

const FORMS: { id: MedicationForm; label: string }[] = [
  { id: 'sirop', label: 'sirop' },
  { id: 'picaturi', label: 'picături' },
  { id: 'spray', label: 'spray' },
  { id: 'supozitor', label: 'supozitor' },
]

export const NOTE_PRESETS: { text: string; glyph: GlyphName }[] = [
  { text: 'Doarme', glyph: 'somn' },
  { text: 'A mâncat', glyph: 'mancare' },
  { text: 'A vărsat', glyph: 'varsat' },
  { text: 'Erupție', glyph: 'eruptie' },
  { text: 'Tuse', glyph: 'tuse' },
]

const WHEN = [
  { minutes: 0, label: 'acum', short: 'acum' },
  { minutes: 15, label: 'acum 15 min', short: '−15 min' },
  { minutes: 30, label: 'acum 30 min', short: '−30 min' },
  { minutes: 60, label: 'acum 1 h', short: '−1 h' },
]

export type NewMedicine = { name: string; form: MedicationForm }

/** One sheet for everything you can attach to the thread. */
export function AddSheet({
  child,
  medications,
  suggestedMedId,
  initialTab = 'doza',
  onClose,
  onDose,
  onTemperature,
  onNote,
}: {
  child: Child
  medications: Medication[]
  suggestedMedId?: string
  initialTab?: Tab
  onClose: () => void
  onDose: (med: Medication | NewMedicine, amount: { n: number; unit: string }, at: Date) => void
  onTemperature: (celsius: number, at: Date) => void
  onNote: (text: string, at: Date) => void
}) {
  const [tab, setTab] = useState<Tab>(initialTab)
  const [medId, setMedId] = useState<string | null>(suggestedMedId ?? null)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newForm, setNewForm] = useState<MedicationForm>('sirop')
  const [amounts, setAmounts] = useState<Record<string, number>>({})
  const [minutesAgo, setMinutesAgo] = useState(0)
  const [temp, setTemp] = useState(38)
  const [note, setNote] = useState('')
  const newMedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (creating) newMedRef.current?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' })
  }, [creating])

  const med = medications.find((m) => m.id === medId)
  const base = med ? splitAmount(doseAmount(med.id, child, medications)) : { n: 1, unit: formUnitLabel(newForm) }
  const key = creating ? '__new' : medId ?? ''
  const amount = { n: amounts[key] ?? base.n, unit: base.unit }

  const canAdd =
    tab === 'temp' || (tab === 'nota' && note.trim() !== '') || (tab === 'doza' && (creating ? newName.trim() !== '' : !!med))

  const add = useGuardedTap(() => {
    if (!canAdd) return
    const at = new Date(Date.now() - minutesAgo * 60_000)
    if (tab === 'temp') onTemperature(temp, at)
    else if (tab === 'nota') onNote(note.trim(), at)
    else if (creating) onDose({ name: newName.trim(), form: newForm }, amount, at)
    else if (med) onDose(med, amount, at)
  })

  return (
    <div className="ui-sheet fir-add" role="dialog" aria-label="adaugă">
      <button type="button" className="ui-grabber" aria-label="închide" onClick={onClose} style={{ marginTop: -12 }} />

      <div className="fir-tabs" role="tablist" aria-label="ce adaugi">
        {(
          [
            ['doza', 'Doză', 'sirop'],
            ['temp', 'Temperatură', 'temperatura'],
            ['nota', 'Notă', 'nota'],
          ] as const
        ).map(([id, label, glyph]) => (
          <button
            key={id}
            type="button"
            role="tab"
            className="ui-btn fir-tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
          >
            <Glyph name={glyph} size={20} />
            {label}
          </button>
        ))}
      </div>

      <div className="fir-add-body">
        {tab === 'doza' && (
          <>
            <div className="fir-med-grid">
              {medications.map((m) => {
                const a = doseAmount(m.id, child, medications)
                return (
                  <button
                    key={m.id}
                    type="button"
                    className="ui-chip fir-med"
                    aria-pressed={!creating && medId === m.id}
                    style={{ ['--med' as string]: m.color }}
                    onClick={() => {
                      setCreating(false)
                      setMedId(m.id)
                    }}
                  >
                    <span className="fir-med-glyph">
                      <Glyph name={inferMedicationForm(m)} size={20} />
                    </span>
                    <span className="fir-med-name">{shortName(m.name)}</span>
                    {a && <small>{a}</small>}
                  </button>
                )
              })}
              <button
                type="button"
                className="ui-chip fir-med fir-med--new"
                aria-pressed={creating}
                onClick={() => setCreating(true)}
              >
                <span className="fir-med-glyph">
                  <Glyph name="plus" size={20} />
                </span>
                <span className="fir-med-name">Alt medicament</span>
              </button>
            </div>
            {creating && (
              <div className="fir-new-med" ref={newMedRef}>
                <input
                  className="ui-field"
                  aria-label="nume medicament"
                  placeholder="Nume"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <div className="fir-forms" role="radiogroup" aria-label="formă">
                  {FORMS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      role="radio"
                      className="ui-btn fir-form"
                      aria-checked={newForm === f.id}
                      aria-label={f.label}
                      onClick={() => setNewForm(f.id)}
                    >
                      <Glyph name={f.id} size={20} />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {(med || creating) && (
              <div className="fir-add-amount">
                <span className="eyebrow">Cât</span>
                <Amount n={amount.n} unit={amount.unit} onChange={(n) => setAmounts((p) => ({ ...p, [key]: n }))} />
              </div>
            )}
          </>
        )}

        {tab === 'temp' && (
          <div className="fir-temp">
            <button type="button" className="ui-btn fir-step" aria-label="mai rece" onClick={() => setTemp((t) => Math.max(35, Math.round((t - 0.1) * 10) / 10))}>
              −
            </button>
            <TempDial value={temp} onChange={setTemp} />
            <button type="button" className="ui-btn fir-step" aria-label="mai cald" onClick={() => setTemp((t) => Math.min(41, Math.round((t + 0.1) * 10) / 10))}>
              +
            </button>
          </div>
        )}

        {tab === 'nota' && (
          <>
            <div className="fir-presets">
              {NOTE_PRESETS.map((p) => (
                <button
                  key={p.text}
                  type="button"
                  className="ui-chip fir-preset"
                  aria-pressed={note === p.text}
                  aria-label={p.text}
                  onClick={() => setNote(p.text)}
                >
                  <Glyph name={p.glyph} size={24} />
                  <span>{p.text}</span>
                </button>
              ))}
            </div>
            <textarea
              className="ui-field fir-note"
              aria-label="notă"
              rows={2}
              placeholder="Sau scrie…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </>
        )}
      </div>

      <div className="fir-when" role="radiogroup" aria-label="când">
        {WHEN.map((w) => (
          <button
            key={w.minutes}
            type="button"
            role="radio"
            className="ui-btn fir-when-btn"
            aria-checked={minutesAgo === w.minutes}
            aria-label={w.label}
            onClick={() => setMinutesAgo(w.minutes)}
          >
            {w.short}
          </button>
        ))}
      </div>

      <button type="button" className="btn-primary" disabled={!canAdd} onClick={add}>
        Adaugă
      </button>
    </div>
  )
}
