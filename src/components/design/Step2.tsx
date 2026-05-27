import { StepShell } from './StepShell'

const MEDS = [
  { id: 'nurofen', label: 'Nurofen', sub: 'ibuprofen' },
  { id: 'panadol', label: 'Panadol', sub: 'paracetamol' },
  { id: 'diclofenac', label: 'Novocalmin', sub: 'supozitor diclofenac' },
  { id: 'virodep', label: 'Virodep', sub: 'vit D + C' },
]

export interface Step2Value {
  kind: 'first' | 'last'
  med?: string
  time?: string
}

interface Props {
  value: Step2Value
  onChange: (v: Step2Value) => void
  onBack: () => void
  onNext: () => void
}

const TIMES = ['00:00', '01:00', '02:00', '03:00', 'alt...']

export function Step2({ value, onChange, onBack, onNext }: Props) {
  const v = value
  const set = (patch: Partial<Step2Value>) => onChange({ ...v, ...patch })
  const disabled = v.kind === 'last' && (!v.med || !v.time)

  return (
    <StepShell
      step={2}
      title="Ai mai dat ceva?"
      hint="ca să nu suprapunem."
      onBack={onBack}
      onNext={onNext}
      ctaDisabled={disabled}
      ctaLabel="Generează planul"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          className="chip"
          aria-checked={v.kind === 'first'}
          onClick={() => onChange({ kind: 'first' })}
        >
          <span className="radio-dot" />
          <div>
            <div className="chip-title">Primul tratament</div>
            <div className="chip-sub">nimic în ultimele ore</div>
          </div>
        </button>
        <button
          className="chip"
          aria-checked={v.kind === 'last'}
          onClick={() => set({ kind: 'last' })}
        >
          <span className="radio-dot" />
          <div>
            <div className="chip-title">Ultima doză a fost…</div>
            <div className="chip-sub">spune-mi ce și când</div>
          </div>
        </button>
      </div>

      {v.kind === 'last' && (
        <div style={{ marginTop: 22 }}>
          <div className="field-label">medicament</div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              marginBottom: 16,
            }}
          >
            {MEDS.map((m) => {
              const active = v.med === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => set({ med: m.id })}
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    borderRadius: 14,
                    border: '1.5px solid ' + (active ? 'var(--accent)' : 'var(--line)'),
                    background: active ? 'rgba(245,177,74,0.08)' : 'var(--bg-2)',
                    color: 'var(--ink)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{m.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{m.sub}</div>
                </button>
              )
            })}
          </div>

          <div className="field-label">la ce oră</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {TIMES.map((t) => {
              const active = v.time === t
              return (
                <button
                  key={t}
                  onClick={() => set({ time: t })}
                  className="mono"
                  style={{
                    padding: '12px 0',
                    borderRadius: 12,
                    border: '1.5px solid ' + (active ? 'var(--accent)' : 'var(--line)'),
                    background: active ? 'rgba(245,177,74,0.10)' : 'var(--bg-2)',
                    color: active ? 'var(--accent)' : 'var(--ink)',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  {t}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />
    </StepShell>
  )
}
