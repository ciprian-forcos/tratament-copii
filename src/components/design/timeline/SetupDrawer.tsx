import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import type { Child, Medication } from '../../../types'
import { shortName } from './shortName'

export function SetupDrawer({
  open,
  childList,
  activeId,
  medications,
  onToggle,
  onSelectChild,
  onAddChild,
  onLongChild,
  onToggleMed,
  onLongMed,
}: {
  open: boolean
  childList: Child[]
  activeId: string | null
  medications: Medication[]
  onToggle: () => void
  onSelectChild: (id: string) => void
  onAddChild: () => void
  onLongChild: (id: string) => void
  onToggleMed: (medicationId: string) => void
  onLongMed: (id: string) => void
}) {
  const active = childList.find((c) => c.id === activeId) ?? childList[0]

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      <button
        type="button"
        aria-label="copii și medicamente"
        aria-expanded={open}
        onClick={onToggle}
        style={{
          pointerEvents: 'auto',
          display: 'block',
          margin: '10px auto 0',
          width: 42,
          height: 5,
          borderRadius: 99,
          border: 'none',
          background: 'var(--line)',
          cursor: 'pointer',
        }}
      />
      {open && (
        <div
          style={{
            margin: '10px 14px 0',
            padding: '12px',
            borderRadius: 18,
            border: '1.5px solid var(--line)',
            background: 'var(--bg-2)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            {childList.map((c) => {
              const on = c.id === active?.id
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-label={`copil ${c.name}`}
                  onClick={() => onSelectChild(c.id)}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    onLongChild(c.id)
                  }}
                  onPointerDown={(e) => hold(e, () => onLongChild(c.id))}
                  style={chip(on)}
                >
                  {c.name}
                </button>
              )
            })}
            <button type="button" aria-label="adaugă copil" onClick={onAddChild} style={chip(false)}>
              +
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {medications.map((m) => {
              const on = Boolean(active?.enabledMedications.includes(m.id))
              return (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={on}
                  aria-label={shortName(m.name)}
                  onClick={() => onToggleMed(m.id)}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    onLongMed(m.id)
                  }}
                  onPointerDown={(e) => hold(e, () => onLongMed(m.id))}
                  style={chip(on)}
                >
                  {shortName(m.name)}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function chip(on: boolean): CSSProperties {
  return {
    padding: '8px 12px',
    borderRadius: 999,
    border: `1.5px solid ${on ? 'var(--accent)' : 'var(--line)'}`,
    background: on ? 'rgba(245,177,74,0.16)' : 'var(--bg-3)',
    color: on ? 'var(--accent)' : 'var(--ink-2)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  }
}

function hold(e: ReactPointerEvent, fire: () => void) {
  const start = window.setTimeout(fire, 450)
  const cancel = () => {
    window.clearTimeout(start)
    window.removeEventListener('pointerup', cancel)
    window.removeEventListener('pointercancel', cancel)
  }
  window.addEventListener('pointerup', cancel)
  window.addEventListener('pointercancel', cancel)
  void e
}
