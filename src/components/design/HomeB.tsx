import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { Medication, TimelineMark, TimelineZoom } from '../../types'
import { ChildEditor } from './ChildEditor'
import { activeChild, childStore, useChildren } from './childStore'
import { fmtHHMM } from './dosePlan'
import { toggleEnabledMedication } from './enabledMeds'
import { loadMedications, MEDICATIONS_CHANGED_EVENT } from './medicineStorage'
import { useDoseReminder } from './useDoseReminder'
import { AttachSheet, type AttachValue } from './timeline/AttachSheet'
import { calculateDose } from '../../utils/doseCalculation'
import { doseAmount, materializeWindow, nextProjectedDose, projectRange } from './timeline/project'
import { SetupDrawer } from './timeline/SetupDrawer'
import { timelineStore, useTimelineFacts } from './timeline/store'
import { marksForView, viewWindow, VIEW_SPAN_MS } from './timeline/view'

const PATH = 'M 6 38 Q 80 32 160 40 T 314 36'

type Pointer = { id: number; x: number; y: number }

export function HomeB() {
  const state = useChildren()
  const child = activeChild(state)
  const facts = useTimelineFacts(child.id)
  const [medications, setMedications] = useState<Medication[]>(loadMedications)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const reload = () => setMedications(loadMedications())
    window.addEventListener(MEDICATIONS_CHANGED_EVENT, reload)
    return () => window.removeEventListener(MEDICATIONS_CHANGED_EVENT, reload)
  }, [])
  const [zoom, setZoom] = useState<TimelineZoom>('hour')
  const [panMs, setPanMs] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [attach, setAttach] = useState<AttachValue | null>(null)
  const [medNote, setMedNote] = useState<string | null>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const pointers = useRef<Map<number, Pointer>>(new Map())
  const panStart = useRef<{ x: number; panMs: number } | null>(null)
  const pinchStart = useRef<{ dist: number; span: number } | null>(null)
  const moved = useRef(false)

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

  const view = viewWindow(now, zoom, panMs)
  const marks = marksForView(allMarks, view.from, view.to, zoom)
  const next = nextProjectedDose(allMarks)
  const due = next != null && next.at.getTime() <= now.getTime()
  useDoseReminder(
    next
      ? { at: next.at, title: 'Tratament copii', body: `Dă ${next.label}` }
      : null,
  )

  function toPct(at: Date) {
    const dt = (at.getTime() - view.from.getTime()) / view.span
    return Math.max(0, Math.min(1, dt)) * 100
  }

  function timeAtX(clientX: number) {
    const rect = stripRef.current?.getBoundingClientRect()
    if (!rect) return now
    const t = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return new Date(view.from.getTime() + t * view.span)
  }

  function openAttach(at: Date, mark?: TimelineMark) {
    setAttach({
      kind: 'dose',
      at: mark?.at ?? at,
      medicationId: mark?.medicationId ?? next?.medicationId ?? 'nurofen',
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

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    pointers.current.set(e.pointerId, { id: e.pointerId, x: e.clientX, y: e.clientY })
    moved.current = false
    if (pointers.current.size === 1) {
      panStart.current = { x: e.clientX, panMs }
      pinchStart.current = null
    } else if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()]
      pinchStart.current = { dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y), span: VIEW_SPAN_MS[zoom] }
      panStart.current = null
    }
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const prev = pointers.current.get(e.pointerId)
    if (!prev) return
    pointers.current.set(e.pointerId, { id: e.pointerId, x: e.clientX, y: e.clientY })
    if (Math.abs(e.clientX - prev.x) + Math.abs(e.clientY - prev.y) > 6) moved.current = true

    if (pointers.current.size === 2 && pinchStart.current) {
      const pts = [...pointers.current.values()]
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      const ratio = pinchStart.current.dist / Math.max(24, dist)
      const span = pinchStart.current.span * ratio
      if (span < 18 * 3600_000) setZoom('hour')
      else if (span < 4 * 24 * 3600_000) setZoom('day')
      else setZoom('week')
      return
    }

    if (panStart.current && stripRef.current) {
      const dx = e.clientX - panStart.current.x
      const width = stripRef.current.getBoundingClientRect().width || 1
      setPanMs(panStart.current.panMs - (dx / width) * VIEW_SPAN_MS[zoom])
    }
  }

  function onPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    const wasTap = !moved.current && pointers.current.size <= 1
    const x = e.clientX
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinchStart.current = null
    if (pointers.current.size === 0) panStart.current = null
    if (!wasTap) return

    const at = timeAtX(x)
    const hit = marks.find((m) => Math.abs(toPct(m.at) - toPct(at)) < 4)
    openAttach(at, hit)
  }

  return (
    <div className="phone">
      <SetupDrawer
        open={drawerOpen}
        childList={state.children}
        activeId={state.activeId}
        medications={medications}
        onToggle={() => setDrawerOpen((v) => !v)}
        onSelectChild={(id) => childStore.setActive(id)}
        onAddChild={() => {
          childStore.add()
          setEditorOpen(true)
        }}
        onLongChild={(id) => {
          childStore.setActive(id)
          setEditorOpen(true)
        }}
        onToggleMed={(medicationId) => {
          childStore.patchActive({
            enabledMedications: toggleEnabledMedication(child, medicationId),
          })
        }}
        onLongMed={(id) => {
          const med = medications.find((m) => m.id === id)
          setMedNote(med ? `${med.name}\n${med.notes}` : id)
        }}
      />

      <div
        ref={stripRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-label="bandă de timp"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '8px 24px 24px',
          touchAction: 'none',
        }}
      >
        {due && next && (
          <div
            className="hand"
            style={{ textAlign: 'center', fontSize: 28, color: 'var(--accent-2)', marginBottom: 18 }}
          >
            dă {next.amount ? `${next.amount} ` : ''}{next.label} acum
          </div>
        )}
        <div style={{ position: 'relative', height: 120 }}>
          <svg
            viewBox="0 0 320 70"
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: 78 }}
          >
            <path d={PATH} stroke="var(--line)" strokeWidth={1.4} fill="none" />
          </svg>
          {marks.map((m) => {
            const isNext = next != null && m.source === 'projected' && m.at.getTime() === next.at.getTime()
            const future = m.source === 'projected'
            return (
              <div
                key={`${m.source}-${m.medicationId}-${m.at.toISOString()}-${m.factId ?? ''}`}
                style={{
                  position: 'absolute',
                  top: 18,
                  left: `${toPct(m.at)}%`,
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  pointerEvents: 'none',
                }}
              >
                <div
                  className={isNext ? 'pulse-dot' : undefined}
                  style={{
                    width: isNext ? 16 : 10,
                    height: isNext ? 16 : 10,
                    borderRadius: '50%',
                    background: future ? 'transparent' : 'var(--cool)',
                    border: future ? '1.8px solid var(--accent)' : 'none',
                    boxShadow: isNext ? '0 0 0 4px rgba(245,177,74,0.18)' : 'none',
                  }}
                />
                <div className="mono" style={{ fontSize: 10, color: future ? 'var(--accent)' : 'var(--ink-3)' }}>
                  {fmtHHMM(m.at)}
                </div>
                <div className="hand" style={{ fontSize: 16, color: future ? 'var(--accent-2)' : 'var(--ink-2)' }}>
                  {m.label}
                </div>
                {isNext && m.amount && (
                  <div className="mono" style={{ fontSize: 11, color: 'var(--accent)' }}>
                    {m.amount}
                  </div>
                )}
              </div>
            )
          })}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: `${toPct(now)}%`,
              transform: 'translateX(-50%)',
              color: 'var(--ink)',
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            ▼
            <div>acum</div>
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

      {medNote && (
        <button
          type="button"
          onClick={() => setMedNote(null)}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 50,
            background: 'rgba(0,0,0,0.55)',
            border: 'none',
            color: 'var(--ink)',
            padding: 24,
            font: 'inherit',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              background: 'var(--bg-2)',
              border: '1.5px solid var(--line)',
              borderRadius: 16,
              padding: 16,
              whiteSpace: 'pre-wrap',
            }}
          >
            {medNote}
          </div>
        </button>
      )}
    </div>
  )
}
