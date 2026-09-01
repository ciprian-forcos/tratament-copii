import { Droplets, Pill, SprayCan, Syringe } from 'lucide-react'
import type { MedicationForm } from '../../utils/medicationForm'
import { formUnitLabel } from '../../utils/medicationForm'

const ICONS: Record<MedicationForm, typeof Syringe> = {
  sirop: Syringe,
  picaturi: Droplets,
  spray: SprayCan,
  supozitor: Pill,
}

export function FormPictogram({
  form,
  size = 18,
  color = 'var(--accent)',
}: {
  form: MedicationForm
  size?: number
  color?: string
}) {
  const Icon = ICONS[form]
  return (
    <span
      aria-label={formUnitLabel(form)}
      title={formUnitLabel(form)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size + 14,
        height: size + 14,
        borderRadius: 12,
        border: '1.5px solid var(--line)',
        background: 'var(--bg-3)',
        color,
        flex: '0 0 auto',
      }}
    >
      <Icon size={size} strokeWidth={2} aria-hidden="true" />
    </span>
  )
}
