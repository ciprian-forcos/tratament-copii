import { useEffect } from 'react'

export const UNDO_MS = 6000

/** Replaces "are you sure?": the action happens at once and can be taken back. */
export function UndoToast({ text, onUndo, onDone }: { text: string; onUndo: () => void; onDone: () => void }) {
  useEffect(() => {
    const id = window.setTimeout(onDone, UNDO_MS)
    return () => window.clearTimeout(id)
  }, [text, onDone])
  return (
    <div className="fir-toast" role="status">
      <span>{text}</span>
      <button type="button" className="fir-toast-undo" onClick={onUndo}>
        Anulează
      </button>
      <span className="fir-toast-timer" aria-hidden="true" />
    </div>
  )
}
