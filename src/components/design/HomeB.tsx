import { useState } from 'react'
import { AnalogClock } from './AnalogClock'
import { ChildEditor } from './ChildEditor'
import { ChildPill, MenuBtn } from './ChildPill'
import { StatusBar } from './StatusBar'
import { TempWheel } from './TempWheel'
import { activeChild, childStore, useChildren } from './childStore'
import { diffHHMM, fmtHHMM } from './dosePlan'
import { useNightTimeline, anchorStrip } from './useNightTimeline'

interface Props {
  onStart: () => void
  /** Called when the ≡ menu button is tapped. */
  onMenu?: () => void
  /** When the next planned dose should land. Falls back to "now + 2h". */
  nextDose?: { at: Date; med: string } | null
}

export function HomeB({ onStart, onMenu, nextDose }: Props) {
  const state = useChildren()
  const child = activeChild(state)
  const temp = child.temp ?? 0
  const [pickerOpen, setPickerOpen] = useState(false)
  const [childOpen, setChildOpen] = useState(false)

  const setTemp = (v: number) => childStore.patchActive({ temp: v })

  const now = new Date()
  const next = nextDose ?? { at: new Date(now.getTime() + 2 * 3600_000), med: 'Panadol' }
  const nightDoses = useNightTimeline(child.id, now)
  type Mark = { at: Date; med: string; next?: boolean }
  const marks: Mark[] = [
    ...nightDoses.map((d) => ({ at: d.at, med: d.med })),
    { at: next.at, med: next.med, next: true },
  ]

  // 12-hour strip anchored at 21:00 → 09:00.
  const stripStart = anchorStrip(now)
  const toPct = (d: Date) => {
    const dt = (d.getTime() - stripStart.getTime()) / (12 * 3600_000)
    return Math.max(0, Math.min(1, dt)) * 100
  }

  return (
    <div className="phone">
      <StatusBar timeLabel={fmtHHMM(now)} />
      <div
        style={{
          padding: '8px 18px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <ChildPill onClick={() => setChildOpen(true)} />
        <MenuBtn onClick={onMenu} />
      </div>

      <div style={{ padding: '18px 18px 0', textAlign: 'center' }}>
        <div className="hand" style={{ fontSize: 26, color: 'var(--accent-2)' }}>
          mai sunt <span className="underline-hand">{diffHHMM(now, next.at)}</span>
        </div>
        <button
          onClick={() => setPickerOpen(true)}
          className="eyebrow"
          style={{
            marginTop: 6,
            background: 'transparent',
            border: 'none',
            color: 'var(--ink-3)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            font: 'inherit',
          }}
        >
          măsoară din nou
          <span style={{ fontSize: 11 }}>✎</span>
        </button>
      </div>

      <TempWheel
        open={pickerOpen}
        value={temp || 37.0}
        onChange={setTemp}
        onClose={() => setPickerOpen(false)}
      />
      <ChildEditor open={childOpen} onClose={() => setChildOpen(false)} />

      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px' }}>
        <AnalogClock
          size={220}
          hour={now.getHours()}
          minute={now.getMinutes()}
          nextHour={next.at.getHours()}
          nextMinute={next.at.getMinutes()}
        />
      </div>

      <div style={{ padding: '8px 24px 14px', flex: 1 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          noaptea asta
        </div>
        <div style={{ position: 'relative', height: 90 }}>
          <svg
            viewBox="0 0 320 70"
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: 70 }}
          >
            <path
              d="M 6 38 Q 80 32 160 40 T 314 36"
              stroke="var(--line)"
              strokeWidth={1.4}
              fill="none"
            />
          </svg>
          {marks.map((m, i) => {
            const isNext = (m as { next?: boolean }).next === true
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: 14,
                  left: `${toPct(m.at)}%`,
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <div
                  className={isNext ? 'pulse-dot' : ''}
                  style={{
                    width: isNext ? 16 : 10,
                    height: isNext ? 16 : 10,
                    borderRadius: '50%',
                    background: isNext ? 'var(--accent)' : 'var(--cool)',
                    boxShadow: isNext ? '0 0 0 4px rgba(245,177,74,0.18)' : 'none',
                  }}
                />
                <div
                  className="mono"
                  style={{ fontSize: 10, color: isNext ? 'var(--accent)' : 'var(--ink-3)' }}
                >
                  {fmtHHMM(m.at)}
                </div>
                <div
                  className="hand"
                  style={{ fontSize: 14, color: isNext ? 'var(--accent-2)' : 'var(--ink-2)' }}
                >
                  {m.med}
                </div>
              </div>
            )
          })}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: `${toPct(now)}%`,
              transform: 'translateX(-50%)',
              color: 'var(--ink)',
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
            }}
          >
            ▼
            <div style={{ marginTop: -2 }}>acum</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 18px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn-primary btn-wait" onClick={onStart}>
          Următoarea doză · {fmtHHMM(next.at)} →
        </button>
      </div>
    </div>
  )
}


