import type { DesignVariant } from './variant'

const OPTIONS: { id: DesignVariant; label: string }[] = [
  { id: 'acum', label: 'Acum' },
  { id: 'edi', label: 'Edi' },
  { id: 'fane', label: 'Fane' },
  { id: 'lab', label: 'Lab' },
  { id: 'grafic', label: 'Grafic' },
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
      <div role="tablist" aria-label="variante de design" style={{ display: 'flex', flex: 1, minWidth: 0, gap: 4 }}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            role="tab"
            className="ui-btn"
            aria-selected={variant === opt.id}
            onClick={() => onSelect(opt.id)}
            style={{ flex: 1, minWidth: 0, minHeight: 44, padding: '10px 2px', fontSize: 14 }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="ui-btn"
        aria-label="Temă"
        aria-expanded={skinsOpen}
        aria-controls="skin-list"
        onClick={onToggleSkins}
        style={{
          flex: '0 0 auto',
          display: 'grid',
          placeItems: 'center',
          width: 44,
          minHeight: 44,
          padding: 0,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'conic-gradient(var(--accent) 0 50%, var(--ink) 50% 75%, var(--bg-2) 75%)',
            boxShadow: '0 0 0 1.5px var(--ink-3)',
          }}
        />
      </button>
    </div>
  )
}
