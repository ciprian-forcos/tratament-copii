import { useEffect, useState } from 'react'
import { StatusBar } from './StatusBar'
import { activeChild, useChildren } from './childStore'
import { buildPlan, diffHHMM, fmtHHMM } from './dosePlan'
import { doseStore, useDoses } from './doseStore'
import { alreadyRecorded, lastDoseInEpisode, seedFromStep2 } from './episode'
import { FormPictogram } from './FormPictogram'
import { MedicalDisclaimer } from './MedicalDisclaimer'
import { loadMedications } from './medicineStorage'
import type { Step2Value } from './Step2'


interface Props {
  onBack: () => void
  /** Called when the parent confirms "Am dat doza". */
  onDone: (now: Date) => void
  /** Called when the next dose is still deferred and the parent waits. */
  onWait?: () => void
  step2: Step2Value
}

export function PlanCard({ onBack, onDone, onWait, step2 }: Props) {
  const state = useChildren()
  const child = activeChild(state)
  const doses = useDoses()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const seed = seedFromStep2(step2)
  const last = lastDoseInEpisode({ now, doses, childId: child.id, seed })
  const plan = buildPlan({
    child,
    now,
    lastMedId: last?.medicationId,
    lastAt: last?.at,
    medications: loadMedications(),
  })

  if (!plan) {
    return (
      <div className="phone">
        <StatusBar timeLabel={fmtHHMM(now)} />
        <div style={{ padding: '28px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="eyebrow" style={{ color: 'var(--danger)' }}>
            plan indisponibil
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
            Lipsește Nurofen sau Panadol din Medicamente.
          </h1>
          <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.4 }}>
            Adaugă-le înapoi ca să putem calcula doza. Fără ele, planul de febră nu poate rula.
          </p>
          <button className="btn-secondary" onClick={onBack}>
            ← Înapoi
          </button>
        </div>
      </div>
    )
  }

  const nowStep = plan.now
  const nextStep = plan.next
  const nowAmount =
    nowStep.amount === 'sub_doza' ? 'sub doza' : `${nowStep.amount} ${nowStep.unit}`
  const nextAmount =
    nextStep.amount === 'sub_doza' ? 'sub doza' : `${nextStep.amount} ${nextStep.unit}`
  const canRecordNow = nowStep.when.getTime() <= now.getTime()
  const nowTimingLabel = canRecordNow ? 'acum' : `la ${fmtHHMM(nowStep.when)}`
  const nowRowLabel = canRecordNow ? 'acum' : 'urmează'

  function persistSeed() {
    if (!seed || alreadyRecorded(doseStore.list(), child.id, seed)) return
    doseStore.record({
      childId: child.id,
      medicationId: seed.medicationId,
      scheduledAt: seed.at.toISOString(),
      administeredAt: seed.at.toISOString(),
      source: 'fever',
    })
  }

  function recordDose() {
    if (!canRecordNow) return

    persistSeed()
    const administeredAt = new Date()
    doseStore.record({
      childId: child.id,
      medicationId: nowStep.medId,
      scheduledAt: nowStep.when.toISOString(),
      administeredAt: administeredAt.toISOString(),
      source: 'fever',
    })
    onDone(administeredAt)
  }

  function waitForDose() {
    if (canRecordNow || !onWait) return
    persistSeed()
    onWait()
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
            <FormPictogram form={plan.now.form ?? 'sirop'} />
            <div style={{ flex: 1, minWidth: 0 }}>
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
            <FormPictogram form={plan.next.form ?? 'sirop'} color="var(--ink-2)" />
            <div style={{ flex: 1, minWidth: 0 }}>
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
        <MedicalDisclaimer compact />
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
        {!canRecordNow && onWait && (
          <button className="btn-secondary" onClick={waitForDose}>
            Voi aștepta
          </button>
        )}
        <button className="btn-secondary btn-ghost" onClick={onBack}>
          ← Schimbă ceva
        </button>
      </div>
    </div>
  )
}


