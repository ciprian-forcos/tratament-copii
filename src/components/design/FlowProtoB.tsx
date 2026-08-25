import { useEffect, useState } from 'react'
import { MedicamenteTab } from '../MedicamenteTab'
import type { Child, Medication } from '../../types'
import { ChildrenScreen } from './ChildrenScreen'
import { HomeB } from './HomeB'
import { PlanCard } from './PlanCard'
import { Step1 } from './Step1'
import { Step2, type Step2Value } from './Step2'
import { StatusBar } from './StatusBar'
import { activeChild, childStore, useChildren } from './childStore'
import { MEDICATIONS_CHANGED_EVENT, loadMedications, saveMedications } from './medicineStorage'

type Page = 'home' | 's1' | 's2' | 'done' | 'children' | 'medicines'

/**
 * Variant B end-to-end:
 *   HomeB → Step 1 (temperature) → Step 2 (first / last) → Plan card.
 *
 * The active child's `temp` lives in the global child store, so HomeB
 * and Step1 stay in sync when either updates.
 */
export function FlowProtoB() {
  const [page, setPage] = useState<Page>('home')
  const [s2, setS2] = useState<Step2Value>({ kind: 'first' })
  const [medications, setMedicationState] = useState<Medication[]>(loadMedications)

  const state = useChildren()
  const child = activeChild(state)
  const temp = child.temp ?? 37.0
  const setTemp = (v: number) => childStore.patchActive({ temp: v })

  const goHome = () => setPage('home')

  useEffect(() => {
    const reloadMedications = () => setMedicationState(loadMedications())
    window.addEventListener(MEDICATIONS_CHANGED_EVENT, reloadMedications)
    return () => window.removeEventListener(MEDICATIONS_CHANGED_EVENT, reloadMedications)
  }, [])

  function setMedications(next: Medication[] | ((prev: Medication[]) => Medication[])) {
    setMedicationState((prev) => {
      const value =
        typeof next === 'function' ? (next as (prev: Medication[]) => Medication[])(prev) : next
      saveMedications(value)
      return value
    })
  }

  function setChildren(next: Child[] | ((prev: Child[]) => Child[])) {
    childStore.setState((current) => ({
      ...current,
      children:
        typeof next === 'function' ? (next as (prev: Child[]) => Child[])(current.children) : next,
    }))
  }

  if (page === 'children')
    return (
      <ChildrenScreen
        onBack={() => setPage('home')}
        onMedicines={() => setPage('medicines')}
        medications={medications}
      />
    )
  if (page === 'medicines')
    return (
      <div className="phone" style={{ position: 'relative' }}>
        <StatusBar />
        <div
          style={{
            padding: '10px 18px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <button
            aria-label="Înapoi"
            onClick={() => setPage('children')}
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
          <div>
            <div className="eyebrow" style={{ color: 'var(--accent)' }}>
              gestionează
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>
              Medicamente
            </div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <MedicamenteTab
            medications={medications}
            setMedications={setMedications}
            activeChild={child}
            setChildren={setChildren}
          />
        </div>
      </div>
    )
  if (page === 'home') return <HomeB onStart={() => setPage('s1')} onMenu={() => setPage('children')} />
  if (page === 's1')
    return (
      <Step1 value={temp} onChange={setTemp} onBack={goHome} onNext={() => setPage('s2')} />
    )
  if (page === 's2')
    return (
      <Step2
        value={s2}
        onChange={setS2}
        onBack={() => setPage('s1')}
        onNext={() => setPage('done')}
      />
    )
  return (
    <PlanCard
      step2={s2}
      onBack={() => setPage('s2')}
      onDone={() => {
        goHome()
      }}
    />
  )
}
