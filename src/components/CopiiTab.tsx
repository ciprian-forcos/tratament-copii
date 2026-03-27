import { useState } from 'react'
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, Check } from 'lucide-react'
import type { Child, Medication } from '../types'

const PRESET_COLORS = [
  '#6366f1', '#f97316', '#22c55e', '#ec4899',
  '#eab308', '#14b8a6', '#8b5cf6', '#3b82f6',
]

interface Props {
  children: Child[]
  setChildren: (children: Child[] | ((prev: Child[]) => Child[])) => void
  activeChildId: string | null
  setActiveChildId: (id: string | null) => void
  medications: Medication[]
}

interface FormState {
  name: string
  weight: string
  height: string
  color: string
}

const emptyForm = (): FormState => ({
  name: '',
  weight: '',
  height: '',
  color: PRESET_COLORS[0],
})

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

export function CopiiTab({ children, setChildren, activeChildId, setActiveChildId, medications }: Props) {
  const [showDialog, setShowDialog] = useState(false)
  const [editingChild, setEditingChild] = useState<Child | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm())
  const [formErrors, setFormErrors] = useState<{ name?: string; weight?: string }>({})
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [expandedChildId, setExpandedChildId] = useState<string | null>(null)

  function openAdd() {
    setEditingChild(null)
    setForm(emptyForm())
    setFormErrors({})
    setShowDialog(true)
  }

  function openEdit(child: Child) {
    setEditingChild(child)
    setForm({
      name: child.name,
      weight: String(child.weight),
      height: child.height != null ? String(child.height) : '',
      color: child.color ?? PRESET_COLORS[0],
    })
    setFormErrors({})
    setShowDialog(true)
  }

  function closeDialog() {
    setShowDialog(false)
    setEditingChild(null)
  }

  function validate(): boolean {
    const errors: { name?: string; weight?: string } = {}
    if (!form.name.trim()) errors.name = 'Numele este obligatoriu.'
    const w = parseFloat(form.weight)
    if (!form.weight || isNaN(w) || w <= 0) errors.weight = 'Greutatea trebuie să fie mai mare de 0.'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleSave() {
    if (!validate()) return
    const weight = parseFloat(form.weight)
    const height = form.height ? parseFloat(form.height) : undefined

    if (editingChild) {
      setChildren((prev: Child[]) =>
        prev.map(c =>
          c.id === editingChild.id
            ? { ...c, name: form.name.trim(), weight, height, color: form.color }
            : c
        )
      )
    } else {
      const newChild: Child = {
        id: generateId(),
        name: form.name.trim(),
        weight,
        height,
        color: form.color,
        enabledMedications: medications.map(m => m.id),
      }
      setChildren((prev: Child[]) => [...prev, newChild])
      if (!activeChildId) setActiveChildId(newChild.id)
    }
    closeDialog()
  }

  function handleDelete(childId: string) {
    setChildren((prev: Child[]) => prev.filter(c => c.id !== childId))
    if (activeChildId === childId) {
      const remaining = children.filter(c => c.id !== childId)
      setActiveChildId(remaining.length > 0 ? remaining[0].id : null)
    }
    setDeleteConfirmId(null)
  }

  function toggleMedication(childId: string, medicationId: string) {
    setChildren((prev: Child[]) =>
      prev.map(c => {
        if (c.id !== childId) return c
        const enabled = c.enabledMedications.includes(medicationId)
        return {
          ...c,
          enabledMedications: enabled
            ? c.enabledMedications.filter(id => id !== medicationId)
            : [...c.enabledMedications, medicationId],
        }
      })
    )
  }

  return (
    <div className="p-4 space-y-3">
      <button
        onClick={openAdd}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-indigo-300 text-indigo-600 font-medium text-sm hover:bg-indigo-50 transition-colors"
      >
        <Plus size={18} />
        Adaugă copil
      </button>

      {children.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-8">
          Niciun profil adăugat. Apasă butonul de mai sus pentru a adăuga un copil.
        </p>
      )}

      {children.map(child => {
        const isActive = child.id === activeChildId
        const isExpanded = expandedChildId === child.id
        const childColor = child.color ?? PRESET_COLORS[0]
        const textColor = getContrastColor(childColor)

        return (
          <div
            key={child.id}
            className={`rounded-xl border-2 overflow-hidden transition-colors ${
              isActive ? 'border-indigo-500 shadow-md' : 'border-gray-200'
            }`}
          >
            {/* Card header */}
            <button
              className="w-full text-left flex items-center gap-3 p-4"
              onClick={() => setActiveChildId(child.id)}
            >
              {/* Color badge */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: childColor, color: textColor }}
              >
                {child.name.charAt(0).toUpperCase()}
              </div>

              {/* Name + stats */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 truncate">{child.name}</span>
                  {isActive && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                      activ
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {child.weight} kg
                  {child.height != null && ` · ${child.height} cm`}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => openEdit(child)}
                  className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  aria-label="Editează"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(child.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Șterge"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </button>

            {/* Delete confirm */}
            {deleteConfirmId === child.id && (
              <div className="px-4 pb-4 flex items-center gap-2 bg-red-50">
                <span className="text-sm text-red-700 flex-1">Ești sigur că vrei să ștergi?</span>
                <button
                  onClick={() => handleDelete(child.id)}
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

            {/* Medication toggles toggle */}
            <button
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 border-t text-sm text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedChildId(isExpanded ? null : child.id)}
            >
              <span>
                Medicamente active ({child.enabledMedications.length}/{medications.length})
              </span>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Medication toggles list */}
            {isExpanded && (
              <div className="divide-y">
                {medications.map(med => {
                  const enabled = child.enabledMedications.includes(med.id)
                  return (
                    <button
                      key={med.id}
                      onClick={() => toggleMedication(child.id, med.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: med.color }}
                      />
                      <span className="flex-1 text-sm text-gray-800 truncate">{med.name}</span>
                      <div
                        className={`w-9 h-5 rounded-full flex items-center transition-colors flex-shrink-0 ${
                          !enabled ? 'bg-gray-300' : ''
                        }`}
                        style={enabled ? { backgroundColor: med.color } : {}}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white mx-0.5 transition-transform shadow-sm ${
                            enabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </div>
                      {enabled && (
                        <Check
                          size={14}
                          className="flex-shrink-0"
                          style={{ color: med.color }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* Add/Edit dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="w-full max-w-[480px] bg-white rounded-t-2xl sm:rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingChild ? 'Editează copil' : 'Adaugă copil'}
            </h2>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nume <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-300 ${
                  formErrors.name ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="ex: Andrei"
              />
              {formErrors.name && (
                <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
              )}
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Greutate (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.weight}
                onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-300 ${
                  formErrors.weight ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="ex: 14.5"
                min="0"
                step="0.1"
              />
              {formErrors.weight && (
                <p className="text-xs text-red-500 mt-1">{formErrors.weight}</p>
              )}
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Înălțime (cm) <span className="text-gray-400 font-normal">— opțional</span>
              </label>
              <input
                type="number"
                value={form.height}
                onChange={e => setForm(f => ({ ...f, height: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="ex: 92"
                min="0"
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Culoare</label>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
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

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={closeDialog}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Anulează
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
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
