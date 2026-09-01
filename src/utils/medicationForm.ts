import type { Medication, MedicationForm } from '../types'

export type { MedicationForm }

export const CORE_PLAN_MED_IDS = ['nurofen', 'panadol'] as const

const DEFAULT_FEVER_IDS = new Set(['nurofen', 'panadol', 'diclofenac', 'novocalmin'])

export function inferMedicationForm(
  med: Pick<Medication, 'form' | 'doseConfig' | 'name'>,
): MedicationForm {
  if (med.form) return med.form
  const unit = med.doseConfig.unit.toLowerCase()
  const name = med.name.toLowerCase()
  if (unit.includes('puf') || name.includes('spray')) return 'spray'
  if (unit.includes('picat')) return 'picaturi'
  if (unit.includes('supoz') || name.includes('supozitor')) return 'supozitor'
  return 'sirop'
}

export function formUnitLabel(form: MedicationForm): string {
  switch (form) {
    case 'picaturi':
      return 'picături'
    case 'spray':
      return 'pufuri'
    case 'supozitor':
      return 'supozitor'
    default:
      return 'ml'
  }
}

export function formNote(form: MedicationForm): string {
  switch (form) {
    case 'picaturi':
      return 'picături'
    case 'spray':
      return 'pufuri'
    case 'supozitor':
      return 'supozitor'
    default:
      return 'sirop · cu seringa'
  }
}

export function isFeverMedication(med: Pick<Medication, 'id' | 'kind'>): boolean {
  if (med.kind) return med.kind === 'fever'
  return DEFAULT_FEVER_IDS.has(med.id)
}

export function isCorePlanMedication(id: string): boolean {
  return (CORE_PLAN_MED_IDS as readonly string[]).includes(id)
}

export function shortMedName(name: string): string {
  return name.split(/[/(]/)[0].trim()
}
