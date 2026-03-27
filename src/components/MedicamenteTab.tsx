import { useState } from 'react'
import { Plus, Pencil, Trash2, Pill, User } from 'lucide-react'
import type { Child, Medication, DoseConfig } from '../types'
import { calculateDose, formatDose, estimateHeight, calculateBSA } from '../utils/doseCalculation'

const PRESET_COLORS = [
  '#3b82f6', '#f97316', '#8b5cf6', '#14b8a6',
  '#22c55e', '#eab308', '#ec4899', '#ef4444',
]

const DOSE_TYPE_LABELS: Record<DoseConfig['type'], string> = {
  weight_divided: 'Greutate / divizor',
  mg_per_kg: 'mg per kg pe zi',
  fixed: 'Doză fixă',
  weight_threshold: 'Prag de greutate',
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

interface Props {
  medications: Medication[]
  setMedications: (meds: Medication[] | ((prev: Medication[]) => Medication[])) => void
  activeChild: Child | null
  setChildren: (children: Child[] | ((prev: Child[]) => Child[])) => void
}

interface ThresholdRow {
  min: string
  max: string
  amount: string
}

interface FormState {
  name: string
  doseType: DoseConfig['type']
  unit: string
  color: string
  notes: string
  // weight_divided
  divisor: string
  offset: string
  // mg_per_kg
  mgPerKgPerDay: string
  dosesPerDay: string
  concentrationMg: string
  maxDailyMg: string
  roundTo: 'whole' | 'half' | 'quarter'
  // fixed
  fixedAmount: string
  // weight_threshold
  thresholds: ThresholdRow[]
}

function emptyForm(): FormState {
  return {
    name: '',
    doseType: 'fixed',
    unit: 'ml',
    color: PRESET_COLORS[0],
    notes: '',
    divisor: '2',
    offset: '0',
    mgPerKgPerDay: '15',
    dosesPerDay: '3',
    concentrationMg: '100',
    maxDailyMg: '',
    roundTo: 'half',
    fixedAmount: '',
    thresholds: [{ min: '0', max: '', amount: '' }],
  }
}

function medicationToForm(med: Medication): FormState {
  const base = emptyForm()
  base.name = med.name
  base.doseType = med.doseType
  base.color = med.color
  base.notes = med.notes
  base.unit = med.doseConfig.unit
  const cfg = med.doseConfig
  if (cfg.type === 'weight_divided') {
    base.divisor = String(cfg.divisor)
    base.offset = String(cfg.offset)
  } else if (cfg.type === 'mg_per_kg') {
    base.mgPerKgPerDay = String(cfg.mgPerKgPerDay)
    base.dosesPerDay = String(cfg.dosesPerDay)
    base.concentrationMg = String(cfg.concentrationMg)
    base.maxDailyMg = cfg.maxDailyMg != null ? String(cfg.maxDailyMg) : ''
    base.roundTo = cfg.roundTo
  } else if (cfg.type === 'fixed') {
    base.fixedAmount = cfg.amount
  } else if (cfg.type === 'weight_threshold') {
    base.thresholds = cfg.thresholds.map(t => ({
      min: String(t.min),
      max: t.max != null ? String(t.max) : '',
      amount: t.amount,
    }))
  }
  return base
}

function buildDoseConfig(form: FormState): DoseConfig {
  const unit = form.unit.trim() || 'ml'
  switch (form.doseType) {
    case 'weight_divided':
      return {
        type: 'weight_divided',
        divisor: parseFloat(form.divisor) || 2,
        offset: parseFloat(form.offset) || 0,
        unit,
      }
    case 'mg_per_kg': {
      const maxDailyMg = form.maxDailyMg ? parseFloat(form.maxDailyMg) : undefined
      return {
        type: 'mg_per_kg',
        mgPerKgPerDay: parseFloat(form.mgPerKgPerDay) || 15,
        dosesPerDay: parseInt(form.dosesPerDay) || 3,
        concentrationMg: parseFloat(form.concentrationMg) || 100,
        unit,
        roundTo: form.roundTo,
        ...(maxDailyMg !== undefined ? { maxDailyMg } : {}),
      }
    }
    case 'fixed':
      return { type: 'fixed', amount: form.fixedAmount.trim(), unit }
    case 'weight_threshold':
      return {
        type: 'weight_threshold',
        thresholds: form.thresholds
          .filter(t => t.amount.trim())
          .map(t => ({
            min: parseFloat(t.min) || 0,
            ...(t.max ? { max: parseFloat(t.max) } : {}),
            amount: t.amount.trim(),
          })),
        unit,
      }
    default: {
      const _: never = form.doseType
      throw new Error(`Unknown dose type: ${_}`)
    }
  }
}

const inputCls = (hasError?: boolean) =>
  `w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-300 ${
    hasError ? 'border-red-400' : 'border-gray-300'
  }`

export function MedicamenteTab({ medications, setMedications, activeChild, setChildren }: Props) {
  const [showDialog, setShowDialog] = useState(false)
  const [editingMed, setEditingMed] = useState<Medication | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm())
  const [nameError, setNameError] = useState<string | undefined>()
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  function getDuplicateError(name: string, excludeId?: string): string | undefined {
    const trimmed = name.trim().toLowerCase()
    if (!trimmed) return undefined
    const isDuplicate = medications.some(m => {
      if (excludeId && m.id === excludeId) return false
      return m.name.trim().toLowerCase() === trimmed
    })
    return isDuplicate ? 'Există deja un medicament cu acest nume.' : undefined
  }

  function openAdd() {
    setEditingMed(null)
    setForm(emptyForm())
    setNameError(undefined)
    setShowDialog(true)
  }

  function openEdit(med: Medication) {
    setEditingMed(med)
    setForm(medicationToForm(med))
    setNameError(undefined)
    setShowDialog(true)
  }

  function closeDialog() {
    setShowDialog(false)
    setEditingMed(null)
  }

  function handleNameChange(name: string) {
    setForm(f => ({ ...f, name }))
    setNameError(getDuplicateError(name, editingMed?.id))
  }

  function handleSave() {
    if (!form.name.trim()) {
      setNameError('Numele este obligatoriu.')
      return
    }
    const dup = getDuplicateError(form.name, editingMed?.id)
    if (dup) {
      setNameError(dup)
      return
    }
    const doseConfig = buildDoseConfig(form)
    if (editingMed) {
      setMedications((prev: Medication[]) =>
        prev.map(m =>
          m.id === editingMed.id
            ? {
                ...m,
                name: form.name.trim(),
                doseType: form.doseType,
                doseConfig,
                color: form.color,
                notes: form.notes.trim(),
              }
            : m
        )
      )
    } else {
      const newMed: Medication = {
        id: generateId(),
        name: form.name.trim(),
        doseType: form.doseType,
        doseConfig,
        color: form.color,
        notes: form.notes.trim(),
      }
      setMedications((prev: Medication[]) => [...prev, newMed])
    }
    closeDialog()
  }

  function handleDelete(medId: string) {
    setMedications((prev: Medication[]) => prev.filter(m => m.id !== medId))
    setChildren((prev: Child[]) =>
      prev.map(c => ({
        ...c,
        enabledMedications: c.enabledMedications.filter(id => id !== medId),
      }))
    )
    setDeleteConfirmId(null)
  }

  const isSaveDisabled = !!nameError || !form.name.trim()

  return (
    <div className="p-4 space-y-3">
      <button
        onClick={openAdd}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-indigo-300 text-indigo-600 font-medium text-sm hover:bg-indigo-50 transition-colors"
      >
        <Plus size={18} />
        Adaugă medicament
      </button>

      {!activeChild && medications.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
          <User size={15} className="text-amber-500 shrink-0" />
          <p className="text-xs text-amber-700">
            Selectează un copil din tab-ul <strong>Copii</strong> pentru a vedea dozele calculate.
          </p>
        </div>
      )}

      {activeChild && (() => {
        const heightCm = activeChild.height ?? estimateHeight(activeChild.weight)
        const isEstimated = activeChild.height == null
        const bsa = calculateBSA(activeChild.weight, heightCm)
        return (
          <div className="px-3 py-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-800">
            <div className="flex items-center gap-1.5 mb-1">
              <User size={13} className="text-indigo-400 shrink-0" />
              <span className="font-semibold">{activeChild.name}</span>
              <span className="text-indigo-400">·</span>
              <span>{activeChild.weight} kg</span>
            </div>
            <div className="flex gap-3 text-indigo-700">
              <span>
                Înălțime: <strong>{heightCm} cm</strong>
                {isEstimated && <span className="text-indigo-400 ml-1">(estimat)</span>}
              </span>
              <span>
                BSA: <strong>{bsa.toFixed(2)} m²</strong>
              </span>
            </div>
          </div>
        )
      })()}

      {medications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
            <Pill size={28} className="text-indigo-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">Niciun medicament</p>
          <p className="text-xs text-gray-400">Apasă „Adaugă medicament" pentru a adăuga primul medicament.</p>
        </div>
      )}

      {medications.map(med => {
        const textColor = getContrastColor(med.color)
        const isEnabled = activeChild?.enabledMedications.includes(med.id) ?? false

        let doseStr: string | undefined
        if (activeChild && isEnabled) {
          const dose = calculateDose(med, activeChild.weight, activeChild.height)
          doseStr = formatDose(dose, med.doseConfig.unit)
        }

        return (
          <div key={med.id} className="rounded-xl border border-gray-200 overflow-hidden">
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

                {doseStr && (
                  <div className="mt-1">
                    <span
                      className="inline-block text-sm font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: med.color + '22', color: med.color }}
                    >
                      {doseStr}
                    </span>
                  </div>
                )}

                {med.notes && (
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{med.notes}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => openEdit(med)}
                  className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  aria-label="Editează"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(med.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Șterge"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Delete confirm */}
            {deleteConfirmId === med.id && (
              <div className="px-4 pb-4 flex items-center gap-2 bg-red-50">
                <span className="text-sm text-red-700 flex-1">Ești sigur că vrei să ștergi?</span>
                <button
                  onClick={() => handleDelete(med.id)}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg font-medium hover:bg-red-700"
                >
                  Șterge
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-3 py-1.5 bg-white border border-gray-300 text-sm rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Anulează
                </button>
              </div>
            )}
          </div>
        )
      })}

      {/* Add/Edit dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="w-full max-w-[480px] bg-white rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="p-6 pb-4 border-b flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingMed ? 'Editează medicament' : 'Adaugă medicament'}
              </h2>
            </div>

            <div className="overflow-y-auto p-6 space-y-4 flex-1">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nume <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => handleNameChange(e.target.value)}
                  className={inputCls(!!nameError)}
                  placeholder="ex: Ibuprofen"
                />
                {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
              </div>

              {/* Dose type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tip doză</label>
                <select
                  value={form.doseType}
                  onChange={e =>
                    setForm(f => ({ ...f, doseType: e.target.value as DoseConfig['type'] }))
                  }
                  className={inputCls()}
                >
                  {(Object.keys(DOSE_TYPE_LABELS) as DoseConfig['type'][]).map(t => (
                    <option key={t} value={t}>
                      {DOSE_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unitate</label>
                <input
                  type="text"
                  value={form.unit}
                  onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                  className={inputCls()}
                  placeholder="ex: ml, picături, comprimate"
                />
              </div>

              {/* weight_divided fields */}
              {form.doseType === 'weight_divided' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Divizor</label>
                    <input
                      type="number"
                      value={form.divisor}
                      onChange={e => setForm(f => ({ ...f, divisor: e.target.value }))}
                      className={inputCls()}
                      placeholder="ex: 2"
                      min="0.01"
                      step="0.01"
                    />
                    <p className="text-xs text-gray-400 mt-1">Formula: greutate (kg) / divizor + offset</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Offset</label>
                    <input
                      type="number"
                      value={form.offset}
                      onChange={e => setForm(f => ({ ...f, offset: e.target.value }))}
                      className={inputCls()}
                      placeholder="ex: 0"
                      step="0.1"
                    />
                  </div>
                </>
              )}

              {/* mg_per_kg fields */}
              {form.doseType === 'mg_per_kg' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">mg/kg/zi</label>
                    <input
                      type="number"
                      value={form.mgPerKgPerDay}
                      onChange={e => setForm(f => ({ ...f, mgPerKgPerDay: e.target.value }))}
                      className={inputCls()}
                      placeholder="ex: 15"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doze pe zi</label>
                    <input
                      type="number"
                      value={form.dosesPerDay}
                      onChange={e => setForm(f => ({ ...f, dosesPerDay: e.target.value }))}
                      className={inputCls()}
                      placeholder="ex: 3"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Concentrație (mg/{form.unit || 'ml'})
                    </label>
                    <input
                      type="number"
                      value={form.concentrationMg}
                      onChange={e => setForm(f => ({ ...f, concentrationMg: e.target.value }))}
                      className={inputCls()}
                      placeholder="ex: 100"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Doză zilnică max (mg){' '}
                      <span className="text-gray-400 font-normal">— opțional</span>
                    </label>
                    <input
                      type="number"
                      value={form.maxDailyMg}
                      onChange={e => setForm(f => ({ ...f, maxDailyMg: e.target.value }))}
                      className={inputCls()}
                      placeholder="ex: 1000"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rotunjire</label>
                    <select
                      value={form.roundTo}
                      onChange={e =>
                        setForm(f => ({
                          ...f,
                          roundTo: e.target.value as 'whole' | 'half' | 'quarter',
                        }))
                      }
                      className={inputCls()}
                    >
                      <option value="whole">Întreg</option>
                      <option value="half">½</option>
                      <option value="quarter">¼</option>
                    </select>
                  </div>
                </>
              )}

              {/* fixed fields */}
              {form.doseType === 'fixed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantitate</label>
                  <input
                    type="text"
                    value={form.fixedAmount}
                    onChange={e => setForm(f => ({ ...f, fixedAmount: e.target.value }))}
                    className={inputCls()}
                    placeholder="ex: 1, 2-3, 0.5"
                  />
                </div>
              )}

              {/* weight_threshold fields */}
              {form.doseType === 'weight_threshold' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Praguri de greutate
                  </label>
                  <div className="space-y-2">
                    {form.thresholds.map((row, i) => (
                      <div key={i} className="flex gap-1.5 items-center">
                        <input
                          type="number"
                          value={row.min}
                          onChange={e => {
                            const updated = [...form.thresholds]
                            updated[i] = { ...updated[i], min: e.target.value }
                            setForm(f => ({ ...f, thresholds: updated }))
                          }}
                          className="w-14 px-2 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                          placeholder="min"
                        />
                        <span className="text-gray-400 text-xs">—</span>
                        <input
                          type="number"
                          value={row.max}
                          onChange={e => {
                            const updated = [...form.thresholds]
                            updated[i] = { ...updated[i], max: e.target.value }
                            setForm(f => ({ ...f, thresholds: updated }))
                          }}
                          className="w-14 px-2 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                          placeholder="max"
                        />
                        <span className="text-gray-400 text-xs">kg→</span>
                        <input
                          type="text"
                          value={row.amount}
                          onChange={e => {
                            const updated = [...form.thresholds]
                            updated[i] = { ...updated[i], amount: e.target.value }
                            setForm(f => ({ ...f, thresholds: updated }))
                          }}
                          className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                          placeholder="cantitate"
                        />
                        {form.thresholds.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setForm(f => ({
                                ...f,
                                thresholds: f.thresholds.filter((_, j) => j !== i),
                              }))
                            }
                            className="p-1 text-red-400 hover:text-red-600 text-lg leading-none"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setForm(f => ({
                          ...f,
                          thresholds: [...f.thresholds, { min: '', max: '', amount: '' }],
                        }))
                      }
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      + Adaugă prag
                    </button>
                  </div>
                </div>
              )}

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Culoare</label>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, color }))}
                      className={`w-8 h-8 rounded-full transition-transform ${
                        form.color === color ? 'scale-125 ring-2 ring-offset-1 ring-gray-400' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Culoare ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note <span className="text-gray-400 font-normal">— opțional</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                  rows={2}
                  placeholder="ex: Fără stomac gol"
                />
              </div>
            </div>

            {/* Dialog actions */}
            <div className="p-6 pt-4 border-t flex-shrink-0 flex gap-2">
              <button
                onClick={closeDialog}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Anulează
              </button>
              <button
                onClick={handleSave}
                disabled={isSaveDisabled}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isSaveDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Salvează
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
