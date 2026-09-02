import { useEffect, useState } from 'react'
import { fmtHHMM } from './dosePlan'

interface Props {
  /** Optional centered eyebrow text (e.g. "VARIANT B · LINIE TIMP"). */
  stripe?: string
  /** Override the displayed time. Default: live current time, ticking every 30s. */
  timeLabel?: string
}

export function StatusBar({ stripe, timeLabel }: Props) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    if (timeLabel != null) return
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [timeLabel])

  return (
    <div className="statusbar">
      <span>{timeLabel ?? fmtHHMM(now)}</span>
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
    </div>
  )
}
