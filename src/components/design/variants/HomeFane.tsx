import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { Medication } from '../../../types'
import { activeChild, childStore, useChildren } from '../childStore'
import { fmtHHMM } from '../dosePlan'
import { toggleEnabledMedication } from '../enabledMeds'
import { loadMedications, MEDICATIONS_CHANGED_EVENT, notifyMedicationsChanged, saveMedications } from '../medicineStorage'
import { materializeWindow, nextProjectedDose, projectRange } from '../timeline/project'
import { timelineStore, useTimelineFacts } from '../timeline/store'
import { marksForView, viewWindow } from '../timeline/view'
import { useGuardedTap } from '../guardTap'
import { acumChip, dayTickLabel, dayTicks, splitAmount, stepAmount } from './fane'

const PATH = 'M 6 38 Q 80 32 160 40 T 314 36'

/**
 * Fane, on the current dark tape:
 * fine weekday lines, acum stays reachable, a settings window for treatment,
 * [+] for a medicine that shows up unplanned, and a dose you swipe or type.
 */
export function HomeFane() {
  const state = useChildren()
  const child = activeChild(state)
  const facts = useTimelineFacts(child.id)
  const [medications, setMedications] = useState<Medication[]>(loadMedications)
  const [now, setNow] = useState(() => new Date())
  const [panMs, setPanMs] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [giving, setGiving] = useState(false)
  const [otherName, setOtherName] = useState('')
  const [overrides, setOverrides] = useState<Record<string, { n: number; unit: string }>>({})
  const stripRef = useRef<HTMLDivElement>(null)
  const panStart = useRef<{ x: number; panMs: number } | null>(null)
  const moved = useRef(false)

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const reload = () => setMedications(loadMedications())
    window.addEventListener(MEDICATIONS_CHANGED_EVENT, reload)
    return () => window.removeEventListener(MEDICATIONS_CHANGED_EVENT, reload)
  }, [])

  const range = materializeWindow(now)
  const allMarks = useMemo(
    () =>
      projectRange({
        child,
        facts,
        medications,
        now,
        from: range.from,
        to: range.to,
      }),
    [child, facts, medications, now, range.from.getTime(), range.to.getTime()],
  )
  const view = viewWindow(now, 'hour', panMs)
  const marks = marksForView(allMarks, view.from, view.to, 'hour')
  const next = nextProjectedDose(allMarks)
  const ticks = dayTicks(view.from, view.to)

  function pct(at: Date) {
    return ((at.getTime() - view.from.getTime()) / view.span) * 100
  }

  const chip = acumChip(pct(now))
  const nextAmount = next ? overrides[next.medicationId] ?? splitAmount(next.amount) : null

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest('[data-amount]')) return
    moved.current = false
    panStart.current = { x: e.clientX, panMs }
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!panStart.current || !stripRef.current) return
    if (Math.abs(e.clientX - panStart.current.x) > 6) moved.current = true
    const width = stripRef.current.getBoundingClientRect().width || 1
    setPanMs(panStart.current.panMs - ((e.clientX - panStart.current.x) / width) * view.span)
  }

  function onPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    const wasTap = !moved.current && panStart.current
    panStart.current = null
    if (!wasTap || (e.target as HTMLElement).closest('[data-amount], button')) return
    if (next) setGiving(true)
  }

  function confirmDose() {
    if (!next || !nextAmount) return
    timelineStore.append({
      childId: child.id,
      at: new Date().toISOString(),
      payload: {
        kind: 'dose',
        medicationId: next.medicationId,
        source: 'given',
        amount: nextAmount.n,
        unit: nextAmount.unit,
      },
    })
    setGiving(false)
    setPanMs(0)
  }
  const guardedConfirm = useGuardedTap(confirmDose)

  function addOther() {
    const name = otherName.trim()
    if (!name) return
    const med: Medication = {
      id: 'alt-' + Date.now().toString(36),
      name,
      doseType: 'fixed',
      doseConfig: { type: 'fixed', amount: '1', unit: 'doză' },
      color: '#d4c4a8',
      notes: '',
      kind: 'support',
    }
    const nextMeds = [...medications, med]
    saveMedications(nextMeds)
    notifyMedicationsChanged()
    childStore.patchActive({ enabledMedications: [...child.enabledMedications, med.id] })
    setOverrides((prev) => ({ ...prev, [med.id]: { n: 1, unit: 'doză' } }))
    setOtherName('')
  }

  const guardedAdd = useGuardedTap(addOther)

  return (
    <div className="phone">
      <button
        type="button"
        className="ui-btn"
        aria-label="setări tratament"
        onClick={() => setSettingsOpen(true)}
        style={{ position: 'absolute', top: 14, right: 14, zIndex: 5, padding: '6px 10px', fontSize: 12 }}
      >
        setări
      </button>

      <div
        ref={stripRef}
        aria-label="bandă de timp"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ flex: 1, position: 'relative', touchAction: 'none' }}
      >
        <div style={{ position: 'absolute', left: 24, right: 24, top: '46%', height: 120 }}>
          <svg viewBox="0 0 320 70" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: 78 }}>
            <path d={PATH} stroke="var(--line)" strokeWidth={1.4} fill="none" />
          </svg>
          {ticks.map((tick) => (
            <div
              key={tick.toISOString()}
              style={{
                position: 'absolute',
                left: `${pct(tick)}%`,
                top: -28,
                bottom: 8,
                width: 1,
                background: 'var(--line)',
                pointerEvents: 'none',
              }}
            >
              <div className="mono" style={{ position: 'absolute', top: 0, left: 6, fontSize: 10, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>
                {dayTickLabel(tick)}
              </div>
            </div>
          ))}
          {marks.map((m) => {
            const future = m.source === 'projected'
            const isNext = next != null && future && m.at.getTime() === next.at.getTime()
            const shown = isNext ? nextAmount : splitAmount(m.amount)
            return (
              <div
                key={`${m.factId ?? m.policy}-${m.at.toISOString()}`}
                style={{
                  position: 'absolute',
                  top: 18,
                  left: `${Math.max(2, Math.min(98, pct(m.at)))}%`,
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  zIndex: isNext ? 3 : 1,
                }}
              >
                <div
                  style={{
                    width: isNext ? 16 : 10,
                    height: isNext ? 16 : 10,
                    borderRadius: '50%',
                    background: future ? 'transparent' : 'var(--cool)',
                    border: future ? '1.8px solid var(--accent)' : 'none',
                  }}
                />
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{fmtHHMM(m.at)}</div>
                <div className="hand" style={{ fontSize: 15, color: future ? 'var(--accent-2)' : 'var(--ink-2)' }}>{m.label}</div>
                {isNext && shown && (
                  <SwipeAmount
                    value={shown.n}
                    unit={shown.unit}
                    onChange={(n, unit) => setOverrides((prev) => ({ ...prev, [m.medicationId]: { n, unit } }))}
                  />
                )}
              </div>
            )
          })}
          {chip == null && (
            <button
              type="button"
              aria-label="acum"
              onClick={() => setPanMs(0)}
              style={{
                position: 'absolute',
                top: -6,
                left: `${pct(now)}%`,
                transform: 'translateX(-50%)',
                zIndex: 6,
                background: 'transparent',
                border: 'none',
                color: 'var(--ink)',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
              }}
            >
              ▼
              <div>acum</div>
            </button>
          )}
        </div>

        {chip && (
          <button
            type="button"
            className="ui-chip"
            onClick={() => setPanMs(0)}
            style={{
              position: 'absolute',
              top: '42%',
              [chip.startsWith('<<') ? 'left' : 'right']: 16,
              zIndex: 6,
              padding: '8px 12px',
              fontSize: 13,
            }}
          >
            {chip}
          </button>
        )}
      </div>

      {giving && next && nextAmount && (
        <div role="dialog" aria-label="eveniment" className="ui-sheet">
          <div className="eyebrow">eveniment · {fmtHHMM(next.at)}</div>
          <div className="hand" style={{ fontSize: 28, color: 'var(--accent-2)', margin: '8px 0 4px' }}>
            {next.label}
          </div>
          <SwipeAmount
            value={nextAmount.n}
            unit={nextAmount.unit}
            onChange={(n, unit) => setOverrides((prev) => ({ ...prev, [next.medicationId]: { n, unit } }))}
          />
          <button type="button" className="btn-primary" style={{ marginTop: 16 }} onClick={guardedConfirm}>
            Confirmă
          </button>
        </div>
      )}

      {settingsOpen && (
        <div
          role="dialog"
          aria-label="tratament"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 40,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'flex-end',
          }}
          onClick={() => setSettingsOpen(false)}
        >
          <div className="ui-sheet" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', width: '100%' }}>
            <div className="eyebrow">tratament</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {state.children.map((c) => {
                const on = c.id === child.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-label={`copil ${c.name}`}
                    aria-pressed={on}
                    onClick={() => childStore.setActive(c.id)}
                    className="ui-chip"
                    style={{ padding: '8px 12px', fontSize: 13 }}
                  >
                    {c.name}
                  </button>
                )
              })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {medications.map((med) => {
                const on = child.enabledMedications.includes(med.id)
                return (
                  <button
                    key={med.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      childStore.patchActive({
                        enabledMedications: toggleEnabledMedication(child, med.id),
                      })
                    }
                    className="ui-chip"
                    style={{ padding: '8px 12px', fontSize: 13 }}
                  >
                    {med.name.split(/[/(]/)[0].trim()}
                  </button>
                )
              })}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                guardedAdd()
              }}
              style={{ display: 'flex', gap: 8, marginTop: 14 }}
            >
              <input
                aria-label="alt medicament"
                value={otherName}
                onChange={(e) => setOtherName(e.target.value)}
                placeholder="Alt medicament"
                className="ui-field"
                style={{ flex: 1, padding: '10px 12px', font: 'inherit' }}
              />
              <button type="submit" aria-label="adaugă alt medicament" className="ui-chip">
                +
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function SwipeAmount({
  value,
  unit,
  onChange,
}: {
  value: number
  unit: string
  onChange: (n: number, unit: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(String(value))
  const startY = useRef<number | null>(null)
  const dragged = useRef(false)

  function commitText() {
    const n = Number(text.replace(',', '.'))
    if (!Number.isNaN(n)) onChange(Math.max(0, n), unit)
    setEditing(false)
  }

  return (
    <div
      data-amount
      style={{ touchAction: 'none', marginTop: 2 }}
      onPointerDown={(e) => {
        e.stopPropagation()
        startY.current = e.clientY
        dragged.current = false
      }}
      onPointerMove={(e) => {
        if (startY.current == null || editing) return
        const dy = e.clientY - startY.current
        if (Math.abs(dy) < 18) return
        dragged.current = true
        onChange(stepAmount(value, dy > 0 ? 1 : -1), unit)
        startY.current = e.clientY
      }}
      onPointerUp={(e) => {
        e.stopPropagation()
        const wasDrag = dragged.current
        startY.current = null
        if (!wasDrag) {
          setText(String(value))
          setEditing(true)
        }
      }}
    >
      {editing ? (
        <input
          aria-label="doză"
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={commitText}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitText()
          }}
          className="ui-field"
          style={{
            width: 72,
            textAlign: 'center',
            color: 'var(--accent-2)',
            font: '600 16px var(--font-mono)',
          }}
        />
      ) : (
        <div className="mono" style={{ fontSize: 16, color: 'var(--accent)', fontWeight: 650 }}>
          {value} {unit}
        </div>
      )}
    </div>
  )
}



