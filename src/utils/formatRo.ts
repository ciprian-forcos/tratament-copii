/** Calendar + 24h clock in Romanian order: 01.09.2026 16:18 */
export function formatRoDateTime(date: Date): string {
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(date)
    .replace(',', '')
}

export function parseDatetimeLocal(value: string): Date | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}
