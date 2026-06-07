import { useState } from 'react'
import { ChildEditor } from './ChildEditor'
import { StatusBar } from './StatusBar'
import { activeChild, ageWords, childStore, useChildren } from './childStore'
import { DEFAULT_MEDICATIONS } from '../../data/medications'
import { ShareSheet } from './share/ShareSheet'
import { calculateBSA, estimateHeight } from '../../utils/doseCalculation'

export interface ChildrenScreenProps {
  onBack: () => void
}

export function ChildrenScreen({ onBack }: ChildrenScreenProps) {
  const state = useChildren()
  const active = activeChild(state)
  const [editorOpen, setEditorOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  function handleAdd() {
    childStore.add()
    setEditorOpen(true)
  }

  const enabledMeds = DEFAULT_MEDICATIONS.filter((m) =>
    active.enabledMedications.includes(m.id),
  )

  return (
    <div className="phone" style={{ position: 'relative' }}>
      <StatusBar />

      {/* Top bar */}
      <div
        style={{
          padding: '10px 18px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            color: 'var(--ink-3)',
            fontSize: 22,
            lineHeight: 1,
            padding: '0 4px',
          }}
        >
          ‹
        </span>
        <div style={{ flex: 1 }}>
          <div className="eyebrow" style={{ color: 'var(--accent)' }}>
            gestionează
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>Copii</div>
        </div>
        <button
          onClick={() => setShareOpen(true)}
          style={{
            padding: '8px 14px',
            borderRadius: 12,
            border: '1.5px solid var(--line)',
            background: 'var(--bg-3)',
            color: 'var(--ink-2)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Partajează
        </button>
      </div>

      {/* Children list */}
      <div
        style={{
          padding: '14px 18px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {state.children.map((child) => {
          const isActive = child.id === state.activeId
          const height = estimateHeight(child.weight)
          const bsa = calculateBSA(child.weight, height)

          return (
            <div
              key={child.id}
              aria-current={isActive ? 'true' : undefined}
              style={{
                padding: '12px 14px',
                borderRadius: 16,
                border: `1.5px solid ${isActive ? 'var(--accent)' : 'var(--line)'}`,
                background: isActive ? 'rgba(245,177,74,0.07)' : 'var(--bg-2)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {/* Row header: avatar + name + age + active badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    background: 'var(--bg-3)',
                    border: `1.5px solid ${isActive ? 'var(--accent)' : 'var(--line)'}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-hand)',
                    fontSize: 20,
                    color: isActive ? 'var(--accent)' : 'var(--ink-2)',
                    flex: '0 0 auto',
                  }}
                >
                  {child.initial ?? child.name.trim()[0]?.toUpperCase() ?? '?'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>
                    {child.name}
                    {isActive && (
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: 11,
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--accent)',
                          background: 'rgba(245,177,74,0.15)',
                          borderRadius: 6,
                          padding: '1px 6px',
                          letterSpacing: '0.05em',
                        }}
                      >
                        activ
                      </span>
                    )}
                  </div>
                  <div
                    className="eyebrow"
                    style={{ color: 'var(--ink-3)', marginTop: 2 }}
                  >
                    {ageWords(child)} · {child.weight} kg
                  </div>
                </div>
              </div>

              {/* BSA + height */}
              <div
                className="mono"
                style={{
                  fontSize: 12,
                  color: 'var(--ink-3)',
                  paddingLeft: 46,
                }}
              >
                BSA {bsa.toFixed(2)} m² · ~{height} cm
              </div>

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  paddingLeft: 46,
                }}
              >
                <button
                  aria-label="editează"
                  onClick={() => {
                    childStore.setActive(child.id)
                    setEditorOpen(true)
                  }}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 10,
                    border: '1.5px solid var(--line)',
                    background: 'var(--bg-3)',
                    color: 'var(--ink-2)',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Editează
                </button>
                {!isActive && (
                  <button
                    aria-label="setează activ"
                    onClick={() => childStore.setActive(child.id)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 10,
                      border: '1.5px solid var(--accent)',
                      background: 'rgba(245,177,74,0.08)',
                      color: 'var(--accent)',
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Setează activ
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Active child medications section */}
      <div style={{ padding: '18px 18px 0' }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          medicamente active pentru {active.name}
        </div>
        {enabledMeds.length === 0 ? (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              border: '1.5px dashed var(--line)',
              color: 'var(--ink-3)',
              fontSize: 13,
              textAlign: 'center',
            }}
          >
            niciun medicament activ
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {enabledMeds.map((med) => (
              <div
                key={med.id}
                style={{
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: '1.5px solid var(--line)',
                  background: 'var(--bg-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 600 }}>
                  {med.name}
                </span>
                <span
                  className="mono"
                  style={{ fontSize: 11, color: 'var(--ink-3)' }}
                >
                  {med.doseType}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '16px 18px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <button
          aria-label="+ adaugă copil"
          onClick={handleAdd}
          style={{
            padding: '13px',
            borderRadius: 14,
            border: '1.5px dashed var(--accent)',
            background: 'rgba(245,177,74,0.06)',
            color: 'var(--accent)',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Adaugă copil
        </button>
        <button
          onClick={onBack}
          style={{
            padding: '13px',
            borderRadius: 14,
            border: '1.5px solid var(--line)',
            background: 'transparent',
            color: 'var(--ink-2)',
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          Înapoi
        </button>
      </div>

      {/* ChildEditor sheet */}
      <ChildEditor open={editorOpen} onClose={() => setEditorOpen(false)} />

      {/* ShareSheet */}
      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  )
}
