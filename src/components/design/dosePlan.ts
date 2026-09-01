import type { Child, Medication, MedicationForm } from '../../types'
import { DEFAULT_MEDICATIONS } from '../../data/medications'
import { calculateDose } from '../../utils/doseCalculation'
import { formNote, inferMedicationForm, shortMedName } from '../../utils/medicationForm'
import { nextDoseFor } from './scheduleAdapter'

function findMed(id: string, catalog: Medication[]): Medication | undefined {
  return catalog.find((m) => m.id === id)
}

/** Minimum cross-drug spacing (ibuprofen ↔ paracetamol alternation policy). */
const MIN_CROSS_DRUG_GAP_MS = 4 * 3600_000

export interface PlannedStep {
  medId: string
  medName: string
  amount: number | 'sub_doza'
  unit: string
  when: Date
  note: string
  form?: MedicationForm
}

export interface Plan {
  now: PlannedStep
  next: PlannedStep
}

/**
 * Decide the alternation rule: ibuprofen/paracetamol, 4h minimum spacing.
 *
 * If `lastMedId` is given, the "now" dose is the *other* of the pair.
 * If not (first treatment), start with Nurofen now.
 *
 * The "next" step time is driven by the schedule engine via nextDoseFor,
 * with a 4h cross-drug spacing floor applied on top.
 */
export function buildPlan({
  child,
  now,
  lastMedId,
  lastAt,
  medications = DEFAULT_MEDICATIONS,
}: {
  child: Child
  now: Date
  lastMedId?: string
  lastAt?: Date
  medications?: Medication[]
}): Plan | null {
  const isIbu = (id?: string) => id === 'nurofen'
  const isPara = (id?: string) => id === 'panadol'

  // Choose "now" medication.
  let nowMedId = 'nurofen'
  if (isIbu(lastMedId)) nowMedId = 'panadol'
  else if (isPara(lastMedId)) nowMedId = 'nurofen'

  const safeLastAt =
    lastAt != null && !Number.isNaN(lastAt.getTime()) ? lastAt : null

  // "Now" step: target time is now, or lastAt + 4h if that is still ahead.
  const nowTarget = safeLastAt
    ? new Date(Math.max(now.getTime(), safeLastAt.getTime() + MIN_CROSS_DRUG_GAP_MS))
    : now

  // "Next" step: alternating med, scheduled by the engine.
  // The 4h cross-drug spacing floor is a hard minimum; the engine-computed
  // safe interval for the same drug (8h nurofen / 8h panadol) may be longer.
  const nextMedId = nowMedId === 'nurofen' ? 'panadol' : 'nurofen'
  const crossDrugFloor = new Date(nowTarget.getTime() + MIN_CROSS_DRUG_GAP_MS)
  const engineNext = nextDoseFor({ medicationId: nextMedId, childId: child.id, now: crossDrugFloor })
  const nextTarget = engineNext != null
    ? new Date(Math.max(engineNext.getTime(), crossDrugFloor.getTime()))
    : crossDrugFloor

  const nowMed = findMed(nowMedId, medications)
  const nextMed = findMed(nextMedId, medications)
  if (!nowMed || !nextMed) return null

  const nowForm = inferMedicationForm(nowMed)

  return {
    now: {
      medId: nowMedId,
      medName: shortMedName(nowMed.name),
      amount: calculateDose(nowMed, child.weight),
      unit: nowMed.doseConfig.unit,
      when: nowTarget,
      note: formNote(nowForm),
      form: nowForm,
    },
    next: {
      medId: nextMedId,
      medName: shortMedName(nextMed.name),
      amount: calculateDose(nextMed, child.weight),
      unit: nextMed.doseConfig.unit,
      when: nextTarget,
      note: 'alternăm, ca să nu suprapunem.',
      form: inferMedicationForm(nextMed),
    },
  }
}

export function fmtHHMM(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function diffHHMM(from: Date, to: Date): string {
  const ms = to.getTime() - from.getTime()
  if (ms <= 0) return '0m'
  const totalMin = Math.round(ms / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}
