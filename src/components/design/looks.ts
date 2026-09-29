/**
 * A look ("stil") is shape, depth, press feedback, motion and type.
 * A skin (skins.ts) is only colour. They combine: Material + Mario.
 */
export const LOOKS = [
  { id: 'grec', label: 'Grec' },
  { id: 'material', label: 'Material' },
  { id: 'sticla', label: 'Sticlă' },
  { id: 'joaca', label: 'Joacă' },
  { id: 'bursa', label: 'Bursă' },
] as const

export type LookId = (typeof LOOKS)[number]['id']

const LOOK_KEY = 'tratament-copii-look'

export function readLook(raw: string | null): LookId {
  const found = LOOKS.find((look) => look.id === raw)
  return found ? found.id : 'grec'
}

export function loadLook(): LookId {
  try {
    return readLook(localStorage.getItem(LOOK_KEY))
  } catch {
    return 'grec'
  }
}

export function saveLook(id: LookId) {
  try {
    localStorage.setItem(LOOK_KEY, id)
  } catch {
    /* ignore */
  }
}
