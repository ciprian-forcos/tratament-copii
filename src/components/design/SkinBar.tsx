import { SKINS, type SkinId } from './skins'

export function SkinBar({
  skin,
  onSelect,
}: {
  skin: SkinId
  onSelect: (id: SkinId) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="teme"
      style={{
        display: 'flex',
        gap: 6,
        overflowX: 'auto',
        padding: '6px 8px',
        background: 'var(--bg-2)',
        borderBottom: '1px solid var(--line)',
        flex: '0 0 auto',
      }}
    >
      {SKINS.map((item) => {
        const on = item.id === skin
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onSelect(item.id)}
            style={{
              flex: '0 0 auto',
              border: '1px solid var(--line)',
              borderRadius: 2,
              minHeight: 36,
              padding: '6px 10px',
              background: on ? 'var(--accent)' : 'var(--bg-3)',
              color: on ? 'var(--on-accent)' : 'var(--ink)',
              font: '600 13px var(--font-body)',
              cursor: 'pointer',
            }}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
