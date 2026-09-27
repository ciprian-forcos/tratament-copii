import type { DesignVariant } from './variant'

const OPTIONS: { id: DesignVariant; label: string }[] = [
  { id: 'acum', label: 'Acum' },
  { id: 'edi', label: 'Edi' },
  { id: 'fane', label: 'Fane' },
]

export function LabBar({
  variant,
  onSelect,
}: {
  variant: DesignVariant
  onSelect: (next: DesignVariant) => void
}) {

  return (
    <div
      role="tablist"
      aria-label="variante de design"
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
  )
}
