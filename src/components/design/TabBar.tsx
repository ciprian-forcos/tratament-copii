export type TabId = 'program' | 'fever' | 'children' | 'medicines'

const TABS: { id: TabId; label: string }[] = [
  { id: 'program', label: 'Program' },
  { id: 'fever', label: 'Febră' },
  { id: 'children', label: 'Copii' },
  { id: 'medicines', label: 'Meds' },
]

export function TabBar({
  current,
  onSelect,
}: {
  current: TabId
  onSelect: (id: TabId) => void
}) {
  return (
    <nav
      aria-label="navigare"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 6,
        padding: '8px 10px 12px',
        borderTop: '1.5px solid var(--line)',
        background: 'var(--bg-2)',
      }}
    >
      {TABS.map((tab) => {
        const active = tab.id === current
        return (
          <button
            key={tab.id}
            type="button"
            aria-current={active ? 'page' : undefined}
            onClick={() => onSelect(tab.id)}
            style={{
              padding: '10px 4px',
              borderRadius: 12,
              border: `1.5px solid ${active ? 'var(--accent)' : 'var(--line)'}`,
              background: active ? 'rgba(245,177,74,0.12)' : 'var(--bg-3)',
              color: active ? 'var(--accent)' : 'var(--ink-2)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
