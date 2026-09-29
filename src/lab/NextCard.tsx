import type { Medication, TimelineMark } from '../types'
import { fmtHHMM } from '../components/design/dosePlan'
import { useGuardedTap } from '../components/design/guardTap'
import { shortName } from '../components/design/timeline/shortName'
import { inferMedicationForm } from '../utils/medicationForm'
import { Amount } from './Amount'
import { Glyph } from './Glyph'
import { countdownWords, ringProgress } from './thread'

const R = 40
const C = 2 * Math.PI * R

/** The one thing that matters at 3am: what, how much, when, and one button. */
export function NextCard({
  mark,
  med,
  amount,
  lastAt,
  now,
  onAmount,
  onGive,
}: {
  mark: TimelineMark
  med: Medication | undefined
  amount: { n: number; unit: string }
  lastAt: Date | null
  now: Date
  onAmount: (n: number) => void
  onGive: () => void
}) {
  const give = useGuardedTap(onGive)
  const name = med ? shortName(med.name) : mark.label
  const progress = ringProgress(now, lastAt, mark.at)
  const due = mark.at.getTime() - now.getTime() < 60_000
  return (
    <section className={`fir-card${due ? ' fir-card--due' : ''}`} role="region" aria-label="urmează">
      <div className="fir-card-row">
        <div className="fir-ring" style={{ ['--med' as string]: med?.color ?? 'var(--accent)' }}>
          <svg viewBox="0 0 96 96" width="100%" height="100%" aria-hidden="true">
            <circle className="fir-ring-track" cx="48" cy="48" r={R} />
            <circle
              className="fir-ring-fill"
              cx="48"
              cy="48"
              r={R}
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              transform="rotate(-90 48 48)"
            />
          </svg>
          <span className="fir-ring-glyph">
            <Glyph name={med ? inferMedicationForm(med) : 'sirop'} size={30} />
          </span>
        </div>
        <div className="fir-card-text">
          <div className="eyebrow">Urmează</div>
          <div className="fir-card-name">{name}</div>
          <div className="fir-card-when">
            <b>{countdownWords(now, mark.at)}</b> · {fmtHHMM(mark.at)}
          </div>
        </div>
        <Amount n={amount.n} unit={amount.unit} onChange={onAmount} />
      </div>
      <button type="button" className="btn-primary fir-give" onClick={give} aria-label={`Am dat ${name} ${amount.n} ${amount.unit}`}>
        Am dat
      </button>
    </section>
  )
}

/** Before any treatment: one tap on what you gave starts the thread. */
export function StartCard({ meds, onGive }: { meds: Medication[]; onGive: (med: Medication) => void }) {
  return (
    <section className="fir-card" role="region" aria-label="începe">
      <div className="eyebrow">Începe</div>
      <div className="fir-card-name">Ce ai dat?</div>
      <div className="fir-start">
        {meds.map((m) => (
          <StartButton key={m.id} med={m} onGive={onGive} />
        ))}
      </div>
    </section>
  )
}

function StartButton({ med, onGive }: { med: Medication; onGive: (med: Medication) => void }) {
  const give = useGuardedTap(() => onGive(med))
  return (
    <button
      type="button"
      className="ui-btn fir-start-btn"
      style={{ ['--med' as string]: med.color }}
      onClick={give}
      aria-label={`Am dat ${shortName(med.name)}`}
    >
      <span className="fir-start-glyph">
        <Glyph name={inferMedicationForm(med)} size={26} />
      </span>
      {shortName(med.name)}
    </button>
  )
}
