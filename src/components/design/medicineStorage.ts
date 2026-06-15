import { DEFAULT_MEDICATIONS } from '../../data/medications'
import type { Medication } from '../../types'

export const MEDICATIONS_KEY = 'tratament-copii-medications'
export const MEDICATIONS_CHANGED_EVENT = 'tratament-copii-medications-changed'

export function loadMedications(): Medication[] {
  try {
    const raw = window.localStorage.getItem(MEDICATIONS_KEY)
    if (!raw) return DEFAULT_MEDICATIONS
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Medication[]) : DEFAULT_MEDICATIONS
  } catch {
    return DEFAULT_MEDICATIONS
  }
}

export function saveMedications(medications: Medication[]) {
  try {
    window.localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(medications))
  } catch {
    /* storage quota - ignore */
  }
}

export function notifyMedicationsChanged() {
  window.dispatchEvent(new Event(MEDICATIONS_CHANGED_EVENT))
}

export function customMedicationsForShare(): Medication[] | undefined {
  const medications = loadMedications()
  return JSON.stringify(medications) === JSON.stringify(DEFAULT_MEDICATIONS)
    ? undefined
    : medications
}
