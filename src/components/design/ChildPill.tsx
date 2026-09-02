import { activeChild, ageWords, useChildren } from './childStore'

interface Props {
  onChildClick: () => void
  onProfileClick: () => void
  onTemperatureClick: () => void
}

/** Compact home controls for identity/menu, profile details, and temperature. */
export function ChildPill({ onChildClick, onProfileClick, onTemperatureClick }: Props) {
  const state = useChildren()
  const child = activeChild(state)
  const temp = child.temp
  const fever = temp != null && temp >= 38

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        minWidth: 0,
        flexWrap: 'wrap',
      }}
    >
      <button
        type="button"
        onClick={onChildClick}
        aria-label={`copil ${child.name}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 10px 4px 4px',
          borderRadius: 999,
          border: '1.5px solid var(--line)',
          background: 'var(--bg-2)',
          cursor: 'pointer',
          color: 'var(--ink-2)',
          font: 'inherit',
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            background: 'var(--bg-3)',
            border: '1.5px solid var(--line)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-hand)',
            fontSize: 18,
            color: 'var(--ink)',
            flex: '0 0 auto',
          }}
        >
          {child.initial ?? child.name.trim()[0]?.toUpperCase() ?? '?'}
        </span>
        <strong style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 13 }}>{child.name}</strong>
      </button>

      <ChipButton onClick={onProfileClick} ariaLabel={`profil ${child.name}`}>
        {ageWords(child)}
      </ChipButton>

      <ChipButton onClick={onTemperatureClick} ariaLabel={`temperatura ${child.name}`}>
        <span style={{ color: 'var(--ink-3)', fontFamily: 'var(--font-body)' }}>Temperatura</span>
        <span style={{ color: fever ? 'var(--danger)' : 'var(--ink)' }} className="mono">
          {temp != null ? `${temp.toFixed(1)}°` : '—'}
        </span>
      </ChipButton>
    </div>
  )
}

function ChipButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode
  onClick: () => void
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px',
        borderRadius: 999,
        border: '1.5px solid var(--line)',
        background: 'var(--bg-2)',
        cursor: 'pointer',
        color: 'var(--ink-2)',
        font: 'inherit',
      }}
    >
      <Seg>{children}</Seg>
    </button>
  )
}

function Seg({
  children,
  color,
  mono,
}: {
  children: React.ReactNode
  color?: string
  mono?: boolean
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '0 8px',
        height: 22,
        color: color || 'var(--ink-2)',
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
        fontSize: 12,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

export function MenuBtn({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="meniu"
      style={{
        background: 'transparent',
        border: '1.5px solid var(--line)',
        width: 38,
        height: 38,
        borderRadius: 12,
        color: 'var(--ink-2)',
        cursor: 'pointer',
        fontSize: 18,
      }}
    >
      ≡
    </button>
  )
}
