export const SKINS = [
  { id: 'grec', label: 'Grec' },
  { id: 'mario', label: 'Mario' },
  { id: 'leu', label: 'Leu' },
  { id: 'patrula', label: 'Patrulă' },
  { id: 'dragon', label: 'Dragon' },
  { id: 'bluey', label: 'Bluey' },
  { id: 'burete', label: 'Burete' },
  { id: 'paianjen', label: 'Păianjen' },
  { id: 'sonic', label: 'Sonic' },
  { id: 'moana', label: 'Moana' },
  { id: 'pokemon', label: 'Poké' },
] as const

export type SkinId = (typeof SKINS)[number]['id']

const SKIN_KEY = 'tratament-copii-skin'

export function readSkin(raw: string | null): SkinId {
  const found = SKINS.find((skin) => skin.id === raw)
  return found ? found.id : 'grec'
}

export function loadSkin(): SkinId {
  try {
    return readSkin(localStorage.getItem(SKIN_KEY))
  } catch {
    return 'grec'
  }
}

export function saveSkin(id: SkinId) {
  try {
    localStorage.setItem(SKIN_KEY, id)
  } catch {
    /* ignore */
  }
}
