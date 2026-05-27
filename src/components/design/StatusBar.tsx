interface Props {
  /** Optional centered eyebrow text (e.g. "VARIANT B · LINIE TIMP"). */
  stripe?: string
  /** Override the displayed time. Default: live current time. */
  timeLabel?: string
}

export function StatusBar({ stripe, timeLabel }: Props) {
  return (
    <div className="statusbar">
      <span>{timeLabel ?? formatNow()}</span>
      {stripe && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--ink-3)',
            letterSpacing: '0.12em',
          }}
        >
          {stripe}
        </span>
      )}
      <div className="right">
        <span style={{ fontSize: 11 }}>●●●</span>
        <span style={{ fontSize: 11 }}>📶</span>
        <span className="battery" />
      </div>
    </div>
  )
}

function formatNow(): string {
  const d = new Date()
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}
