import { useEffect, useState } from 'react'
import { isPanicActive, loadPanicPref, savePanicPref, type PanicPref } from './panicPref'

export function usePanicPref() {
  const [pref, setPrefState] = useState<PanicPref>(loadPanicPref)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  function setPref(next: PanicPref) {
    savePanicPref(next)
    setPrefState(next)
  }

  return {
    pref,
    setPref,
    panic: isPanicActive(pref, now),
  }
}
