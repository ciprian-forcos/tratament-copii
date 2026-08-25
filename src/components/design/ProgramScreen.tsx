import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import type { Medication, ScheduleRule } from '../../types'
import { defaultScheduleRules } from '../../data/scheduleRules'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { generateSchedule } from '../../utils/scheduleEngine'
import { calculateDose, formatDose } from '../../utils/doseCalculation'
import { activeChild, childStore, useChildren } from './childStore'
import { doseStore, useDoses } from './doseStore'
import { enabledMedicationIds } from './enabledMeds'
import { PanicToggle } from './PanicToggle'
import type { PanicPref } from './panicPref'
import { RemindersButton } from './RemindersButton'
import { TabBar, type TabId } from './TabBar'
import {
  describeRule,
  emptyRuleForm,
  formToRule,
  newRuleId,
  ruleToForm,
  type RuleFormState,
} from './scheduleRuleForm'
import { StatusBar } from './StatusBar'

export const START_TIME_KEY = 'tratament-copii-start-time'
export const RULES_KEY = 'tratament-copii-schedule-rules'

function toDatetimeLocalString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function formatTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function shortName(name: string): string {
  return name.split(/[/(]/)[0].trim()
}

export function ProgramScreen({
  medications,
  onFever,
  onMenu,
  onBack,
  panicPref,
  onPanicPref,
  tab,
  onTab,
  remindersEnabled,
  onRemindersEnable,
  onRemindersDisable,
}: {
  medications: Medication[]
  onFever: () => void
  onMenu?: () => void
  onBack?: () => void
  panicPref: PanicPref
  onPanicPref: (pref: PanicPref) => void
  tab?: TabId
  onTab?: (id: TabId) => void
  remindersEnabled?: boolean
  onRemindersEnable?: () => void
  onRemindersDisable?: () => void
}) {
  const state = useChildren()
  const child = activeChild(state)
  const doses = useDoses()
  const [startTimeStr, setStartTimeStr] = useLocalStorage(
    START_TIME_KEY,
    toDatetimeLocalString(new Date()),
  )
  const [rules, setRules] = useLocalStorage<ScheduleRule[]>(RULES_KEY, defaultScheduleRules)
  const [now, setNow] = useState(() => new Date())
  const [rulesOpen, setRulesOpen] = useState(false)
  const [editing, setEditing] = useState<ScheduleRule | null | undefined>(undefined)

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const startTime = useMemo(() => new Date(startTimeStr), [startTimeStr])
  const enabledIds = enabledMedicationIds(child, medications)
  const timeline = useMemo(
    () => generateSchedule(startTime, rules, enabledIds),
    [startTime, rules, enabledIds],
  )
  const medMap = useMemo(() => new Map(medications.map((m) => [m.id, m])), [medications])
  const nextIndex = timeline.findIndex((e) => e.scheduledAt >= now)

  function isGiven(entry: { medicationId: string; scheduledAt: Date }) {
    const scheduledAt = entry.scheduledAt.toISOString()
    return doses.some(
      (d) =>
        d.childId === child.id &&
        d.medicationId === entry.medicationId &&
        d.scheduledAt === scheduledAt,
    )
  }

  function toggleGiven(entry: { medicationId: string; scheduledAt: Date }) {
    const scheduledAt = entry.scheduledAt.toISOString()
    if (isGiven(entry)) {
      doseStore.unrecord(child.id, entry.medicationId, scheduledAt)
      return
    }
    doseStore.record({
      childId: child.id,
      medicationId: entry.medicationId,
      scheduledAt,
      administeredAt: new Date().toISOString(),
    })
  }

  function saveRule(rule: ScheduleRule) {
    setRules((prev) => {
      const idx = prev.findIndex((r) => r.id === rule.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = rule
        return next
      }
      return [...prev, rule]
    })
    setEditing(undefined)
  }

  return (
    <div className="phone" style={{ position: 'relative' }}>
      <StatusBar timeLabel={formatTime(now)} />
      <div
        style={{
          padding: '10px 18px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {onBack ? (
          <button
            aria-label="Înapoi"
            onClick={onBack}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              border: '1.5px solid var(--line)',
              background: 'var(--bg-3)',
              color: 'var(--ink-2)',
              fontSize: 22,
              cursor: 'pointer',
            }}
          >
            ‹
          </button>
        ) : (
          <button
            aria-label="meniu"
            onClick={onMenu}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              border: '1.5px solid var(--line)',
              background: 'var(--bg-3)',
              color: 'var(--ink-2)',
              fontSize: 18,
              cursor: 'pointer',
            }}
          >
            ≡
          </button>
        )}
        <div style={{ flex: 1 }}>
          <div className="eyebrow" style={{ color: 'var(--accent)' }}>
            program 24h · {child.name}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>Program</div>
        </div>
        {onRemindersEnable && onRemindersDisable && (
          <RemindersButton
            enabled={Boolean(remindersEnabled)}
            onEnable={onRemindersEnable}
            onDisable={onRemindersDisable}
          />
        )}
        <PanicToggle pref={panicPref} onChange={onPanicPref} />
      </div>

      {state.children.length > 1 && (
        <div style={{ padding: '12px 18px 0', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {state.children.map((c) => {
            const active = c.id === state.activeId
            return (
              <button
                key={c.id}
                onClick={() => childStore.setActive(c.id)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 999,
                  border: `1.5px solid ${active ? 'var(--accent)' : 'var(--line)'}`,
                  background: active ? 'rgba(245,177,74,0.12)' : 'var(--bg-2)',
                  color: active ? 'var(--accent)' : 'var(--ink-2)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {c.name}
              </button>
            )
          })}
        </div>
      )}

      <div style={{ padding: '14px 18px 0' }}>
        <div className="field-label">ora de start</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            aria-label="ora de start"
            type="datetime-local"
            value={startTimeStr.slice(0, 16)}
            onChange={(e) => setStartTimeStr(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 12,
              border: '1.5px solid var(--line)',
              background: 'var(--bg-2)',
              color: 'var(--ink)',
              font: 'inherit',
            }}
          />
          <button
            type="button"
            onClick={() => setStartTimeStr(toDatetimeLocalString(new Date()))}
            style={{
              padding: '10px 12px',
              borderRadius: 12,
              border: '1.5px solid var(--line)',
              background: 'var(--bg-3)',
              color: 'var(--ink-2)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Acum
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 0' }}>
        {timeline.length === 0 ? (
          <div
            style={{
              padding: '16px',
              borderRadius: 14,
              border: '1.5px dashed var(--line)',
              color: 'var(--ink-3)',
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            Niciun medicament în program. Activează medicamente la Copii.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {timeline.map((entry, i) => {
              const med = medMap.get(entry.medicationId)
              if (!med) return null
              const given = isGiven(entry)
              const isNext = !given && i === nextIndex
              const dose = formatDose(calculateDose(med, child.weight, child.height), med.doseConfig.unit)
              return (
                <div
                  key={`${entry.medicationId}-${entry.scheduledAt.toISOString()}-${i}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 14,
                    border: `1.5px solid ${isNext ? 'var(--accent)' : 'var(--line)'}`,
                    background: given ? 'var(--bg-3)' : isNext ? 'rgba(245,177,74,0.08)' : 'var(--bg-2)',
                    opacity: given ? 0.55 : 1,
                  }}
                >
                  <button
                    type="button"
                    aria-label={given ? 'Marchează ca neadministrat' : 'Marchează ca administrat'}
                    onClick={() => toggleGiven(entry)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      border: `1.5px solid ${given ? 'var(--safe)' : 'var(--line)'}`,
                      background: given ? 'var(--safe)' : 'transparent',
                      color: given ? '#0d1115' : 'var(--ink-3)',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    {given ? '✓' : ''}
                  </button>
                  <span className="mono" style={{ width: 44, color: isNext ? 'var(--accent)' : 'var(--ink-2)' }}>
                    {formatTime(entry.scheduledAt)}
                  </span>
                  <span style={{ flex: 1, fontWeight: 600, color: 'var(--ink)' }}>
                    {shortName(med.name)}
                    {isNext ? (
                      <span className="eyebrow" style={{ marginLeft: 8, color: 'var(--accent)' }}>
                        următor
                      </span>
                    ) : null}
                  </span>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                    {dose}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        <button
          type="button"
          onClick={() => setRulesOpen((v) => !v)}
          style={{
            marginTop: 16,
            width: '100%',
            padding: '12px 14px',
            borderRadius: 14,
            border: '1.5px solid var(--line)',
            background: 'var(--bg-2)',
            color: 'var(--ink-2)',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          Reguli de administrare ({rules.length})
        </button>
        {rulesOpen && (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {rules.map((rule) => (
              <div
                key={rule.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 12,
                  background: 'var(--bg-3)',
                }}
              >
                <span style={{ flex: 1, fontSize: 13, color: 'var(--ink)' }}>{describeRule(rule, medMap)}</span>
                <button
                  type="button"
                  aria-label="Editează regulă"
                  onClick={() => setEditing(rule)}
                  style={iconBtn}
                >
                  ✎
                </button>
                <button
                  type="button"
                  aria-label="Șterge regulă"
                  onClick={() => setRules((prev) => prev.filter((r) => r.id !== rule.id))}
                  style={iconBtn}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setEditing(null)}
              style={{
                padding: '10px',
                borderRadius: 12,
                border: '1.5px dashed var(--accent)',
                background: 'rgba(245,177,74,0.06)',
                color: 'var(--accent)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Adaugă regulă
            </button>
          </div>
        )}
      </div>

      <div style={{ padding: '14px 18px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button className="btn-primary" onClick={onFever}>
          Tratament febră →
        </button>
      </div>
      {onTab && tab && <TabBar current={tab} onSelect={onTab} />}

      {editing !== undefined && (
        <RuleSheet
          rule={editing}
          medications={medications}
          onSave={saveRule}
          onClose={() => setEditing(undefined)}
        />
      )}
    </div>
  )
}

const iconBtn: CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--ink-3)',
  cursor: 'pointer',
  fontSize: 16,
  padding: 4,
}

function RuleSheet({
  rule,
  medications,
  onSave,
  onClose,
}: {
  rule: ScheduleRule | null
  medications: Medication[]
  onSave: (rule: ScheduleRule) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<RuleFormState>(() =>
    rule ? ruleToForm(rule) : emptyRuleForm(medications),
  )
  const set = (patch: Partial<RuleFormState>) => setForm((f) => ({ ...f, ...patch }))
  const valid = Boolean(form.medicationId)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: 'var(--bg-2)',
          borderTop: '1.5px solid var(--line)',
          borderRadius: '20px 20px 0 0',
          padding: '16px 18px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div className="eyebrow" style={{ color: 'var(--accent)' }}>
          {rule ? 'editează regula' : 'regulă nouă'}
        </div>
        <label className="field-label">
          medicament
          <select
            aria-label="medicament"
            value={form.medicationId}
            onChange={(e) => set({ medicationId: e.target.value })}
            style={fieldStyle}
          >
            {medications.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field-label">
          tip
          <select
            aria-label="tip regulă"
            value={form.type}
            onChange={(e) => set({ type: e.target.value as RuleFormState['type'] })}
            style={fieldStyle}
          >
            <option value="every_n_hours">La fiecare N ore</option>
            <option value="after_medication">La N ore după</option>
            <option value="once_per_day">O dată pe zi</option>
            <option value="times_per_day">De N ori pe zi</option>
          </select>
        </label>
        {form.type === 'every_n_hours' && (
          <label className="field-label">
            interval (ore)
            <input
              aria-label="interval ore"
              type="number"
              min={1}
              value={form.everyNHours}
              onChange={(e) => set({ everyNHours: e.target.value })}
              style={fieldStyle}
            />
          </label>
        )}
        {form.type === 'after_medication' && (
          <>
            <label className="field-label">
              după
              <select
                aria-label="după medicament"
                value={form.afterMedicationId}
                onChange={(e) => set({ afterMedicationId: e.target.value })}
                style={fieldStyle}
              >
                {medications.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label">
              ore după
              <input
                aria-label="ore după"
                type="number"
                min={0}
                value={form.hoursAfter}
                onChange={(e) => set({ hoursAfter: e.target.value })}
                style={fieldStyle}
              />
            </label>
          </>
        )}
        {form.type === 'times_per_day' && (
          <label className="field-label">
            ori pe zi
            <input
              aria-label="ori pe zi"
              type="number"
              min={1}
              value={form.timesPerDay}
              onChange={(e) => set({ timesPerDay: e.target.value })}
              style={fieldStyle}
            />
          </label>
        )}
        <button
          className="btn-primary"
          disabled={!valid}
          onClick={() => onSave(formToRule(form, rule?.id ?? newRuleId()))}
        >
          Salvează
        </button>
        <button className="btn-secondary btn-ghost" onClick={onClose}>
          Anulează
        </button>
      </div>
    </div>
  )
}

const fieldStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: 4,
  padding: '10px 12px',
  borderRadius: 12,
  border: '1.5px solid var(--line)',
  background: 'var(--bg-3)',
  color: 'var(--ink)',
  font: 'inherit',
}

