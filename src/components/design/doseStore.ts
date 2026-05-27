import type { AdministeredDose } from '../../types'

const STORAGE_KEY = 'tratament-copii-administered-doses'

type Listener = () => void

let doses: AdministeredDose[] = []
let listeners = new Set<Listener>()

function loadFromStorage(): AdministeredDose[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
    return []
  } catch {
    return []
  }
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doses))
  } catch {
    // quota exceeded or other storage error — swallow
  }
}

function notify() {
  listeners.forEach((fn) => fn())
}

export const doseStore = {
  record(input: Omit<AdministeredDose, 'id'>): AdministeredDose {
    const record: AdministeredDose = {
      ...input,
      id: 'd' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6),
    }
    doses = [...doses, record]
    saveToStorage()
    notify()
    return record
  },

  list(): AdministeredDose[] {
    return [...doses]
  },

  listFor(childId: string, options?: { since?: Date; until?: Date }): AdministeredDose[] {
    let result = doses.filter((d) => d.childId === childId)

    if (options?.since) {
      result = result.filter((d) => new Date(d.administeredAt) >= options.since!)
    }
    if (options?.until) {
      result = result.filter((d) => new Date(d.administeredAt) < options.until!)
    }

    return result
  },

  clear() {
    doses = []
    localStorage.removeItem(STORAGE_KEY)
    notify()
  },

  subscribe(fn: Listener): () => void {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },

  // internal helper for tests / reload simulation
  reloadFromStorage() {
    doses = loadFromStorage()
  },
}

// Initialize from storage on first import
doses = loadFromStorage()