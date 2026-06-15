import { useEffect, useState } from 'react'
import { StatusBar } from './StatusBar'
import { activeChild, useChildren } from './childStore'
import { buildPlan, diffHHMM, fmtHHMM } from './dosePlan'
import { doseStore } from './doseStore'
import type { Step2Value } from './Step2'

interface Props {
  onBack: () => void
  /** Called when the parent confirms "Am dat doza". */
  onDone: (now: Date) => void
  step2: Step2Value
}

export function PlanCard({ onBack, onDone, step2 }: Props) {
  const state = useChildren()
  const child = activeChild(state)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const plan = buildPlan({
    child,
    now,
    lastMedId: step2.kind === 'last' ? step2.med : undefined,
    lastAt: step2.kind === 'last' && step2.lastAt ? new Date(step2.lastAt) : undefined,
  })

  const nowAmount =
    plan.now.amount === 'sub_doza' ? 'sub doza' : `${plan.now.amount} ${plan.now.unit}`
  const nextAmount =
    plan.next.amount === 'sub_doza' ? 'sub doza' : `${plan.next.amount} ${plan.next.unit}`
  const canRecordNow = plan.now.when.getTime() <= now.getTime()
  const nowTimingLabel = canRecordNow ? 'acum' : `la ${fmtHHMM(plan.now.when)}`
  const nowRowLabel = canRecordNow ? 'acum' : 'urmează'

  function recordDose() {
    if (!canRecordNow) return

    const administeredAt = new Date()
    doseStore.record({
      childId: child.id,
      medicationId: plan.now.medId,
      scheduledAt: plan.now.when.toISOString(),
      administeredAt: administeredAt.toISOString(),
    })
    onDone(administeredAt)
  }

  return (
    <div className="phone">
      <StatusBar timeLabel={fmtHHMM(now)} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px 0',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--ink-2)',
            fontSize: 22,
            cursor: 'pointer',
            padding: '8px 10px',
          }}
        >
          ←
        </button>
        <div className="progress" style={{ flex: 1 }}>
          <span className="done" />
          <span className="done" />
          <span className="active" />
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ padding: '20px 22px 0' }}>
        <div className="eyebrow" style={{ color: 'var(--safe)' }}>
          plan generat · acum
        </div>
        <h1
          style={{
            fontSize: 30,
            lineHeight: 1.08,
            fontWeight: 700,
            letterSpacing: 0,
            margin: '6px 0 6px',
            color: 'var(--ink)',
          }}
        >
          Dă <span style={{ color: 'var(--accent)' }}>{plan.now.medName} {nowAmount}</span>{' '}
          {nowTimingLabel}.
        </h1>
        <div className="hand" style={{ fontSize: 22, color: 'var(--ink-2)' }}>
          atât, nimic altceva.
        </div>
      </div>

      <div style={{ padding: '18px 22px 0' }}>
        <div
          style={{
            padding: '20px 22px',
            background: 'var(--bg-2)',
            border: '1.5px solid var(--line)',
            borderRadius: 22,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <NumberBubble n={1} highlight />
            <div style={{ flex: 1 }}>
              <div className="eyebrow" style={{ color: 'var(--accent)' }}>
                {nowRowLabel} · {fmtHHMM(plan.now.when)}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginTop: 2 }}>
                {plan.now.medName} — <span className="mono">{nowAmount}</span>
              </div>
              <div className="hand" style={{ fontSize: 18, color: 'var(--ink-2)', marginTop: 2 }}>
                {plan.now.note}
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1.5px dashed var(--line)' }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <NumberBubble n={2} />
            <div style={{ flex: 1 }}>
              <div className="eyebrow">
                apoi · {fmtHHMM(plan.next.when)} (în {diffHHMM(now, plan.next.when)})
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>
                {plan.next.medName} — <span className="mono">{nextAmount}</span>
              </div>
              <div className="hand" style={{ fontSize: 18, color: 'var(--ink-2)', marginTop: 2 }}>
                {plan.next.note}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div
        style={{
          padding: '16px 18px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <button
          className="btn-primary"
          disabled={!canRecordNow}
          style={!canRecordNow ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
          onClick={recordDose}
        >
          Am dat doza <span className="arrow">✓</span>
        </button>
        <button className="btn-secondary btn-ghost" onClick={onBack}>
          ← Schimbă ceva
        </button>
      </div>
    </div>
  )
}

function NumberBubble({ n, highlight }: { n: number; highlight?: boolean }) {
  return (
    <div
      style={{
        flex: '0 0 auto',
        width: 44,
        height: 44,
        borderRadius: 14,
        border: '1.5px solid ' + (highlight ? 'var(--accent)' : 'var(--line)'),
        background: highlight ? 'rgba(245,177,74,0.12)' : 'var(--bg-3)',
        color: highlight ? 'var(--accent)' : 'var(--ink-2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: 16,
        fontWeight: 600,
      }}
    >
      {n}
    </div>
  )
}
