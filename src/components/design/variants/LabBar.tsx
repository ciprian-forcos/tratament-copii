import type { DesignVariant } from './variant'

const OPTIONS: { id: DesignVariant; label: string }[] = [
  { id: 'acum', label: 'Acum' },
  { id: 'edi', label: 'Edi' },
  { id: 'fane', label: 'Fane' },
]

export function LabBar({
  variant,
  onSelect,
  skinsOpen,
  onToggleSkins,
}: {
  variant: DesignVariant
  onSelect: (next: DesignVariant) => void
  skinsOpen: boolean
  onToggleSkins: () => void
}) {

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 20,
        display: 'flex',
        flex: '0 0 auto',
        gap: 6,
        padding: 8,
        background: 'var(--bg-3)',
        borderBottom: '1px solid var(--line)',
        pointerEvents: 'auto',
      }}
    >
      <div role="tablist" aria-label="variante de design" style={{ display: 'flex', flex: 1, gap: 6 }}>
        {OPTIONS.map((opt) => {
          const on = variant === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onSelect(opt.id)}
              style={{
                flex: 1,
                border: '1px solid var(--line)',
                borderRadius: 2,
                minHeight: 44,
                padding: '10px 8px',
                background: on ? 'var(--accent)' : 'var(--bg-3)',
                color: on ? 'var(--on-accent)' : 'var(--ink)',
                font: '600 15px var(--font-body)',
                cursor: 'pointer',
                pointerEvents: 'auto',
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        aria-expanded={skinsOpen}
        aria-controls="skin-list"
        onClick={onToggleSkins}
        style={{
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          border: '1px solid var(--line)',
          borderRadius: 2,
          minHeight: 44,
          padding: '10px 10px',
          background: skinsOpen ? 'var(--bg-2)' : 'var(--bg-3)',
          color: 'var(--ink)',
          font: '600 15px var(--font-body)',
          cursor: 'pointer',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: 'var(--accent)',
            boxShadow: '0 0 0 1px var(--ink-3)',
          }}
        />
        Temă
      </button>
    </div>
  )
}
