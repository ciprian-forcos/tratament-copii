import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnalogClock } from './AnalogClock'
import { ChildEditor } from './ChildEditor'
import { ChildPill } from './ChildPill'
import { StatusBar } from './StatusBar'
import { TempWheel } from './TempWheel'
import { activeChild, childStore, useChildren } from './childStore'
import { useDoses } from './doseStore'
import { diffHHMM, fmtHHMM } from './dosePlan'
import {
  estimateTextWidth,
  layoutMarks,
  STRIP_HALF_MS,
  STRIP_SPAN_MS,
} from './layoutMarks'
import { nextPlannedDose } from './nextPlannedDose'
import { isNightWindow } from './panicPref'
import { RemindersButton } from './RemindersButton'
import { TabBar, type TabId } from './TabBar'
import { useNightTimeline } from './useNightTimeline'

interface Props {
  onStart: () => void
  /** Called when the child name chip is tapped. */
  onMenu?: () => void
  tab?: TabId
  onTab?: (id: TabId) => void
  remindersEnabled?: boolean
  onRemindersEnable?: () => boolean | Promise<boolean>
  onRemindersDisable?: () => void
  /** Optional override. When omitted, Home derives the next dose from recorded history. */
  nextDose?: { at: Date; med: string } | null
}

export function HomeB({
  onStart,
  onMenu,
  nextDose,
  tab,
  onTab,
  remindersEnabled,
  onRemindersEnable,
  onRemindersDisable,
}: Props) {
  const state = useChildren()
  const child = activeChild(state)
  const doses = useDoses()
  const temp = child.temp
  const [pickerOpen, setPickerOpen] = useState(false)
  const [childOpen, setChildOpen] = useState(false)

  const setTemp = (v: number) => childStore.patchActive({ temp: v })
  const openPicker = () => setPickerOpen(true)

  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])
  const next = nextDose !== undefined ? nextDose : nextPlannedDose({ child, now, doses })
  const nightEyebrow = isNightWindow(now)
  const nightDoses = useNightTimeline(child.id, now)
  type Mark = { at: Date; med: string; next?: boolean }
  const marks: Mark[] = [
    ...nightDoses.map((d) => ({ at: d.at, med: d.med })),
    ...(next ? [{ at: next.at, med: next.med, next: true }] : []),
  ]

  const stripRef = useRef<HTMLDivElement>(null)
  const [stripW, setStripW] = useState(390)
  useLayoutEffect(() => {
    const el = stripRef.current
    if (!el) return
    const apply = () => {
      const w = el.clientWidth
      if (w > 0) setStripW(w)
    }
    apply()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const stripStart = new Date(now.getTime() - STRIP_HALF_MS)
  const toPct = (d: Date) => ((d.getTime() - stripStart.getTime()) / STRIP_SPAN_MS) * 100
  const laidOut = layoutMarks(marks, {
    widthPx: stripW,
    now,
    measure: estimateTextWidth,
  })
  const nextIsDue = Boolean(next && next.at.getTime() <= now.getTime())
  const markNearNow = marks.some(
    (m) => Math.abs(m.at.getTime() - now.getTime()) <= 40 * 60_000,
  )

  const ctaLabel = !next
    ? 'Începe tratamentul'
    : nextIsDue
      ? 'Deschide planul'
      : `Următoarea doză · ${fmtHHMM(next.at)} →`

  return (
    <div className="phone">
      <StatusBar timeLabel={fmtHHMM(now)} />
      <div
        style={{
          padding: '8px 18px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 8,
          minWidth: 0,
        }}
      >
        <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
          <ChildPill
            onChildClick={() => onMenu?.()}
            onProfileClick={() => setChildOpen(true)}
            onTemperatureClick={openPicker}
          />
        </div>
        {onRemindersEnable && onRemindersDisable && (
          <RemindersButton
            enabled={Boolean(remindersEnabled)}
            onEnable={onRemindersEnable}
            onDisable={onRemindersDisable}
          />
        )}
      </div>

      {next && (
        <div style={{ padding: '18px 18px 0', textAlign: 'center' }}>
          <div className="hand" style={{ fontSize: 26, color: 'var(--accent-2)' }}>
            {next.at.getTime() > now.getTime() ? (
              <>
                mai sunt <span className="underline-hand">{diffHHMM(now, next.at)}</span>
              </>
            ) : (
              <>dă {next.med} acum</>
            )}
          </div>
        </div>
      )}

      <TempWheel
        open={pickerOpen}
        value={temp ?? 37.0}
        onChange={setTemp}
        onClose={() => setPickerOpen(false)}
      />
      <ChildEditor open={childOpen} onClose={() => setChildOpen(false)} />

      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px' }}>
        <AnalogClock
          size={220}
          hour={now.getHours()}
          minute={now.getMinutes()}
          nextHour={next?.at.getHours() ?? null}
          nextMinute={next?.at.getMinutes() ?? null}
        />
      </div>

      <div style={{ padding: '8px 24px 14px', flex: 1 }}>
        {nightEyebrow && (
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            noaptea asta
          </div>
        )}
        <div ref={stripRef} style={{ position: 'relative', height: 100 }}>
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
          <div
            data-testid="now-marker"
            style={{
              position: 'absolute',
              top: 0,
              left: `${toPct(now)}%`,
              transform: 'translateX(-50%)',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            {!nextIsDue && !markNearNow && (
              <div
                aria-hidden="true"
                data-testid="now-cursor"
                style={{
                  position: 'absolute',
                  top: 34,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 2,
                  height: 14,
                  borderRadius: 1,
                  background: 'var(--cool)',
                }}
              />
            )}
            <div
              className="mono"
              style={{
                position: 'absolute',
                top: 82,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: 10,
                color: 'var(--ink)',
                whiteSpace: 'nowrap',
              }}
            >
              acum
            </div>
          </div>
          {laidOut.map((m, i) => (
            <div
              key={i}
              data-testid="strip-mark"
              data-next={m.next ? 'true' : 'false'}
              data-pinned={m.pinned ? 'true' : 'false'}
              style={{
                position: 'absolute',
                top: 14,
                left: m.leftPx,
                width: m.widthPx,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                zIndex: 1,
                overflow: 'hidden',
              }}
            >
              <div
                className={m.next ? 'pulse-dot' : ''}
                style={{
                  width: m.next ? 16 : 10,
                  height: m.next ? 16 : 10,
                  borderRadius: '50%',
                  background: m.next ? 'var(--accent)' : 'var(--cool)',
                  boxShadow: m.next ? '0 0 0 4px rgba(245,177,74,0.18)' : 'none',
                  flex: '0 0 auto',
                }}
              />
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  color: m.next ? 'var(--accent)' : 'var(--ink-3)',
                  whiteSpace: 'nowrap',
                }}
              >
                {m.timeLabel}
              </div>
              <div
                className="hand"
                style={{
                  fontSize: 14,
                  color: m.next ? 'var(--accent-2)' : 'var(--ink-2)',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 18px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn-primary btn-wait" onClick={onStart}>
          {ctaLabel}
        </button>
      </div>
      {onTab && tab && <TabBar current={tab} onSelect={onTab} />}
    </div>
  )
}
