import { useEffect, useState } from 'react'
import type { AdministeredDose, TimelineFact } from '../../../types'
import { doseStore } from '../doseStore'

export const FACTS_KEY = 'tratament-copii-timeline-facts'

type Listener = () => void

let facts: TimelineFact[] = []
const listeners = new Set<Listener>()
let lifting = false

function loadFacts(): TimelineFact[] {
  try {
    const raw = localStorage.getItem(FACTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as TimelineFact[]) : []
  } catch {
    return []
  }
}

function saveFacts() {
  try {
    localStorage.setItem(FACTS_KEY, JSON.stringify(facts))
  } catch {
    /* quota */
  }
}

function notify() {
  listeners.forEach((fn) => fn())
}

function doseToFact(d: AdministeredDose): TimelineFact {
  return {
    id: d.id,
    childId: d.childId,
    at: d.administeredAt,
    payload: { kind: 'dose', medicationId: d.medicationId, source: 'given' },
  }
}

function liftMissingDoses() {
  const known = new Set(facts.map((f) => f.id))
  const extra = doseStore.list().filter((d) => !known.has(d.id)).map(doseToFact)
  if (extra.length === 0) return
  facts = [...facts, ...extra]
  saveFacts()
  notify()
}

function hydrate() {
  facts = loadFacts()
  if (facts.length === 0) {
    facts = doseStore.list().map(doseToFact)
    if (facts.length > 0) saveFacts()
  } else {
    liftMissingDoses()
  }
}

hydrate()

doseStore.subscribe(() => {
  if (lifting) return
  liftMissingDoses()
})

function newId(prefix: string) {
  return prefix + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6)
}

export const timelineStore = {
  list(): TimelineFact[] {
    return [...facts]
  },

  listFor(childId: string): TimelineFact[] {
    return facts.filter((f) => f.childId === childId)
  },

  append(fact: Omit<TimelineFact, 'id'> & { id?: string }): TimelineFact {
    const record: TimelineFact = { ...fact, id: fact.id ?? newId('e') }
    if (facts.some((f) => f.id === record.id)) return facts.find((f) => f.id === record.id)!
    facts = [...facts, record]
    saveFacts()
    if (record.payload.kind === 'dose') {
      lifting = true
      doseStore.record({
        id: record.id,
        childId: record.childId,
        medicationId: record.payload.medicationId,
        scheduledAt: record.at,
        administeredAt: record.at,
      })
      lifting = false
    }
    notify()
    return record
  },

  remove(id: string) {
    const existing = facts.find((f) => f.id === id)
    facts = facts.filter((f) => f.id !== id)
    saveFacts()
    if (existing?.payload.kind === 'dose') {
      lifting = true
      doseStore.unrecord(existing.childId, existing.payload.medicationId, existing.at)
      lifting = false
    }
    notify()
  },

  clear() {
    facts = []
    localStorage.removeItem(FACTS_KEY)
    notify()
  },

  subscribe(fn: Listener): () => void {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },

  reloadFromStorage() {
    hydrate()
    notify()
  },
}

export function useTimelineFacts(childId: string): TimelineFact[] {
  const [current, setCurrent] = useState(() => timelineStore.listFor(childId))

  useEffect(() => {
    const sync = () => setCurrent(timelineStore.listFor(childId))
    sync()
    return timelineStore.subscribe(sync)
  }, [childId])

  return current
}
