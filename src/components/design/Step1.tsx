import { useEffect, useState } from 'react'
import { StepShell } from './StepShell'
import { ChildEditor } from './ChildEditor'
import { activeChild, ageWords, childStore, useChildren } from './childStore'

interface Props {
  value: number | undefined
  onChange: (v: number) => void
  onBack: () => void
  onNext: () => void
}

const PRESETS = [37.5, 38.0, 38.5, 39.0, 39.5, 40.0, 40.5, 41.0]

export function Step1({ value, onChange, onBack, onNext }: Props) {
  const v = value ?? 37.0
  const fever = v >= 38
  const set = (n: number) => onChange(Math.max(35, Math.min(43, +n.toFixed(1))))
  const [editorOpen, setEditorOpen] = useState(false)

  const state = useChildren()
  const child = activeChild(state)

  return (
    <StepShell
      step={1}
      title="Cât are acum?"
      hint="apasă + sau − până potrivești."
      onBack={onBack}
      onNext={onNext}
      ctaLabel="Continuă"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          margin: '10px 0 6px',
        }}
      >
        <button className="bumper" onClick={() => set(v - 0.1)} aria-label="minus">
          −
        </button>
        <div style={{ textAlign: 'center' }}>
          <div className={`temp-big ${fever ? 'is-fever' : ''}`}>
            {v.toFixed(1)}
            <span className="temp-unit">°C</span>
          </div>
          <div
            className="hand"
            style={{
              fontSize: 22,
              color: fever ? 'var(--danger)' : 'var(--safe)',
              marginTop: 4,
            }}
          >
            {v >= 40 ? 'febră mare' : v >= 38 ? 'febră' : 'ok'}
          </div>
        </div>
        <button className="bumper" onClick={() => set(v + 0.1)} aria-label="plus">
          +
        </button>
      </div>

      <div className="field-label" style={{ marginTop: 18 }}>
        presetări rapide
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {PRESETS.map((p) => {
          const active = Math.abs(p - v) < 0.05
          return (
            <button
              key={p}
              onClick={() => set(p)}
              className="mono"
              style={{
                padding: '12px 0',
                borderRadius: 12,
                border: '1.5px solid ' + (active ? 'var(--accent)' : 'var(--line)'),
                background: active ? 'rgba(245,177,74,0.12)' : 'var(--bg-2)',
                color: active ? 'var(--accent)' : 'var(--ink)',
                fontSize: 15,
                cursor: 'pointer',
              }}
            >
              {p.toFixed(1)}
            </button>
          )
        })}
      </div>

      <div style={{ flex: 1 }} />

      <button
        type="button"
        onClick={() => setEditorOpen(true)}
        aria-label={`editează profil ${child.name}`}
        style={{
          padding: '12px 14px',
          marginTop: 18,
          border: '1.5px dashed var(--line)',
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: 'var(--ink-2)',
          fontSize: 13,
          width: '100%',
          background: 'transparent',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            background: 'var(--bg-3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--ink)',
            fontFamily: 'var(--font-hand)',
            fontSize: 18,
          }}
        >
          {child.initial ?? child.name.trim()[0]?.toUpperCase() ?? '?'}
        </span>
        <div>
          <div style={{ color: 'var(--ink)' }}>
            {child.name} · {ageWords(child)} · {child.weight} kg
          </div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
            tap pentru greutate · folosit pentru calculul dozei
          </div>
        </div>
      </button>

      {value != null && <PersistTempOnChange value={value} />}
      <ChildEditor open={editorOpen} onClose={() => setEditorOpen(false)} />
    </StepShell>
  )
}

/** Side-effect helper: write the current Step1 temp onto the active child. */
function PersistTempOnChange({ value }: { value: number }) {
  useEffect(() => {
    const s = childStore.get()
    const a = s.children.find((c) => c.id === s.activeId)
    if (a && a.temp !== value) childStore.patchActive({ temp: value })
  }, [value])
  return null
}
