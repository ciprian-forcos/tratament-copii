/** Wording pending Chief approval — indicative manufacturer-leaflet calculation, not a prescription. */
export const MEDICAL_DISCLAIMER_RO =
  'Dozele sunt orientative, calculate după prospectele producătorilor. Nu înlocuiesc consultul pediatric. În caz de îndoială sau dacă febra persistă, sună medicul.'

export function MedicalDisclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <p
      role="note"
      style={{
        margin: compact ? '8px 0 0' : '10px 0 0',
        padding: compact ? '8px 10px' : '10px 12px',
        borderRadius: 12,
        border: '1.5px dashed var(--line)',
        background: 'var(--bg-3)',
        color: 'var(--ink-3)',
        fontSize: compact ? 11 : 12,
        lineHeight: 1.4,
      }}
    >
      {MEDICAL_DISCLAIMER_RO}
    </p>
  )
}
