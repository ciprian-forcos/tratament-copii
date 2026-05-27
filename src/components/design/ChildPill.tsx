import { activeChild, ageWords, useChildren } from './childStore'

interface Props {
  onClick: () => void
}

/** 4-segment chip: [initial] · Name · age in words · temperature. */
export function ChildPill({ onClick }: Props) {
  const state = useChildren()
  const child = activeChild(state)
  const temp = child.temp ?? 0
  const fever = temp >= 38

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${child.name}, editează profilul`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0,
        padding: '4px',
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

      <Seg color="var(--ink)">
        <strong style={{ fontWeight: 600 }}>{child.name}</strong>
      </Seg>
      <Sep />
      <Seg>{ageWords(child)}</Seg>
      <Sep />
      <Seg mono color={fever ? 'var(--danger)' : 'var(--ink)'}>
        {Math.floor(temp)}
        <span style={{ color: 'var(--ink-3)' }}>:</span>
        {Math.round((temp - Math.floor(temp)) * 10)}°
      </Seg>

      <span style={{ marginLeft: 4, marginRight: 6, color: 'var(--ink-3)', fontSize: 12 }}>✎</span>
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

function Sep() {
  return (
    <span
      aria-hidden="true"
      style={{ width: 1, height: 14, background: 'var(--line)', flex: '0 0 auto' }}
    />
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
