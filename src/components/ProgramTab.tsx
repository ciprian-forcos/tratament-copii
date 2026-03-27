import { useMemo, useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateSchedule } from '../utils/scheduleEngine'
import { calculateDose, formatDose } from '../utils/doseCalculation'
import { defaultScheduleRules } from '../data/scheduleRules'
import type { Child, Medication, ScheduleRule } from '../types'

interface Props {
  activeChild: Child | null
  medications: Medication[]
}

function toDatetimeLocalString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#111827' : '#ffffff'
}

const SOON_MS = 30 * 60 * 1000

export function ProgramTab({ activeChild, medications }: Props) {
  const [startTimeStr, setStartTimeStr] = useLocalStorage<string>(
    'tratament-copii-start-time',
    toDatetimeLocalString(new Date()),
  )
  const [rules] = useLocalStorage<ScheduleRule[]>(
    'tratament-copii-schedule-rules',
    defaultScheduleRules,
  )

  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(interval)
  }, [])

  const startTime = useMemo(() => new Date(startTimeStr), [startTimeStr])

  const timeline = useMemo(() => {
    if (!activeChild) return []
    return generateSchedule(startTime, rules, activeChild.enabledMedications)
  }, [startTime, rules, activeChild])

  const medMap = useMemo(
    () => new Map(medications.map(m => [m.id, m])),
    [medications],
  )

  const nextIndex = useMemo(
    () => timeline.findIndex(e => e.scheduledAt >= now),
    [timeline, now],
  )

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Start time picker */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          <Clock size={15} />
          Ora de start
        </label>
        <input
          type="datetime-local"
          value={startTimeStr.slice(0, 16)}
          onChange={e => setStartTimeStr(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Timeline */}
      {!activeChild ? (
        <p className="text-center mt-8 text-gray-400 text-sm">
          Selectează un copil pentru a vedea programul.
        </p>
      ) : timeline.length === 0 ? (
        <p className="text-center mt-8 text-gray-400 text-sm">
          Niciun medicament activ în program.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium text-gray-700 mb-1">Program 24 ore</h2>
          {timeline.map((entry, i) => {
            const med = medMap.get(entry.medicationId)
            if (!med) return null
            const dose = calculateDose(med, activeChild.weight, activeChild.height)
            const doseStr = formatDose(dose, med.doseConfig.unit)
            const bg = med.color ?? '#6366f1'
            const textColor = getContrastColor(bg)

            const isPast = entry.scheduledAt < now
            const isNext = i === nextIndex
            const isSoon =
              !isPast &&
              !isNext &&
              entry.scheduledAt.getTime() - now.getTime() <= SOON_MS

            return (
              <div
                key={i}
                className={[
                  'flex items-center gap-3 py-2 px-2 rounded-lg border transition-colors',
                  isPast
                    ? 'opacity-40 border-transparent'
                    : isNext
                      ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                      : 'border-transparent',
                ].join(' ')}
              >
                <span
                  className={[
                    'text-sm font-mono w-12 shrink-0',
                    isPast ? 'text-gray-400 line-through' : 'text-gray-500',
                    isNext ? 'font-semibold text-indigo-700' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {formatTime(entry.scheduledAt)}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0"
                  style={{ backgroundColor: bg, color: textColor }}
                >
                  {med.name}
                </span>
                {isSoon && (
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 shrink-0">
                    curând
                  </span>
                )}
                {isNext && (
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full px-2 py-0.5 shrink-0">
                    următor
                  </span>
                )}
                <span
                  className={[
                    'text-sm ml-auto text-right',
                    isPast ? 'text-gray-400 line-through' : 'text-gray-700',
                    isNext ? 'font-medium text-indigo-700' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {doseStr}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
