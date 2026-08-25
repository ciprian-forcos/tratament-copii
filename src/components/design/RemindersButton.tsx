export function RemindersButton({
  enabled,
  onEnable,
  onDisable,
}: {
  enabled: boolean
  onEnable: () => void
  onDisable: () => void
}) {
  return (
    <button
      type="button"
      onClick={() => (enabled ? onDisable() : void onEnable())}
      style={{
        padding: '8px 12px',
        borderRadius: 12,
        border: `1.5px solid ${enabled ? 'var(--safe)' : 'var(--line)'}`,
        background: enabled ? 'rgba(116,198,157,0.12)' : 'var(--bg-3)',
        color: enabled ? 'var(--safe)' : 'var(--ink-2)',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {enabled ? 'Amintiri on' : 'Amintește-mi'}
    </button>
  )
}
