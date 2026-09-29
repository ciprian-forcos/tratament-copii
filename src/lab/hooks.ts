import { useEffect, useState } from 'react'
import type { Medication } from '../types'
import { loadMedications, MEDICATIONS_CHANGED_EVENT } from '../components/design/medicineStorage'

export function useNow(everyMs: number) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), everyMs)
    return () => window.clearInterval(id)
  }, [everyMs])
  return now
}

export function useMedications() {
  const [meds, setMeds] = useState<Medication[]>(loadMedications)
  useEffect(() => {
    const reload = () => setMeds(loadMedications())
    window.addEventListener(MEDICATIONS_CHANGED_EVENT, reload)
    return () => window.removeEventListener(MEDICATIONS_CHANGED_EVENT, reload)
  }, [])
  return meds
}
