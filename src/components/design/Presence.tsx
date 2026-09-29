import { useEffect, useState, type ReactNode } from 'react'

/** Matches the longest --dur-sheet-out a look sets in src/index.css. */
export const EXIT_MS = 240

/**
 * Keeps the last shown children on screen for EXIT_MS after `show` turns
 * false, inside `.ui-exit`, so a sheet can animate out instead of vanishing.
 * The leaving copy ignores taps.
 */
export function Presence({ show, children }: { show: boolean; children: ReactNode }) {
  const [kept, setKept] = useState<ReactNode>(show ? children : null)
  const [prevShow, setPrevShow] = useState(show)
  const [leaving, setLeaving] = useState(false)

  if (show && kept !== children) setKept(children)
  if (prevShow !== show) {
    setPrevShow(show)
    setLeaving(!show)
  }

  useEffect(() => {
    if (!leaving) return
    const id = window.setTimeout(() => setLeaving(false), EXIT_MS)
    return () => window.clearTimeout(id)
  }, [leaving])

  if (show) return <>{children}</>
  if (leaving) {
    return (
      <div className="ui-exit" aria-hidden="true">
        {kept}
      </div>
    )
  }
  return null
}
