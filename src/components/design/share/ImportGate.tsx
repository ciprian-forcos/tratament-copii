import { type ReactNode, useEffect, useState } from 'react'
import { childStore } from '../childStore'
import { loadMedications, notifyMedicationsChanged, saveMedications } from '../medicineStorage'
import { decodeShare, ShareDecodeError } from './encoder'
import { mergeChildren, mergeMedications } from './merge'
import type { MergeSummary } from './merge'
import type { SharePayload } from './types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type GateState =
  | { status: 'idle' }
  | { status: 'confirm'; payload: SharePayload; summary: MergeSummary }
  | { status: 'error'; message: string }

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function cleanUrl() {
  window.history.replaceState(null, '', window.location.pathname)
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  children: ReactNode
}

/**
 * ImportGate — wraps the app root and intercepts `?import=...` in the URL.
 *
 * On mount it scans `window.location.search`:
 * - Absent → renders children normally, no overlay.
 * - Present + decodable → renders children PLUS a confirm sheet showing a
 *   dry-run merge summary.  "Importă" applies the merge and cleans the URL.
 *   "Anulează" closes and cleans the URL without applying.
 * - Undecodable → error sheet with "Închide" that also cleans the URL.
 *
 * The overlay is rendered inside `.phone-inner` (the parent) so the phone
 * bezel contains it on desktop, matching the visual language of other sheets.
 */
export function ImportGate({ children }: Props) {
  const [gateState, setGateState] = useState<GateState>({ status: 'idle' })

  useEffect(() => {
    const search = window.location.search
    if (!search) return

    const params = new URLSearchParams(search)
    const importParam = params.get('import')
    if (!importParam) return

    try {
      const payload = decodeShare(decodeURIComponent(importParam))

      // Dry-run: compute merge summary against current local state
      const local = childStore.get().children
      const { summary } = mergeChildren(local, payload.children)

      setGateState({ status: 'confirm', payload, summary })
    } catch (e) {
      const msg =
        e instanceof ShareDecodeError
          ? e.message
          : 'Formatul linkului nu este recunoscut.'
      setGateState({ status: 'error', message: msg })
    }
  }, [])

  function handleImport() {
    if (gateState.status !== 'confirm') return
    const { payload } = gateState

    // Apply children merge
    const local = childStore.get().children
    const { merged } = mergeChildren(local, payload.children)
    childStore.setState((s) => ({ ...s, children: merged }))

    // Apply medications merge if payload carries them
    if (payload.medications && payload.medications.length > 0) {
      const localMeds = loadMedications()
      const mergedMeds = mergeMedications(localMeds, payload.medications)
      saveMedications(mergedMeds)
      notifyMedicationsChanged()
    }

    cleanUrl()
    setGateState({ status: 'idle' })
  }

  function handleCancel() {
    cleanUrl()
    setGateState({ status: 'idle' })
  }

  function handleClose() {
    cleanUrl()
    setGateState({ status: 'idle' })
  }

  return (
    <>
      {children}

      {gateState.status === 'confirm' && (
        <ConfirmSheet
          summary={gateState.summary}
          onImport={handleImport}
          onCancel={handleCancel}
        />
      )}

      {gateState.status === 'error' && (
        <ErrorSheet onClose={handleClose} />
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface ConfirmSheetProps {
  summary: MergeSummary
  onImport: () => void
  onCancel: () => void
}

function ConfirmSheet({ summary, onImport, onCancel }: ConfirmSheetProps) {
  const hasChanges = summary.added.length > 0 || summary.updated.length > 0

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 60,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxHeight: '90%',
          overflowY: 'auto',
          background: 'var(--bg-2)',
          borderTop: '1.5px solid var(--line)',
          borderRadius: '20px 20px 0 0',
          padding: '14px 18px 18px',
          color: 'var(--ink)',
          boxShadow: '0 -20px 40px rgba(0,0,0,0.45)',
        }}
      >
        {/* Grabber */}
        <div
          style={{
            width: 38,
            height: 4,
            borderRadius: 4,
            background: 'var(--line)',
            margin: '0 auto 12px',
          }}
        />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 16,
          }}
        >
          <div>
            <div className="eyebrow" style={{ color: 'var(--accent)' }}>
              primești date
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>
              Importă date partajate
            </div>
          </div>
          <button
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--ink-3)',
              fontSize: 24,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        {/* Summary */}
        {!hasChanges ? (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 14,
              border: '1.5px solid var(--line)',
              background: 'var(--bg-3)',
              marginBottom: 16,
              color: 'var(--ink-2)',
              fontSize: 14,
            }}
          >
            Nicio modificare — datele sunt deja la zi.
          </div>
        ) : (
          <div
            style={{
              marginBottom: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {summary.added.length > 0 && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 14,
                  border: '1.5px solid var(--line)',
                  background: 'var(--bg-3)',
                }}
              >
                <span
                  className="eyebrow"
                  style={{ color: 'var(--accent)', marginRight: 6 }}
                >
                  adaugă
                </span>
                <span style={{ fontSize: 14, color: 'var(--ink)' }}>
                  {summary.added.join(', ')}
                </span>
              </div>
            )}
            {summary.updated.length > 0 && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 14,
                  border: '1.5px solid var(--line)',
                  background: 'var(--bg-3)',
                }}
              >
                <span
                  className="eyebrow"
                  style={{ color: 'var(--accent)', marginRight: 6 }}
                >
                  actualizează
                </span>
                <span style={{ fontSize: 14, color: 'var(--ink)' }}>
                  {summary.updated.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              minHeight: 52,
              borderRadius: 14,
              border: '1.5px solid var(--line)',
              background: 'transparent',
              color: 'var(--ink-2)',
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            Anulează
          </button>
          <button
            onClick={onImport}
            style={{
              flex: 2,
              minHeight: 52,
              borderRadius: 14,
              border: '1.5px solid var(--accent)',
              background: 'var(--accent)',
              color: '#1a1207',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Importă
          </button>
        </div>
      </div>
    </div>
  )
}

function ErrorSheet({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 60,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: 'var(--bg-2)',
          borderTop: '1.5px solid var(--line)',
          borderRadius: '20px 20px 0 0',
          padding: '14px 18px 18px',
          color: 'var(--ink)',
          boxShadow: '0 -20px 40px rgba(0,0,0,0.45)',
        }}
      >
        {/* Grabber */}
        <div
          style={{
            width: 38,
            height: 4,
            borderRadius: 4,
            background: 'var(--line)',
            margin: '0 auto 12px',
          }}
        />

        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <div className="eyebrow" style={{ color: '#ef4444' }}>
            eroare
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>
            Link invalid
          </div>
        </div>

        <div
          style={{
            padding: '12px 14px',
            borderRadius: 14,
            border: '1.5px solid var(--line)',
            background: 'var(--bg-3)',
            marginBottom: 16,
            color: 'var(--ink-2)',
            fontSize: 14,
          }}
        >
          Linkul de import nu a putut fi decodat. Este posibil să fie incomplet
          sau corupt.
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            minHeight: 52,
            borderRadius: 14,
            border: '1.5px solid var(--line)',
            background: 'transparent',
            color: 'var(--ink-2)',
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          Închide
        </button>
      </div>
    </div>
  )
}
