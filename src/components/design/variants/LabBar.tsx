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
      className="ui-bar"
      style={{
        position: 'relative',
        zIndex: 20,
        display: 'flex',
        flex: '0 0 auto',
        gap: 6,
        padding: 8,
      }}
    >
      <div role="tablist" aria-label="variante de design" style={{ display: 'flex', flex: 1, gap: 6 }}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            role="tab"
            className="ui-btn"
            aria-selected={variant === opt.id}
            onClick={() => onSelect(opt.id)}
            style={{ flex: 1, minHeight: 44, padding: '10px 8px', fontSize: 15 }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="ui-btn"
        aria-expanded={skinsOpen}
        aria-controls="skin-list"
        onClick={onToggleSkins}
        style={{
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          minHeight: 44,
          padding: '10px 12px',
          fontSize: 15,
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
