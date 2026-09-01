import { StepShell } from './StepShell'
import { RoDateTimeField } from './RoDateTimeField'

const DEFAULT_FEVER_CHOICES = [
  { id: 'nurofen', label: 'Nurofen', sub: 'ibuprofen' },
  { id: 'panadol', label: 'Panadol', sub: 'paracetamol' },
]

export type Step2MedChoice = { id: string; label: string; sub: string }

export interface Step2Value {
  kind: 'first' | 'last'
  med?: string
  lastAt?: string
}

interface Props {
  value: Step2Value
  onChange: (v: Step2Value) => void
  onBack: () => void
  onNext: () => void
  medications?: Step2MedChoice[]
}

export function Step2({ value, onChange, onBack, onNext, medications = DEFAULT_FEVER_CHOICES }: Props) {
  const v = value
  const set = (patch: Partial<Step2Value>) => onChange({ ...v, ...patch })
  const disabled = v.kind === 'last' && (!v.med || !v.lastAt)
  const choices = medications.length > 0 ? medications : DEFAULT_FEVER_CHOICES

  return (
    <StepShell
      step={2}
      title="Ai mai administrat altceva?"
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
            <div className="chip-title">Ultima doză a fost...</div>
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
            {choices.map((m) => {
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

          <RoDateTimeField
            label="data si ora"
            ariaLabel="data si ora"
            value={v.lastAt ?? ''}
            onChange={(lastAt) => set({ lastAt })}
          />
        </div>
      )}

      <div style={{ flex: 1 }} />
    </StepShell>
  )
}
