import type { Medication } from '../../../types'

/** Text before the first '/' or '(' — "Nurofen/Algin (...)" → "Nurofen". */
export function shortName(name: string): string {
  const match = name.match(/^([^/(]+)/)
  return match ? match[1].trim() : name.trim()
}

export function shortNameFor(medId: string, medications: Medication[]): string {
  const med = medications.find((m) => m.id === medId)
  return med ? shortName(med.name) : medId
}
