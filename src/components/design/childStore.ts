import { useEffect, useState } from 'react'
import { DEFAULT_MEDICATIONS } from '../../data/medications'
import type { Child } from '../../types'

const DEFAULT_ENABLED = DEFAULT_MEDICATIONS.map((m) => m.id)

/**
 * Replaces the design's window.childStore: a singleton, reactive,
 * localStorage-backed children list with an activeId pointer.
 *
 * We keep the existing legacy localStorage keys used by the old tabs
 * (`tratament-copii-children`, `tratament-copii-active-child`) so data
 * survives the redesign.
 */

const CHILDREN_KEY = 'tratament-copii-children'
const ACTIVE_KEY = 'tratament-copii-active-child'

export interface ChildState {
  children: Child[]
  activeId: string | null
}

function loadInitial(): ChildState {
  try {
    const raw = window.localStorage.getItem(CHILDREN_KEY)
    const children = raw ? (JSON.parse(raw) as Child[]) : []
    const activeRaw = window.localStorage.getItem(ACTIVE_KEY)
    const activeId = activeRaw ? (JSON.parse(activeRaw) as string | null) : null

    if (children.length === 0) {
      const seed: Child = {
        id: 'maya',
        name: 'Maya',
        weight: 13,
        years: 2,
        months: 4,
        initial: 'M',
        enabledMedications: DEFAULT_ENABLED,
      }
      return { children: [seed], activeId: seed.id }
    }
    return {
      children,
      activeId: activeId ?? children[0]?.id ?? null,
    }
  } catch {
    return { children: [], activeId: null }
  }
}

type Listener = (s: ChildState) => void

const listeners = new Set<Listener>()
let state: ChildState = loadInitial()

function persist() {
  try {
    window.localStorage.setItem(CHILDREN_KEY, JSON.stringify(state.children))
    window.localStorage.setItem(ACTIVE_KEY, JSON.stringify(state.activeId))
  } catch {
    /* ignore */
  }
}

function emit() {
  persist()
  listeners.forEach((l) => l(state))
}

export const childStore = {
  get: () => state,
  setState(patch: ChildState | ((s: ChildState) => ChildState)) {
    state = typeof patch === 'function' ? (patch as (s: ChildState) => ChildState)(state) : { ...state, ...patch }
    emit()
  },
  setActive(id: string) {
    state = { ...state, activeId: id }
    emit()
  },
  patchActive(patch: Partial<Child>) {
    state = {
      ...state,
      children: state.children.map((c) => (c.id === state.activeId ? { ...c, ...patch } : c)),
    }
    emit()
  },
  add(): string {
    const id = 'c' + Date.now().toString(36)
    const fresh: Child = {
      id,
      name: 'Copil nou',
      years: 1,
      months: 0,
      weight: 9,
      initial: '?',
      enabledMedications: DEFAULT_ENABLED,
    }
    state = { ...state, activeId: id, children: [...state.children, fresh] }
    emit()
    return id
  },
  remove(id: string) {
    if (state.children.length <= 1) return
    const rest = state.children.filter((c) => c.id !== id)
    state = {
      ...state,
      children: rest,
      activeId: state.activeId === id ? rest[0].id : state.activeId,
    }
    emit()
  },
}

export function useChildren(): ChildState {
  const [snap, setSnap] = useState<ChildState>(() => childStore.get())
  useEffect(() => {
    const l: Listener = (s) => setSnap(s)
    listeners.add(l)
    setSnap(childStore.get())
    return () => {
      listeners.delete(l)
    }
  }, [])
  return snap
}

export function activeChild(s: ChildState): Child {
  return s.children.find((c) => c.id === s.activeId) ?? s.children[0]
}

export function ageWords(c: Pick<Child, 'years' | 'months'>): string {
  const y = c.years ?? 0
  const m = c.months ?? 0
  if (y === 0) return `${m} ${m === 1 ? 'lună' : 'luni'}`
  if (m === 0) return `${y} ${y === 1 ? 'an' : 'ani'}`
  return `${y} ${y === 1 ? 'an' : 'ani'} ${m} ${m === 1 ? 'lună' : 'luni'}`
}
