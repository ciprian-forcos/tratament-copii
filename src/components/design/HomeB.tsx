import { useEffect, useRef, useState } from 'react'
import { AnalogClock } from './AnalogClock'
import { ChildEditor } from './ChildEditor'
import { ChildPill } from './ChildPill'
import { StatusBar } from './StatusBar'
import { TempWheel } from './TempWheel'
import { activeChild, childStore, useChildren } from './childStore'
import { useDoses } from './doseStore'
import { diffHHMM, fmtHHMM } from './dosePlan'
import { nextPlannedDose } from './nextPlannedDose'
import { isNightWindow } from './panicPref'
import { RemindersButton } from './RemindersButton'
import { TabBar, type TabId } from './TabBar'
import { useNightTimeline } from './useNightTimeline'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
}

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
  const installPrompt = useRef<BeforeInstallPromptEvent | null>(null)
  const [manualInstallOpen, setManualInstallOpen] = useState(false)
  const [standalone, setStandalone] = useState(isStandaloneDisplay)

  const setTemp = (v: number) => childStore.patchActive({ temp: v })
  const openPicker = () => setPickerOpen(true)

  useEffect(() => {
    setStandalone(isStandaloneDisplay())
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      installPrompt.current = event as BeforeInstallPromptEvent
      setManualInstallOpen(false)
    }
    const onInstalled = () => {
      setStandalone(true)
      installPrompt.current = null
      setManualInstallOpen(false)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  function handleInstall() {
    if (installPrompt.current) {
      const prompt = installPrompt.current
      installPrompt.current = null
      void prompt.prompt()
      return
    }
    setManualInstallOpen((open) => !open)
  }

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

  // Keep the useful 12-hour span, but frame the current moment in the center.
  const stripStart = new Date(now.getTime() - 6 * 3600_000)
  const toPct = (d: Date) => {
    const dt = (d.getTime() - stripStart.getTime()) / (12 * 3600_000)
    return Math.max(0, Math.min(1, dt)) * 100
  }
  const nextIsDue = Boolean(next && next.at.getTime() <= now.getTime())
  // HH:MM labels share the tick's y-band; hide it when a mark is within ~40 min.
  const markNearNow = marks.some(
    (m) => Math.abs(m.at.getTime() - now.getTime()) <= 40 * 60_000,
  )

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
        <div style={{ position: 'relative', height: 100 }}>
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
                  zIndex: 1,
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
        </div>
      </div>

      <div style={{ padding: '0 18px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {!standalone && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              type="button"
              onClick={handleInstall}
              style={{
                padding: '11px 13px',
                borderRadius: 14,
                border: '1.5px solid var(--line)',
                background: 'var(--bg-3)',
                color: 'var(--ink-2)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Instalează aplicația
            </button>
            {manualInstallOpen && (
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: '1.5px dashed var(--line)',
                  background: 'var(--bg-2)',
                  color: 'var(--ink-3)',
                  fontSize: 13,
                  lineHeight: 1.35,
                }}
              >
                Adaugă pe ecranul principal din meniul browserului.
              </div>
            )}
          </div>
        )}
        <button className="btn-primary btn-wait" onClick={onStart}>
          {next ? `Următoarea doză · ${fmtHHMM(next.at)} →` : 'Începe tratamentul'}
        </button>
      </div>
      {onTab && tab && <TabBar current={tab} onSelect={onTab} />}
    </div>
  )
}

function isStandaloneDisplay() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}
