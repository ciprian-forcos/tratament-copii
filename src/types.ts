// Dose configuration variants

export interface WeightDividedConfig {
  type: 'weight_divided'
  divisor: number
  offset: number
  unit: string
}

export interface MgPerKgConfig {
  type: 'mg_per_kg'
  mgPerKgPerDay: number
  dosesPerDay: number
  concentrationMg: number
  unit: string
  maxDailyMg?: number
  roundTo: 'whole' | 'half' | 'quarter'
}

export interface FixedConfig {
  type: 'fixed'
  amount: string
  unit: string
}

export interface WeightThresholdEntry {
  min: number
  max?: number
  amount: string
}

export interface WeightThresholdConfig {
  type: 'weight_threshold'
  thresholds: WeightThresholdEntry[]
  unit: string
}

export type DoseConfig =
  | WeightDividedConfig
  | MgPerKgConfig
  | FixedConfig
  | WeightThresholdConfig

// Medication

export interface Medication {
  id: string
  name: string
  doseType: DoseConfig['type']
  doseConfig: DoseConfig
  color: string
  notes: string
}

// Schedule rule variants

export interface EveryNHoursRule {
  id: string
  type: 'every_n_hours'
  medicationId: string
  everyNHours: number
  isStartRule?: boolean
}

export interface AfterMedicationRule {
  id: string
  type: 'after_medication'
  medicationId: string
  afterMedicationId: string
  hoursAfter: number
}

export interface OncePerDayRule {
  id: string
  type: 'once_per_day'
  medicationId: string
}

export interface TimesPerDayRule {
  id: string
  type: 'times_per_day'
  medicationId: string
  timesPerDay: number
}

export type ScheduleRule =
  | EveryNHoursRule
  | AfterMedicationRule
  | OncePerDayRule
  | TimesPerDayRule

// Child profile

export interface Child {
  id: string
  name: string
  weight: number       // kg
  height?: number      // cm (optional, estimated from weight if missing)
  color?: string
  enabledMedications: string[]  // list of medication IDs active for this child
}

// Administered dose record

export interface AdministeredDose {
  id: string
  childId: string
  medicationId: string
  scheduledAt: string  // ISO datetime string
  administeredAt: string  // ISO datetime string
}
