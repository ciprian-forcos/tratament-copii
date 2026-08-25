import type { Medication, ScheduleRule } from '../../types'

export const RULE_TYPE_LABELS: Record<ScheduleRule['type'], string> = {
  every_n_hours: 'La fiecare N ore',
  after_medication: 'La N ore după',
  once_per_day: 'O dată pe zi',
  times_per_day: 'De N ori pe zi',
}

export interface RuleFormState {
  type: ScheduleRule['type']
  medicationId: string
  everyNHours: string
  isStartRule: boolean
  afterMedicationId: string
  hoursAfter: string
  timesPerDay: string
}

export function emptyRuleForm(medications: Medication[]): RuleFormState {
  return {
    type: 'every_n_hours',
    medicationId: medications[0]?.id ?? '',
    everyNHours: '8',
    isStartRule: false,
    afterMedicationId: medications[0]?.id ?? '',
    hoursAfter: '4',
    timesPerDay: '2',
  }
}

export function ruleToForm(rule: ScheduleRule): RuleFormState {
  const base = emptyRuleForm([{ id: rule.medicationId } as Medication])
  base.type = rule.type
  base.medicationId = rule.medicationId
  if (rule.type === 'every_n_hours') {
    base.everyNHours = String(rule.everyNHours)
    base.isStartRule = rule.isStartRule ?? false
  } else if (rule.type === 'after_medication') {
    base.afterMedicationId = rule.afterMedicationId
    base.hoursAfter = String(rule.hoursAfter)
  } else if (rule.type === 'times_per_day') {
    base.timesPerDay = String(rule.timesPerDay)
  }
  return base
}

export function formToRule(form: RuleFormState, id: string): ScheduleRule {
  if (form.type === 'every_n_hours') {
    return {
      id,
      type: 'every_n_hours',
      medicationId: form.medicationId,
      everyNHours: Math.max(1, Number(form.everyNHours) || 8),
      isStartRule: form.isStartRule,
    }
  }
  if (form.type === 'after_medication') {
    return {
      id,
      type: 'after_medication',
      medicationId: form.medicationId,
      afterMedicationId: form.afterMedicationId,
      hoursAfter: Math.max(0, Number(form.hoursAfter) || 4),
    }
  }
  if (form.type === 'times_per_day') {
    return {
      id,
      type: 'times_per_day',
      medicationId: form.medicationId,
      timesPerDay: Math.max(1, Number(form.timesPerDay) || 2),
    }
  }
  return {
    id,
    type: 'once_per_day',
    medicationId: form.medicationId,
  }
}

export function describeRule(rule: ScheduleRule, medMap: Map<string, Medication>): string {
  const med = medMap.get(rule.medicationId)?.name ?? rule.medicationId
  if (rule.type === 'every_n_hours') {
    return `${med} — la fiecare ${rule.everyNHours}h${rule.isStartRule ? ' (start)' : ''}`
  }
  if (rule.type === 'after_medication') {
    const ref = medMap.get(rule.afterMedicationId)?.name ?? rule.afterMedicationId
    return `${med} — la ${rule.hoursAfter}h după ${ref}`
  }
  if (rule.type === 'once_per_day') return `${med} — o dată pe zi`
  if (rule.type === 'times_per_day') return `${med} — de ${rule.timesPerDay}x/zi`
  return med
}

export function newRuleId(): string {
  return 'r' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 5)
}
