import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import type { Medication, TimelineMark } from '../../../types'
import { ChildEditor } from '../ChildEditor'
import { activeChild, childStore, useChildren } from '../childStore'
import { fmtHHMM } from '../dosePlan'
import { toggleEnabledMedication } from '../enabledMeds'
import { loadMedications, MEDICATIONS_CHANGED_EVENT } from '../medicineStorage'
import { AttachSheet, type AttachValue } from '../timeline/AttachSheet'
import { calculateDose } from '../../../utils/doseCalculation'
import { doseAmount, materializeWindow, nextProjectedDose, projectRange } from '../timeline/project'
import { timelineStore, useTimelineFacts } from '../timeline/store'
import { marksForView, viewWindow } from '../timeline/view'

/**
 * Edi: same medication timeline, different surface.
 * Grouped pictograms stay visible (child face, small clock, medicine glyphs).
 * No amber, no handwriting, no wall of labels on the line.
 */
const PATH = 'M 6 38 Q 80 32 160 40 T 314 36'

export function HomeEdi() {
  const state = useChildren()
  const child = activeChild(state)
  const facts = useTimelineFacts(child.id)
  const [medications, setMedications] = useState<Medication[]>(loadMedications)
  const [now, setNow] = useState(() => new Date())
  const [panMs, setPanMs] = useState(0)
  const [editorOpen, setEditorOpen] = useState(false)
  const [attach, setAttach] = useState<AttachValue | null>(null)
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

  const windowRange = materializeWindow(now)
  const allMarks = useMemo(
    () =>
      projectRange({
        child,
        facts,
        medications,
        now,
        from: windowRange.from,
        to: windowRange.to,
      }),
    [child, facts, medications, now, windowRange.from.getTime(), windowRange.to.getTime()],
  )
  const view = viewWindow(now, 'hour', panMs)
  const marks = marksForView(allMarks, view.from, view.to, 'hour')
  const next = nextProjectedDose(allMarks)

  function toPct(at: Date) {
    return Math.max(0, Math.min(1, (at.getTime() - view.from.getTime()) / view.span)) * 100
  }

  function colorFor(id: string) {
    return medications.find((m) => m.id === id)?.color ?? '#2a6f6a'
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
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
    const wasTap = !moved.current
    panStart.current = null
    if (!wasTap || !stripRef.current) return
    const rect = stripRef.current.getBoundingClientRect()
    const t = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const at = new Date(view.from.getTime() + t * view.span)
    const hit = marks.find((m) => Math.abs(toPct(m.at) - t * 100) < 4)
    setAttach({
      kind: 'dose',
      at: hit?.at ?? at,
      medicationId: hit?.medicationId ?? next?.medicationId ?? 'nurofen',
    })
  }

  function confirmAttach() {
    if (!attach) return
    if (attach.kind === 'dose' && attach.medicationId) {
      const med = medications.find((m) => m.id === attach.medicationId)
      timelineStore.append({
        childId: child.id,
        at: attach.at.toISOString(),
        payload: {
          kind: 'dose',
          medicationId: attach.medicationId,
          source: 'given',
          amount: med ? calculateDose(med, child.weight, child.height) : undefined,
          unit: med?.doseConfig.unit,
        },
      })
    } else if (attach.kind === 'temperature') {
      timelineStore.append({
        childId: child.id,
        at: attach.at.toISOString(),
        payload: { kind: 'temperature', celsius: attach.celsius ?? 38 },
      })
    } else if (attach.kind === 'note') {
      timelineStore.append({
        childId: child.id,
        at: attach.at.toISOString(),
        payload: { kind: 'note', text: attach.text ?? '' },
      })
    }
    setAttach(null)
  }

  function cycleChild() {
    const list = state.children
    if (list.length === 0) return
    const i = list.findIndex((c) => c.id === state.activeId)
    childStore.setActive(list[(i + 1) % list.length].id)
  }

  return (
    <div className="phone">
      <div style={{ padding: '18px 16px 0', display: 'grid', gridTemplateColumns: '72px 1fr', gap: 10 }}>
        <IconButton label={`copil ${child.name}`} onClick={cycleChild} onHold={() => setEditorOpen(true)}>
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <Face />
            <span style={{ fontSize: 13 }}>{child.name}</span>
          </span>
        </IconButton>
        <IconButton label={`ceas ${fmtHHMM(now)}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock hour={now.getHours()} minute={now.getMinutes()} />
            <div>
              <div style={{ fontVariantNumeric: 'tabular-nums', fontSize: 22, fontWeight: 650 }}>
                {fmtHHMM(now)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                {next ? fmtHHMM(next.at) : '—'}
              </div>
            </div>
          </div>
        </IconButton>
      </div>

      <div
        aria-label="medicamente"
        style={{ display: 'flex', gap: 8, padding: '10px 16px 0', flexWrap: 'wrap' }}
      >
        {medications.slice(0, 6).map((med) => {
          const on = child.enabledMedications.includes(med.id)
          return (
            <IconButton
              key={med.id}
              label={med.name.split(/[/(]/)[0].trim()}
              pressed={on}
              onClick={() =>
                childStore.patchActive({
                  enabledMedications: toggleEnabledMedication(child, med.id),
                })
              }
            >
              <Capsule color={med.color} hollow={!on} />
            </IconButton>
          )
        })}
      </div>

      <div
        ref={stripRef}
        aria-label="bandă de timp"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8px 18px 28px', touchAction: 'none' }}
      >
        {next?.amount && (
          <div style={{ textAlign: 'center', marginBottom: 8, color: 'var(--accent)', fontWeight: 600, fontSize: 22 }}>
            {next.amount}
          </div>
        )}
        <div style={{ position: 'relative', height: 110 }}>
          <svg viewBox="0 0 320 70" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: 70 }}>
            <path d={PATH} stroke="var(--tape, var(--ink-3))" strokeWidth={1.4} fill="none" />
          </svg>
          {marks.map((m) => {
            const future = m.source === 'projected'
            const isNext = next != null && future && m.at.getTime() === next.at.getTime()
            const color = colorFor(m.medicationId)
            return (
              <Mark key={`${m.factId ?? m.policy}-${m.at.toISOString()}`} mark={m} left={toPct(m.at)} color={color} future={future} emphasize={isNext} />
            )
          })}
          <div style={{ position: 'absolute', top: 0, left: `${toPct(now)}%`, transform: 'translateX(-50%)', fontSize: 10, color: '#1e2430', textAlign: 'center' }}>
            ▼
          </div>
        </div>
      </div>

      {attach && (
        <AttachSheet
          value={attach}
          medications={medications}
          suggested={next}
          amount={
            attach.kind === 'dose' && attach.medicationId
              ? doseAmount(attach.medicationId, child, medications)
              : undefined
          }
          onChange={setAttach}
          onConfirm={confirmAttach}
          onClose={() => setAttach(null)}
        />
      )}
      <ChildEditor open={editorOpen} onClose={() => setEditorOpen(false)} />
    </div>
  )
}

function Mark({
  mark,
  left,
  color,
  future,
  emphasize,
}: {
  mark: TimelineMark
  left: number
  color: string
  future: boolean
  emphasize: boolean
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: `${left}%`,
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        pointerEvents: 'none',
      }}
    >
      <Capsule color={color} hollow={future} small={!emphasize} />
      <span style={{ fontSize: 10, color: 'var(--ink-3)', fontVariantNumeric: 'tabular-nums' }}>{fmtHHMM(mark.at)}</span>
    </div>
  )
}

function IconButton({
  label,
  children,
  onClick,
  onHold,
  pressed,
}: {
  label: string
  children: ReactNode
  onClick?: () => void
  onHold?: () => void
  pressed?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      className="ui-btn"
      onClick={onClick}
      onContextMenu={(e) => {
        if (!onHold) return
        e.preventDefault()
        onHold()
      }}
      style={{
        minHeight: 64,
        padding: '8px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {children}
    </button>
  )
}

function Face() {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="24" r="22" fill="#1a1612" />
      <circle cx="17" cy="20" r="2.2" fill="#f6f1e7" />
      <circle cx="31" cy="20" r="2.2" fill="#f6f1e7" />
      <path d="M16 29 Q24 36 32 29" stroke="#f6f1e7" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function Clock({ hour, minute }: { hour: number; minute: number }) {
  const m = (minute / 60) * 360 - 90
  const h = (((hour % 12) + minute / 60) / 12) * 360 - 90
  const hand = (ang: number, len: number) => {
    const r = (ang * Math.PI) / 180
    return [24 + Math.cos(r) * len, 24 + Math.sin(r) * len]
  }
  const [mx, my] = hand(m, 14)
  const [hx, hy] = hand(h, 9)
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="24" r="20" fill="none" stroke="#1a1612" strokeWidth="1.4" />
      <line x1="24" y1="24" x2={hx} y2={hy} stroke="#1a1612" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="24" y1="24" x2={mx} y2={my} stroke="#9c3b2e" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function Capsule({ color, hollow, small }: { color: string; hollow?: boolean; small?: boolean }) {
  const w = small ? 16 : 28
  const h = small ? 10 : 16
  return (
    <svg width={w} height={h} viewBox="0 0 28 16" aria-hidden>
      <rect x="1" y="1" width="26" height="14" rx="7" fill={hollow ? 'none' : color} stroke={color} strokeWidth="1.8" />
    </svg>
  )
}
