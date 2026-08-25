import type { AdministeredDose, Child } from '../../types'

export type NextPlannedDose = {
  at: Date
  med: string
  medId: string
}

/** Stub: real derivation lands in the following feat commit. */
export function nextPlannedDose(_args: {
  child: Child
  now: Date
  doses: AdministeredDose[]
}): NextPlannedDose | null {
  return null
}
