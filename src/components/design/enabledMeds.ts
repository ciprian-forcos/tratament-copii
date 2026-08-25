import type { Child, Medication } from '../../types'

export function enabledMedicationIds(child: Child, medications: Medication[]): string[] {
  if (child.enabledMedications.length === 0) return []
  const known = new Set(medications.map((m) => m.id))
  return child.enabledMedications.filter((id) => known.has(id))
}

export function toggleEnabledMedication(child: Child, medicationId: string): string[] {
  const current = child.enabledMedications
  return current.includes(medicationId)
    ? current.filter((id) => id !== medicationId)
    : [...current, medicationId]
}
