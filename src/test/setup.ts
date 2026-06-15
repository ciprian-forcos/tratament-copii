import '@testing-library/jest-dom/vitest'

const store = new Map<string, string>()
const localStorageShim = {
  get length() {
    return store.size
  },
  clear() {
    store.clear()
  },
  getItem(key: string) {
    return store.get(key) ?? null
  },
  key(index: number) {
    return Array.from(store.keys())[index] ?? null
  },
  removeItem(key: string) {
    store.delete(key)
  },
  setItem(key: string, value: string) {
    store.set(key, String(value))
  },
}

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageShim,
  configurable: true,
})

Object.defineProperty(window, 'localStorage', {
  value: localStorageShim,
  configurable: true,
})
