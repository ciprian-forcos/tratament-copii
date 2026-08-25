import { activeChild, ageWords, childStore, useChildren } from './childStore'

interface Props {
  open: boolean
  onClose: () => void
}

export function ChildEditor({ open, onClose }: Props) {
  const state = useChildren()
  if (!open) return null

  const active = activeChild(state)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxHeight: '90%',
          overflowY: 'auto',
          background: 'var(--bg-2)',
          borderTop: '1.5px solid var(--line)',
          borderRadius: '20px 20px 0 0',
          padding: '14px 18px 18px',
          color: 'var(--ink)',
          boxShadow: '0 -20px 40px rgba(0,0,0,0.45)',
        }}
      >
        <div
          style={{
            width: 38,
            height: 4,
            borderRadius: 4,
            background: 'var(--line)',
            margin: '0 auto 12px',
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 12,
          }}
        >
          <div>
            <div className="eyebrow" style={{ color: 'var(--accent)' }}>
              profil copil
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>{active.name}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--ink-3)',
              fontSize: 24,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        <div className="field-label">copii salvaţi</div>
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 16,
            overflowX: 'auto',
            paddingBottom: 2,
          }}
        >
          {state.children.map((c) => (
            <button
              key={c.id}
              onClick={() => childStore.setActive(c.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px 8px 6px',
                borderRadius: 999,
                border: '1.5px solid ' + (c.id === state.activeId ? 'var(--accent)' : 'var(--line)'),
                background: c.id === state.activeId ? 'rgba(245,177,74,0.10)' : 'var(--bg-3)',
                color: 'var(--ink)',
                cursor: 'pointer',
                flex: '0 0 auto',
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  background: 'var(--bg-2)',
                  border: '1.5px solid var(--line)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-hand)',
                  fontSize: 16,
                  color: c.id === state.activeId ? 'var(--accent)' : 'var(--ink-2)',
                }}
              >
                {c.initial ?? c.name.trim()[0]?.toUpperCase() ?? '?'}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                {ageWords(c)}
              </span>
            </button>
          ))}
          <button
            onClick={() => childStore.add()}
            style={{
              flex: '0 0 auto',
              padding: '8px 14px',
              borderRadius: 999,
              border: '1.5px dashed var(--line)',
              background: 'transparent',
              color: 'var(--ink-2)',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            + adaugă
          </button>
        </div>

        <div className="field-label">nume</div>
        <input
          value={active.name}
          onChange={(e) =>
            childStore.patchActive({
              name: e.target.value,
              initial: (e.target.value.trim()[0] || '?').toUpperCase(),
            })
          }
          placeholder="Nume copil"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '14px 16px',
            borderRadius: 14,
            border: '1.5px solid var(--line)',
            background: 'var(--bg-3)',
            color: 'var(--ink)',
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 12,
            outline: 'none',
            fontFamily: 'var(--font-body)',
          }}
        />

        <div className="field-label">vârstă</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <Stepper
            label="ani"
            value={active.years ?? 0}
            min={0}
            max={18}
            onChange={(v) => childStore.patchActive({ years: v })}
            format={(v) => `${v} ${v === 1 ? 'an' : 'ani'}`}
          />
          <Stepper
            label="luni"
            value={active.months ?? 0}
            min={0}
            max={11}
            onChange={(v) => childStore.patchActive({ months: v })}
            format={(v) => `${v} ${v === 1 ? 'lună' : 'luni'}`}
          />
        </div>

        <div className="field-label">greutate</div>
        <Stepper
          label="kilograme"
          value={active.weight}
          min={2}
          max={80}
          step={0.5}
          onChange={(v) => childStore.patchActive({ weight: v })}
          format={(v) => `${v.toFixed(1)} kg`}
        />

        <div className="field-label" style={{ marginTop: 12 }}>
          înălțime (opțional)
        </div>
        <Stepper
          label="centimetri"
          value={active.height ?? 0}
          min={0}
          max={180}
          step={1}
          onChange={(v) => childStore.patchActive({ height: v || undefined })}
          format={(v) => (v === 0 ? 'necompletat' : `${v} cm`)}
        />

        <div
          style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: '1.5px dashed var(--line)',
            display: 'flex',
            gap: 10,
          }}
        >
          <button
            onClick={() => childStore.remove(active.id)}
            disabled={state.children.length <= 1}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 12,
              border: '1.5px solid var(--line)',
              background: 'transparent',
              color: state.children.length <= 1 ? 'var(--ink-3)' : 'var(--danger)',
              fontSize: 13,
              cursor: state.children.length <= 1 ? 'not-allowed' : 'pointer',
              opacity: state.children.length <= 1 ? 0.5 : 1,
            }}
          >
            Şterge profilul
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 2,
              padding: '14px',
              borderRadius: 12,
              border: '1.5px solid var(--accent)',
              background: 'var(--accent)',
              color: '#1a1207',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Gata
          </button>
        </div>
      </div>
    </div>
  )
}

function Stepper({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  format = (v: number) => String(v),
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  format?: (v: number) => string
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        padding: '12px 14px',
        border: '1.5px solid var(--line)',
        borderRadius: 14,
        background: 'var(--bg-3)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span className="eyebrow">{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: 'var(--ink)', marginTop: 2 }}>
          {format(value)}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => onChange(Math.max(min, +(value - step).toFixed(2)))}
          aria-label="minus"
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            border: '1.5px solid var(--line)',
            background: 'var(--bg-2)',
            color: 'var(--ink)',
            fontSize: 22,
            cursor: 'pointer',
          }}
        >
          −
        </button>
        <button
          onClick={() => onChange(Math.min(max, +(value + step).toFixed(2)))}
          aria-label="plus"
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            border: '1.5px solid var(--accent)',
            background: 'rgba(245,177,74,0.08)',
            color: 'var(--accent)',
            fontSize: 22,
            cursor: 'pointer',
          }}
        >
          +
        </button>
      </div>
    </div>
  )
}
