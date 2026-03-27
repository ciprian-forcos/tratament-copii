import type { Medication } from '../types'

// Height estimation lookup table by weight (kg)
export function estimateHeight(weightKg: number): number {
  if (weightKg <= 5) return 55
  if (weightKg <= 8) return 65
  if (weightKg <= 10) return 75
  if (weightKg <= 12) return 85
  if (weightKg <= 15) return 95
  if (weightKg <= 18) return 105
  if (weightKg <= 22) return 115
  if (weightKg <= 28) return 125
  if (weightKg <= 35) return 135
  return 145
}

// BSA via Mosteller formula
export function calculateBSA(weightKg: number, heightCm: number): number {
  return Math.sqrt((heightCm * weightKg) / 3600)
}

function roundToNearest(value: number, roundTo: 'whole' | 'half' | 'quarter'): number {
  if (roundTo === 'whole') return Math.round(value)
  if (roundTo === 'half') return Math.round(value * 2) / 2
  return Math.round(value * 4) / 4
}

/**
 * Returns the calculated dose amount as a number, or 'sub_doza' when below minimum.
 */
export function calculateDose(
  medication: Medication,
  weightKg: number,
  _heightCm?: number,
): number | 'sub_doza' {
  const config = medication.doseConfig

  switch (config.type) {
    case 'weight_divided': {
      return Math.round(weightKg / config.divisor + config.offset)
    }

    case 'mg_per_kg': {
      const dailyMg = config.maxDailyMg != null
        ? Math.min(config.mgPerKgPerDay * weightKg, config.maxDailyMg)
        : config.mgPerKgPerDay * weightKg
      const doseMg = dailyMg / config.dosesPerDay
      const doseAmount = roundToNearest(doseMg / config.concentrationMg, config.roundTo)
      if (doseAmount < 0.25) return 'sub_doza'
      return doseAmount
    }

    case 'fixed': {
      return parseFloat(config.amount)
    }

    case 'weight_threshold': {
      const entry = config.thresholds.find(
        t => weightKg >= t.min && (t.max == null || weightKg < t.max),
      )
      if (!entry) return 'sub_doza'
      return parseFloat(entry.amount)
    }
  }
}

/**
 * Formats a dose amount and unit into a human-readable Romanian string.
 */
export function formatDose(amount: number | 'sub_doza', unit: string): string {
  if (amount === 'sub_doza') return 'Sub doza minima'
  return `${amount} ${unit}`
}
