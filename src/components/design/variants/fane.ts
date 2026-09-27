const DAYS = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă']
const MONTHS = ['ian', 'feb', 'mar', 'apr', 'mai', 'iun', 'iul', 'aug', 'sept', 'oct', 'nov', 'dec']

/** "Luni 5 sept" — a fine day mark on the tape. */
export function dayTickLabel(date: Date): string {
  return `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`
}

/** Local midnights that fall inside the visible window. */
export function dayTicks(from: Date, to: Date): Date[] {
  const ticks: Date[] = []
  const cursor = new Date(from)
  cursor.setHours(0, 0, 0, 0)
  if (cursor.getTime() < from.getTime()) cursor.setDate(cursor.getDate() + 1)
  while (cursor.getTime() < to.getTime()) {
    ticks.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return ticks
}

export function splitAmount(label?: string): { n: number; unit: string } {
  if (!label || label.startsWith('Sub')) return { n: 1, unit: 'doză' }
  const match = /^([\d.]+)\s*(.*)$/.exec(label.trim())
  if (!match) return { n: 1, unit: label }
  return { n: Number(match[1]), unit: match[2] }
}

/** Scrolled into the future (now left the left edge) → jump chip. */
export function acumChip(nowPct: number): '<< acum' | 'acum >>' | null {
  if (nowPct < 0) return '<< acum'
  if (nowPct > 100) return 'acum >>'
  return null
}

export function stepAmount(n: number, direction: 1 | -1): number {
  const next = Math.round((n + direction) * 10) / 10
  return Math.max(0, next)
}
