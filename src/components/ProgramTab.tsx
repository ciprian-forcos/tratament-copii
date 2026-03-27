import { useMemo, useState, useEffect } from 'react'
import { Clock, Check, ChevronDown, ChevronUp, Plus, Pencil, Trash2, User, CalendarX } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateSchedule } from '../utils/scheduleEngine'
import { calculateDose, formatDose } from '../utils/doseCalculation'
import { defaultScheduleRules } from '../data/scheduleRules'
import type { AdministeredDose, Child, Medication, ScheduleRule } from '../types'

interface Props {
  activeChild: Child | null
  medications: Medication[]
  children: Child[]
  setActiveChildId: (id: string | null) => void
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

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const SOON_MS = 30 * 60 * 1000

const RULE_TYPE_LABELS: Record<ScheduleRule['type'], string> = {
  every_n_hours: 'La fiecare N ore',
  after_medication: 'La N ore după',
  once_per_day: 'O dată pe zi',
  times_per_day: 'De N ori pe zi',
}

interface RuleFormState {
  type: ScheduleRule['type']
  medicationId: string
  everyNHours: string
  isStartRule: boolean
  afterMedicationId: string
  hoursAfter: string
  timesPerDay: string
}

function emptyRuleForm(medications: Medication[]): RuleFormState {
  return {
    type: 'every_n_hours',
    medicationId: medications[0]?.id ?? '',
    everyNHours: '8',
    isStartRule: false,
    afterMedicationId: medications[0]?.id ?? '',
    hoursAfter: '3',
    timesPerDay: '2',
  }
}

function ruleToForm(rule: ScheduleRule): RuleFormState {
  const base: RuleFormState = {
    type: rule.type,
    medicationId: rule.medicationId,
    everyNHours: '8',
    isStartRule: false,
    afterMedicationId: rule.medicationId,
    hoursAfter: '3',
    timesPerDay: '2',
  }
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

function formToRule(form: RuleFormState, id: string): ScheduleRule {
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
      hoursAfter: Math.max(0, Number(form.hoursAfter) || 3),
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
  // once_per_day
  return {
    id,
    type: 'once_per_day',
    medicationId: form.medicationId,
  }
}

function describeRule(rule: ScheduleRule, medMap: Map<string, Medication>): string {
  const med = medMap.get(rule.medicationId)?.name ?? rule.medicationId
  if (rule.type === 'every_n_hours') {
    return `${med} — la fiecare ${rule.everyNHours}h${rule.isStartRule ? ' (start)' : ''}`
  }
  if (rule.type === 'after_medication') {
    const ref = medMap.get(rule.afterMedicationId)?.name ?? rule.afterMedicationId
    return `${med} — la ${rule.hoursAfter}h după ${ref}`
  }
  if (rule.type === 'once_per_day') {
    return `${med} — o dată pe zi`
  }
  if (rule.type === 'times_per_day') {
    return `${med} — de ${rule.timesPerDay}x/zi`
  }
  return med
}

interface RuleDialogProps {
  rule: ScheduleRule | null
  medications: Medication[]
  onSave: (rule: ScheduleRule) => void
  onClose: () => void
}

function RuleDialog({ rule, medications, onSave, onClose }: RuleDialogProps) {
  const [form, setForm] = useState<RuleFormState>(() =>
    rule ? ruleToForm(rule) : emptyRuleForm(medications),
  )

  function set<K extends keyof RuleFormState>(key: K, value: RuleFormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    if (!form.medicationId) return
    const id = rule?.id ?? generateId()
    onSave(formToRule(form, id))
  }

  const isValid = !!form.medicationId

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-4 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-gray-900">
          {rule ? 'Editează regulă' : 'Regulă nouă'}
        </h2>

        {/* Rule type */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Tip regulă</label>
          <select
            value={form.type}
            onChange={e => set('type', e.target.value as ScheduleRule['type'])}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {(Object.keys(RULE_TYPE_LABELS) as ScheduleRule['type'][]).map(t => (
              <option key={t} value={t}>{RULE_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>

        {/* Medication */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Medicament</label>
          <select
            value={form.medicationId}
            onChange={e => set('medicationId', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {medications.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Type-specific fields */}
        {form.type === 'every_n_hours' && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Interval (ore)</label>
              <input
                type="number"
                min="1"
                max="24"
                value={form.everyNHours}
                onChange={e => set('everyNHours', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isStartRule}
                onChange={e => set('isStartRule', e.target.checked)}
                className="accent-indigo-600"
              />
              Regulă de start (ancorează ora de început)
            </label>
          </>
        )}

        {form.type === 'after_medication' && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Medicament de referință</label>
              <select
                value={form.afterMedicationId}
                onChange={e => set('afterMedicationId', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {medications.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Ore după</label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={form.hoursAfter}
                onChange={e => set('hoursAfter', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </>
        )}

        {form.type === 'times_per_day' && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Administrări pe zi</label>
            <input
              type="number"
              min="1"
              max="12"
              value={form.timesPerDay}
              onChange={e => set('timesPerDay', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Anulează
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium disabled:opacity-50 hover:bg-indigo-700"
          >
            Salvează
          </button>
        </div>
      </div>
    </div>
  )
}

export function ProgramTab({ activeChild, medications, children, setActiveChildId }: Props) {
  const [startTimeStr, setStartTimeStr] = useLocalStorage<string>(
    'tratament-copii-start-time',
    toDatetimeLocalString(new Date()),
  )
  const [rules, setRules] = useLocalStorage<ScheduleRule[]>(
    'tratament-copii-schedule-rules',
    defaultScheduleRules,
  )
  const [administeredDoses, setAdministeredDoses] = useLocalStorage<AdministeredDose[]>(
    'tratament-copii-administered-doses',
    [],
  )

  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(interval)
  }, [])

  // Clean up orphaned rules when medications change (e.g. after deletion)
  useEffect(() => {
    const medIds = new Set(medications.map(m => m.id))
    setRules(prev => {
      const filtered = prev.filter(r => {
        if (!medIds.has(r.medicationId)) return false
        if (r.type === 'after_medication' && !medIds.has(r.afterMedicationId)) return false
        return true
      })
      if (filtered.length === prev.length) return prev
      return filtered
    })
  }, [medications])

  const [rulesOpen, setRulesOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<ScheduleRule | null | undefined>(undefined)
  const [deletingRuleId, setDeletingRuleId] = useState<string | null>(null)

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

  const administeredSet = useMemo(() => {
    if (!activeChild) return new Set<string>()
    return new Set(
      administeredDoses
        .filter(d => d.childId === activeChild.id)
        .map(d => `${d.childId}|${d.medicationId}|${d.scheduledAt}`),
    )
  }, [administeredDoses, activeChild])

  function toggleAdministered(medicationId: string, scheduledAt: Date) {
    if (!activeChild) return
    const scheduledAtStr = scheduledAt.toISOString()
    const key = `${activeChild.id}|${medicationId}|${scheduledAtStr}`
    if (administeredSet.has(key)) {
      setAdministeredDoses(administeredDoses.filter(
        d => !(d.childId === activeChild.id && d.medicationId === medicationId && d.scheduledAt === scheduledAtStr),
      ))
    } else {
      setAdministeredDoses([...administeredDoses, {
        id: Math.random().toString(36).slice(2) + Date.now().toString(36),
        childId: activeChild.id,
        medicationId,
        scheduledAt: scheduledAtStr,
        administeredAt: new Date().toISOString(),
      }])
    }
  }

  function saveRule(rule: ScheduleRule) {
    setRules(prev => {
      const idx = prev.findIndex(r => r.id === rule.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = rule
        return next
      }
      return [...prev, rule]
    })
    setEditingRule(undefined)
  }

  function deleteRule(id: string) {
    setRules(prev => prev.filter(r => r.id !== id))
    setDeletingRuleId(null)
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Child selector — shown only when there are multiple children */}
      {children.length > 1 && (
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
          {children.map(child => {
            const isActive = activeChild?.id === child.id
            const bg = child.color ?? '#6366f1'
            const textColor = getContrastColor(bg)
            return (
              <button
                key={child.id}
                onClick={() => setActiveChildId(child.id)}
                className="shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border"
                style={
                  isActive
                    ? { backgroundColor: bg, color: textColor, borderColor: bg }
                    : { backgroundColor: 'transparent', color: '#6b7280', borderColor: '#d1d5db' }
                }
              >
                {child.name}
              </button>
            )
          })}
        </div>
      )}

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
        <div className="flex flex-col items-center justify-center py-10 text-center px-4">
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
            <User size={28} className="text-indigo-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">Niciun copil selectat</p>
          <p className="text-xs text-gray-400">
            {children.length === 0
              ? 'Adaugă un copil din tab-ul Copii pentru a vedea programul.'
              : 'Selectează un copil din lista de mai sus pentru a vedea programul.'}
          </p>
        </div>
      ) : timeline.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center px-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <CalendarX size={28} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">Niciun medicament în program</p>
          <p className="text-xs text-gray-400">
            Activează medicamente în profilul copilului sau adaugă reguli de administrare.
          </p>
        </div>
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

            const entryKey = `${activeChild.id}|${entry.medicationId}|${entry.scheduledAt.toISOString()}`
            const isAdministered = administeredSet.has(entryKey)
            const isPast = entry.scheduledAt < now
            const isNext = !isAdministered && i === nextIndex
            const isSoon =
              !isAdministered &&
              !isPast &&
              !isNext &&
              entry.scheduledAt.getTime() - now.getTime() <= SOON_MS

            return (
              <div
                key={i}
                className={[
                  'flex items-center gap-3 py-2 px-2 rounded-lg border transition-colors',
                  isAdministered
                    ? 'opacity-50 border-transparent bg-green-50'
                    : isPast
                      ? 'opacity-40 border-transparent'
                      : isNext
                        ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                        : 'border-transparent',
                ].join(' ')}
              >
                {/* Administered checkbox */}
                <button
                  onClick={() => toggleAdministered(entry.medicationId, entry.scheduledAt)}
                  aria-label={isAdministered ? 'Marchează ca neadministrat' : 'Marchează ca administrat'}
                  className={[
                    'shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                    isAdministered
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-400',
                  ].join(' ')}
                >
                  {isAdministered && <Check size={12} strokeWidth={3} />}
                </button>

                <span
                  className={[
                    'text-sm font-mono w-12 shrink-0',
                    isAdministered || isPast ? 'text-gray-400 line-through' : 'text-gray-500',
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
                    isAdministered || isPast ? 'text-gray-400 line-through' : 'text-gray-700',
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

      {/* Schedule rules section */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setRulesOpen(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <span>Reguli de administrare ({rules.length})</span>
          {rulesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {rulesOpen && (
          <div className="flex flex-col divide-y divide-gray-100">
            {rules.length === 0 && (
              <p className="px-4 py-3 text-sm text-gray-400">Nicio regulă definită.</p>
            )}
            {rules.map(rule => {
              const med = medMap.get(rule.medicationId)
              const bg = med?.color ?? '#6366f1'
              return (
                <div key={rule.id} className="flex items-center gap-3 px-4 py-2.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: bg }}
                  />
                  <span className="flex-1 text-sm text-gray-700 min-w-0 truncate">
                    {describeRule(rule, medMap)}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0 hidden sm:inline">
                    {RULE_TYPE_LABELS[rule.type]}
                  </span>
                  <button
                    onClick={() => setEditingRule(rule)}
                    aria-label="Editează regulă"
                    className="shrink-0 p-1 rounded hover:bg-gray-100 text-gray-500"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeletingRuleId(rule.id)}
                    aria-label="Șterge regulă"
                    className="shrink-0 p-1 rounded hover:bg-red-50 text-gray-500 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })}

            {/* Add rule button */}
            <button
              onClick={() => setEditingRule(null)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              <Plus size={16} />
              Adaugă regulă
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit rule dialog */}
      {editingRule !== undefined && (
        <RuleDialog
          rule={editingRule}
          medications={medications}
          onSave={saveRule}
          onClose={() => setEditingRule(undefined)}
        />
      )}

      {/* Delete confirmation */}
      {deletingRuleId && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-4 flex flex-col gap-4">
            <h2 className="text-base font-semibold text-gray-900">Șterge regulă</h2>
            <p className="text-sm text-gray-600">Ești sigur că vrei să ștergi această regulă?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingRuleId(null)}
                className="flex-1 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Anulează
              </button>
              <button
                onClick={() => deleteRule(deletingRuleId)}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
              >
                Șterge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
