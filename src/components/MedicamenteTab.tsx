import type { Child, Medication } from '../types'
import { calculateDose, formatDose } from '../utils/doseCalculation'

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

interface Props {
  medications: Medication[]
  activeChild: Child | null
}

export function MedicamenteTab({ medications, activeChild }: Props) {
  if (!activeChild) {
    return (
      <div className="p-4 text-center mt-8 text-gray-400 text-sm">
        Selectează un copil pentru a vedea dozele.
      </div>
    )
  }

  const enabledMedications = medications.filter(m =>
    activeChild.enabledMedications.includes(m.id)
  )

  if (enabledMedications.length === 0) {
    return (
      <div className="p-4 text-center mt-8 text-gray-400 text-sm">
        Niciun medicament activ pentru {activeChild.name}.
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3">
      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium px-1">
        Doze pentru {activeChild.name} ({activeChild.weight} kg)
      </p>

      {enabledMedications.map(med => {
        const dose = calculateDose(med, activeChild.weight, activeChild.height)
        const doseStr = formatDose(dose, med.doseConfig.unit)
        const textColor = getContrastColor(med.color)

        return (
          <div
            key={med.id}
            className="rounded-xl border border-gray-200 overflow-hidden"
          >
            <div className="flex items-start gap-3 p-4">
              {/* Color badge */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5"
                style={{ backgroundColor: med.color, color: textColor }}
              >
                {med.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm">{med.name}</div>

                <div className="mt-1">
                  <span
                    className="inline-block text-sm font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: med.color + '22', color: med.color }}
                  >
                    {doseStr}
                  </span>
                </div>

                {med.notes && (
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                    {med.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
