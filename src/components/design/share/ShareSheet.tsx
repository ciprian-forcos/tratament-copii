import { useState } from 'react'
import { activeChild, ageWords, useChildren } from '../childStore'
import { customMedicationsForShare } from '../medicineStorage'
import { buildShareUrl } from './encoder'
import type { SharePayload } from './types'

interface Props {
  open: boolean
  onClose: () => void
}

/**
 * ShareSheet — bottom sheet for sharing child profile(s) via a URL.
 * Follows the same visual vocabulary as ChildEditor and TempWheel:
 * backdrop blur, grabber, eyebrow, var(--*) tokens.
 */
export function ShareSheet({ open, onClose }: Props) {
  const state = useChildren()
  const active = activeChild(state)

  // Per-child selection: default = only active child checked
  const [selected, setSelected] = useState<Set<string>>(() => new Set([active.id]))
  const [shareAll, setShareAll] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  if (!open) return null

  function toggleChild(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
    // Reset generated URL whenever selection changes
    setGeneratedUrl(null)
    setCopied(false)
  }

  function toggleShareAll() {
    setShareAll((v) => !v)
    setGeneratedUrl(null)
    setCopied(false)
  }

  function handleClose() {
    // Reset state on close
    setSelected(new Set([active.id]))
    setShareAll(false)
    setGeneratedUrl(null)
    setCopied(false)
    onClose()
  }

  function handleGenerate() {
    const childrenToShare = shareAll
      ? state.children
      : state.children.filter((c) => selected.has(c.id))

    const customMeds = shareAll ? customMedicationsForShare() : undefined

    const payload: SharePayload = {
      v: 1,
      children: childrenToShare,
      ...(customMeds ? { medications: customMeds } : {}),
      sentAt: new Date().toISOString(),
    }

    const url = buildShareUrl(payload)
    setGeneratedUrl(url)
    setCopied(false)
  }

  async function handleCopy() {
    if (!generatedUrl) return
    await navigator.clipboard.writeText(generatedUrl)
    setCopied(true)
  }

  async function handleNativeShare() {
    if (!generatedUrl || !navigator.share) return
    try {
      await navigator.share({ url: generatedUrl })
    } catch {
      // User cancelled or share failed — silently ignore
    }
  }

  const hasSelection = shareAll || selected.size > 0
  const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  return (
    <div
      data-testid="share-sheet-backdrop"
      onClick={handleClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
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
              distribuie
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>
              Partajează profilul
            </div>
          </div>
          <button
            onClick={handleClose}
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

        {/* Per-child checkboxes */}
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          selectează copii
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {state.children.map((child) => {
            const isChecked = selected.has(child.id)
            const isDisabled = shareAll
            return (
              <label
                key={child.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: 14,
                  border: `1.5px solid ${isChecked && !isDisabled ? 'var(--accent)' : 'var(--line)'}`,
                  background: isChecked && !isDisabled
                    ? 'rgba(245,177,74,0.07)'
                    : 'var(--bg-3)',
                  opacity: isDisabled ? 0.45 : 1,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={() => toggleChild(child.id)}
                  style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
                />
                {/* Avatar chip */}
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    background: 'var(--bg-2)',
                    border: '1.5px solid var(--line)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-hand)',
                    fontSize: 16,
                    color: isChecked && !isDisabled ? 'var(--accent)' : 'var(--ink-2)',
                    flex: '0 0 auto',
                  }}
                >
                  {child.initial ?? child.name.trim()[0]?.toUpperCase() ?? '?'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>
                    {child.name}
                  </div>
                  <div className="eyebrow" style={{ color: 'var(--ink-3)', marginTop: 1 }}>
                    {ageWords(child)} · {child.weight} kg
                  </div>
                </div>
                {child.id === state.activeId && (
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--accent)',
                      background: 'rgba(245,177,74,0.15)',
                      borderRadius: 6,
                      padding: '1px 6px',
                      letterSpacing: '0.05em',
                    }}
                  >
                    activ
                  </span>
                )}
              </label>
            )
          })}
        </div>

        {/* "Trimite toată aplicația" toggle */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 14px',
            borderRadius: 14,
            border: `1.5px solid ${shareAll ? 'var(--accent)' : 'var(--line)'}`,
            background: shareAll ? 'rgba(245,177,74,0.07)' : 'var(--bg-3)',
            cursor: 'pointer',
            marginBottom: 16,
          }}
        >
          <input
            type="checkbox"
            aria-label="Trimite toată aplicația"
            checked={shareAll}
            onChange={toggleShareAll}
            style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>
              Trimite toată aplicația
            </div>
            <div className="eyebrow" style={{ color: 'var(--ink-3)', marginTop: 1 }}>
              toți copiii + medicamente personalizate
            </div>
          </div>
        </label>

        {/* Generated URL section */}
        {generatedUrl && (
          <div
            style={{
              marginBottom: 16,
              padding: '12px 14px',
              borderRadius: 14,
              border: '1.5px solid var(--line)',
              background: 'var(--bg-3)',
            }}
          >
            <div className="eyebrow" style={{ marginBottom: 6 }}>
              linkul tău
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                readOnly
                value={generatedUrl}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: 10,
                  border: '1.5px solid var(--line)',
                  background: 'var(--bg-3)',
                  color: 'var(--ink-2)',
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                onClick={handleCopy}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 10,
                  border: '1.5px solid var(--line)',
                  background: copied ? 'rgba(245,177,74,0.10)' : 'var(--bg-2)',
                  color: copied ? 'var(--accent)' : 'var(--ink-2)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {copied ? 'Copiat!' : 'Copiază'}
              </button>
              {hasNativeShare && (
                <button
                  onClick={handleNativeShare}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 10,
                    border: '1.5px solid var(--accent)',
                    background: 'rgba(245,177,74,0.08)',
                    color: 'var(--accent)',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Partajează
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleClose}
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
            onClick={handleGenerate}
            disabled={!hasSelection}
            style={{
              flex: 2,
              minHeight: 52,
              borderRadius: 14,
              border: '1.5px solid var(--accent)',
              background: hasSelection ? 'var(--accent)' : 'var(--bg-3)',
              color: hasSelection ? '#1a1207' : 'var(--ink-3)',
              fontSize: 15,
              fontWeight: 700,
              cursor: hasSelection ? 'pointer' : 'not-allowed',
              opacity: hasSelection ? 1 : 0.6,
            }}
          >
            Generează linkul
          </button>
        </div>
      </div>
    </div>
  )
}
