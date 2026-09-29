import type { MedicationForm } from '../types'

export type GlyphName = MedicationForm | 'temperatura' | 'nota' | 'plus' | 'setari'

/** Fir's own pictograms: 24×24, one stroke weight, currentColor. */
const PATHS: Record<GlyphName, string> = {
  sirop: 'M9.5 2.5h5v3l2.5 3.5v11.5a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1V9l2.5-3.5z M7 13.5h10',
  picaturi: 'M12 2.8c3.2 4.3 6.2 7.8 6.2 11.4a6.2 6.2 0 0 1-12.4 0c0-3.6 3-7.1 6.2-11.4z M9.3 14.6a2.8 2.8 0 0 0 2.4 2.6',
  spray: 'M8.5 9h7v11a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 8.5 20z M10 9V5.5h4V9 M14 6.5h3.5 M19.5 4.5v.01 M19.5 8.5v.01',
  supozitor: 'M8 20.5v-9c0-3.6 1.8-7 4-8 2.2 1 4 4.4 4 8v9z M8 16h8',
  temperatura: 'M10 4.2a2 2 0 0 1 4 0v9.6a4.2 4.2 0 1 1-4 0z M12 15.5V9',
  nota: 'M4.5 5.5h15a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-4.5 3.5v-3.5h-1a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z M8 9.5h8 M8 12.5h5',
  plus: 'M12 5v14 M5 12h14',
  setari: 'M4 7h9 M17 7h3 M4 17h3 M11 17h9 M15 4.5v5 M9 14.5v5',
}

export function Glyph({ name, size = 24, label }: { name: GlyphName; size?: number; label?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
