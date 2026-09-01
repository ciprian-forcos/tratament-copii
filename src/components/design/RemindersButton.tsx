import { useState } from 'react'

export function RemindersButton({
  enabled,
  onEnable,
  onDisable,
}: {
  enabled: boolean
  onEnable: () => boolean | Promise<boolean>
  onDisable: () => void
}) {
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    if (enabled) {
      onDisable()
      setError(null)
      return
    }
    const ok = await onEnable()
    if (ok) {
      setError(null)
      return
    }
    const denied =
      typeof Notification !== 'undefined' && Notification.permission === 'denied'
    setError(
      denied
        ? 'Permisiunea de notificări e refuzată. Activeaz-o din setările browserului.'
        : 'Nu am putut activa amintirile. Verifică permisiunea de notificări.',
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, maxWidth: 160 }}>
      <button
        type="button"
        onClick={() => void handleClick()}
        style={{
          padding: '8px 10px',
          borderRadius: 12,
          border: `1.5px solid ${enabled ? 'var(--safe)' : 'var(--line)'}`,
          background: enabled ? 'rgba(116,198,157,0.12)' : 'var(--bg-3)',
          color: enabled ? 'var(--safe)' : 'var(--ink-2)',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {enabled ? 'Amintiri on' : 'Amintiri'}
      </button>
      {error && (
        <span role="alert" style={{ fontSize: 10, color: 'var(--danger)', lineHeight: 1.3, textAlign: 'right' }}>
          {error}
        </span>
      )}
    </div>
  )
}
