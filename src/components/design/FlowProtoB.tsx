import { useState } from 'react'
import { HomeB } from './HomeB'
import { PlanCard } from './PlanCard'
import { Step1 } from './Step1'
import { Step2, type Step2Value } from './Step2'
import { activeChild, childStore, useChildren } from './childStore'

type Page = 'home' | 's1' | 's2' | 'done'

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

  const state = useChildren()
  const child = activeChild(state)
  const temp = child.temp ?? 37.0
  const setTemp = (v: number) => childStore.patchActive({ temp: v })

  const goHome = () => setPage('home')

  if (page === 'home') return <HomeB onStart={() => setPage('s1')} />
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
        // TODO: persist administered dose here once timeline is real.
        goHome()
      }}
    />
  )
}
