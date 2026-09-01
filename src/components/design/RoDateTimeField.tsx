import { formatRoDateTime, parseDatetimeLocal } from '../../utils/formatRo'

export function RoDateTimeField({
  label,
  value,
  onChange,
  ariaLabel,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  ariaLabel: string
}) {
  const parsed = parseDatetimeLocal(value.slice(0, 16))
  const display = parsed ? formatRoDateTime(parsed) : '—'

  return (
    <label style={{ display: 'block' }}>
      <span className="field-label">{label}</span>
      <span className="mono" style={{ display: 'block', fontSize: 15, color: 'var(--ink)', margin: '4px 0 8px' }}>
        {display}
      </span>
      <input
        aria-label={ariaLabel}
        type="datetime-local"
        lang="ro"
        value={value.slice(0, 16)}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '12px 14px',
          borderRadius: 12,
          border: '1.5px solid var(--line)',
          background: 'var(--bg-2)',
          color: 'var(--ink)',
          font: 'inherit',
          colorScheme: 'dark',
        }}
      />
    </label>
  )
}
