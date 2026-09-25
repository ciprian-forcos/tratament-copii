import type { CSSProperties } from 'react'
import type { Medication, TimelineMark } from '../../../types'
import { shortName } from './shortName'

export type AttachKind = 'dose' | 'temperature' | 'note'

export type AttachValue = {
  kind: AttachKind
  at: Date
  medicationId?: string
  celsius?: number
  text?: string
}

export function AttachSheet({
  value,
  medications,
  suggested,
  amount,
  onChange,
  onConfirm,
  onClose,
}: {
  value: AttachValue
  medications: Medication[]
  suggested?: TimelineMark | null
  amount?: string
  onChange: (next: AttachValue) => void
  onConfirm: () => void
  onClose: () => void
}) {
  const time = fmt(value.at)
  const doseMeds = medications

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 40,
        background: 'var(--bg-2)',
        borderTop: '1.5px solid var(--line)',
        borderRadius: '22px 22px 0 0',
        padding: '14px 18px 20px',
      }}
    >
      <button
        type="button"
        aria-label="închide"
        onClick={onClose}
        style={{
          width: 40,
          height: 4,
          borderRadius: 4,
          background: 'var(--line)',
          margin: '0 auto 12px',
          border: 'none',
          display: 'block',
          cursor: 'pointer',
        }}
      />
      <div className="eyebrow">eveniment · {time}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, margin: '12px 0' }}>
        <KindChip
          label="Temperatură"
          active={value.kind === 'temperature'}
          onClick={() => onChange({ ...value, kind: 'temperature', celsius: value.celsius ?? 38.0 })}
        />
        <KindChip
          label="Am dat doza"
          active={value.kind === 'dose'}
          onClick={() =>
            onChange({
              ...value,
              kind: 'dose',
              medicationId: value.medicationId ?? suggested?.medicationId ?? 'nurofen',
            })
          }
        />
        <KindChip
          label="Notă"
          active={value.kind === 'note'}
          onClick={() => onChange({ ...value, kind: 'note', text: value.text ?? '' })}
        />
      </div>

      {value.kind === 'dose' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {doseMeds.map((m) => {
            const on = value.medicationId === m.id
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onChange({ ...value, medicationId: m.id })}
                style={chipStyle(on)}
              >
                {shortName(m.name)}
              </button>
            )
          })}
        </div>
      )}

      {value.kind === 'dose' && amount && (
        <div className="mono" style={{ fontSize: 28, textAlign: 'center', margin: '4px 0 14px', color: 'var(--accent-2)' }}>
          {amount}
        </div>
      )}

      {value.kind === 'temperature' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '8px 0 14px' }}>
          <button type="button" style={roundBtn} onClick={() => bumpTemp(value, onChange, -0.1)}>
            −
          </button>
          <div className="mono" style={{ fontSize: 36, color: 'var(--danger)' }}>
            {(value.celsius ?? 38).toFixed(1)}°
          </div>
          <button type="button" style={roundBtn} onClick={() => bumpTemp(value, onChange, 0.1)}>
            +
          </button>
        </div>
      )}

      {value.kind === 'note' && (
        <textarea
          aria-label="notă"
          value={value.text ?? ''}
          onChange={(e) => onChange({ ...value, text: e.target.value })}
          rows={3}
          style={{
            width: '100%',
            marginBottom: 12,
            padding: 12,
            borderRadius: 14,
            border: '1.5px solid var(--line)',
            background: 'var(--bg-3)',
            color: 'var(--ink)',
            font: 'inherit',
            resize: 'none',
          }}
        />
      )}

      <button className="btn-primary" type="button" onClick={onConfirm}>
        Confirmă
      </button>
    </div>
  )
}

function KindChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={chipStyle(active)}>
      {label}
    </button>
  )
}

function bumpTemp(value: AttachValue, onChange: (next: AttachValue) => void, delta: number) {
  const current = value.celsius ?? 38
  onChange({ ...value, celsius: Math.round((current + delta) * 10) / 10 })
}

function fmt(d: Date) {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function chipStyle(on: boolean): CSSProperties {
  return {
    padding: '12px 8px',
    borderRadius: 16,
    border: `1.5px solid ${on ? 'var(--accent)' : 'var(--line)'}`,
    background: on ? 'rgba(245,177,74,0.12)' : 'var(--bg-3)',
    color: on ? 'var(--accent)' : 'var(--ink-2)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  }
}

const roundBtn: CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 999,
  border: '1.5px solid var(--line)',
  background: 'var(--bg-3)',
  color: 'var(--ink)',
  fontSize: 24,
  cursor: 'pointer',
}
