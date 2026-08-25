import type { PanicPref } from './panicPref'

const OPTIONS: { id: PanicPref; label: string }[] = [
  { id: 'off', label: 'Calm' },
  { id: 'auto', label: 'Auto' },
  { id: 'on', label: 'Noapte' },
]

export function PanicToggle({
  pref,
  onChange,
}: {
  pref: PanicPref
  onChange: (pref: PanicPref) => void
}) {
  return (
    <div
      role="radiogroup"
      aria-label="mod panică"
      style={{ display: 'inline-flex', gap: 4, padding: 3, borderRadius: 12, border: '1.5px solid var(--line)', background: 'var(--bg-3)' }}
    >
      {OPTIONS.map((opt) => {
        const active = pref === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            style={{
              padding: '5px 10px',
              borderRadius: 9,
              border: 'none',
              background: active ? 'rgba(245,177,74,0.18)' : 'transparent',
              color: active ? 'var(--accent)' : 'var(--ink-3)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
