import type { Child, Medication } from '../types'
import { ageWords } from '../components/design/childStore'
import { shortName } from '../components/design/timeline/shortName'
import { inferMedicationForm } from '../utils/medicationForm'
import { Glyph } from './Glyph'

/** Fane's treatment window: what this child takes, and who else can see it. */
export function SettingsSheet({
  child,
  medications,
  onClose,
  onToggle,
  onEditChild,
  onShare,
}: {
  child: Child
  medications: Medication[]
  onClose: () => void
  onToggle: (medicationId: string) => void
  onEditChild: () => void
  onShare: () => void
}) {
  const fever = medications.filter((m) => m.kind === 'fever')
  const program = medications.filter((m) => m.kind !== 'fever')
  return (
    <div className="ui-sheet fir-settings" role="dialog" aria-label="tratament">
      <button type="button" className="ui-grabber" aria-label="închide" onClick={onClose} style={{ marginTop: -12 }} />
      <div className="eyebrow">Tratament</div>
      <button type="button" className="ui-btn fir-settings-child" onClick={onEditChild}>
        <span className="fir-card-name">{child.name}</span>
        <span>
          {child.weight} kg · {ageWords(child)}
        </span>
      </button>

      <div className="fir-settings-body">
        <div className="eyebrow">Febră · după nevoie</div>
        <p className="fir-settings-note">Urmează ce ai dat: Nurofen și Panadol pe rând, cu pauză între ele.</p>
        <div className="fir-settings-list">
          {fever.map((m) => (
            <div key={m.id} className="fir-settings-row" style={{ ['--med' as string]: m.color }}>
              <span className="fir-med-glyph">
                <Glyph name={inferMedicationForm(m)} size={18} />
              </span>
              <span>{shortName(m.name)}</span>
            </div>
          ))}
        </div>

        <div className="eyebrow" style={{ marginTop: 14 }}>
          Program · pe fir
        </div>
        <div className="fir-settings-list">
          {program.map((m) => {
            const on = child.enabledMedications.includes(m.id)
            return (
              <button
                key={m.id}
                type="button"
                role="switch"
                aria-checked={on}
                aria-label={shortName(m.name)}
                className={`fir-settings-row fir-switch${on ? ' is-on' : ''}`}
                style={{ ['--med' as string]: m.color }}
                onClick={() => onToggle(m.id)}
              >
                <span className="fir-med-glyph">
                  <Glyph name={inferMedicationForm(m)} size={18} />
                </span>
                <span>{shortName(m.name)}</span>
                <span className="fir-switch-track" aria-hidden="true">
                  <span className="fir-switch-knob" />
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <button type="button" className="ui-btn fir-share" onClick={onShare}>
        Trimite prin legătură
      </button>
    </div>
  )
}
