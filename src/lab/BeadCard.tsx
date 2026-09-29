import type { Medication, TimelineFact } from '../types'
import { fmtHHMM } from '../components/design/dosePlan'
import { useGuardedTap } from '../components/design/guardTap'
import { shortName } from '../components/design/timeline/shortName'
import { dayTickLabel } from '../components/design/variants/fane'
import { inferMedicationForm } from '../utils/medicationForm'
import { NOTE_PRESETS } from './AddSheet'
import { heatFor } from './dial'
import { Glyph, type GlyphName } from './Glyph'
import type { BeadSelection } from './Thread'
import { countdownWords } from './thread'

function when(at: Date, now: Date) {
  const sameDay = at.toDateString() === now.toDateString()
  return `${sameDay ? '' : dayTickLabel(at) + ', '}${fmtHHMM(at)}`
}

/** Tap any bead: what it was, when, and the one thing you can do with it. */
export function BeadCard({
  bead,
  facts,
  medications,
  now,
  onClose,
  onDelete,
  onGiveNow,
}: {
  bead: BeadSelection
  facts: TimelineFact[]
  medications: Medication[]
  now: Date
  onClose: () => void
  onDelete: (fact: TimelineFact) => void
  onGiveNow: (medicationId: string, amountLabel?: string) => void
}) {
  const fact =
    bead.kind === 'fact' ? bead.fact : bead.mark.factId ? facts.find((f) => f.id === bead.mark.factId) : undefined
  const planned = bead.kind === 'dose' && bead.mark.source === 'projected'
  const med = bead.kind === 'dose' ? medications.find((m) => m.id === bead.mark.medicationId) : undefined
  const giveNow = useGuardedTap(() => {
    if (bead.kind === 'dose') onGiveNow(bead.mark.medicationId, bead.mark.amount)
  })

  let glyph: GlyphName = 'nota'
  let title = ''
  let detail = ''
  let tone: string | undefined
  if (bead.kind === 'dose') {
    glyph = med ? inferMedicationForm(med) : 'sirop'
    title = med ? shortName(med.name) : bead.mark.label
    const amount =
      fact?.payload.kind === 'dose' && fact.payload.amount != null
        ? `${String(fact.payload.amount).replace('.', ',')} ${fact.payload.unit ?? ''}`.trim()
        : bead.mark.amount
    detail = planned
      ? `Planificat ${when(bead.mark.at, now)} · ${countdownWords(now, bead.mark.at)}${amount ? ` · ${amount}` : ''}`
      : `Dat ${when(bead.mark.at, now)}${amount ? ` · ${amount}` : ''}`
    tone = med?.color
  } else if (bead.fact.payload.kind === 'temperature') {
    const c = bead.fact.payload.celsius
    glyph = 'temperatura'
    title = `${c.toFixed(1).replace('.', ',')}°`
    detail = `Măsurat ${when(new Date(bead.fact.at), now)}`
    tone = heatFor(c) === 'normal' ? 'var(--safe)' : 'var(--danger)'
  } else if (bead.fact.payload.kind === 'note') {
    const text = bead.fact.payload.text
    glyph = NOTE_PRESETS.find((p) => p.text === text)?.glyph ?? 'nota'
    title = text
    detail = when(new Date(bead.fact.at), now)
  }

  return (
    <div className="ui-sheet fir-bead-card" role="dialog" aria-label="eveniment">
      <button type="button" className="ui-grabber" aria-label="închide" onClick={onClose} style={{ marginTop: -12 }} />
      <div className="fir-bead-card-row">
        <span
          className={`fir-bead-card-glyph${planned ? ' is-planned' : ''}`}
          style={{ ['--med' as string]: tone ?? 'var(--accent)' }}
        >
          <Glyph name={glyph} size={28} />
        </span>
        <div>
          <div className="fir-card-name">{title}</div>
          <div className="fir-card-when">{detail}</div>
        </div>
      </div>
      <div className="fir-bead-card-actions">
        {planned && (
          <button type="button" className="btn-primary" onClick={giveNow} aria-label={`Am dat acum ${title}`}>
            Am dat acum
          </button>
        )}
        {fact && (
          <button type="button" className="ui-btn fir-delete" onClick={() => onDelete(fact)}>
            <Glyph name="sterge" size={20} />
            Șterge
          </button>
        )}
      </div>
    </div>
  )
}
