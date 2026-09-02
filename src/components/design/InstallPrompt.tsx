import { useEffect, useRef, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
}

function isStandaloneDisplay() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

/** PWA install control. Lives on Copii so it does not sit on the fever CTA. */
export function InstallPrompt() {
  const installPrompt = useRef<BeforeInstallPromptEvent | null>(null)
  const [manualInstallOpen, setManualInstallOpen] = useState(false)
  const [standalone, setStandalone] = useState(isStandaloneDisplay)

  useEffect(() => {
    setStandalone(isStandaloneDisplay())
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      installPrompt.current = event as BeforeInstallPromptEvent
      setManualInstallOpen(false)
    }
    const onInstalled = () => {
      setStandalone(true)
      installPrompt.current = null
      setManualInstallOpen(false)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (standalone) return null

  function handleInstall() {
    if (installPrompt.current) {
      const prompt = installPrompt.current
      installPrompt.current = null
      void prompt.prompt()
      return
    }
    setManualInstallOpen((open) => !open)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button
        type="button"
        onClick={handleInstall}
        style={{
          padding: '11px 13px',
          borderRadius: 14,
          border: '1.5px solid var(--line)',
          background: 'var(--bg-3)',
          color: 'var(--ink-2)',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Instalează aplicația
      </button>
      {manualInstallOpen && (
        <div
          style={{
            padding: '10px 12px',
            borderRadius: 12,
            border: '1.5px dashed var(--line)',
            background: 'var(--bg-2)',
            color: 'var(--ink-3)',
            fontSize: 13,
            lineHeight: 1.35,
          }}
        >
          Adaugă pe ecranul principal din meniul browserului.
        </div>
      )}
    </div>
  )
}
