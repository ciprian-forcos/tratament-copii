import { useRef, useState } from 'react'
import { stepAmount } from '../components/design/variants/fane'

/** Fane's field: swipe down for +1, up for −1, tap to type. */
export function Amount({ n, unit, onChange }: { n: number; unit: string; onChange: (n: number) => void }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState('')
  const startY = useRef<number | null>(null)
  const dragged = useRef(false)

  function commit() {
    const value = Number(text.replace(',', '.'))
    if (!Number.isNaN(value)) onChange(Math.max(0, value))
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        aria-label="cantitate"
        className="ui-field fir-amount-input"
        inputMode="decimal"
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
        }}
      />
    )
  }

  return (
    <button
      type="button"
      className="fir-amount"
      aria-label={`cantitate ${n} ${unit}, trage pentru a schimba`}
      onPointerDown={(e) => {
        startY.current = e.clientY
        dragged.current = false
        e.currentTarget.setPointerCapture?.(e.pointerId)
      }}
      onPointerMove={(e) => {
        if (startY.current == null) return
        const dy = e.clientY - startY.current
        if (Math.abs(dy) < 16) return
        dragged.current = true
        onChange(stepAmount(n, dy > 0 ? 1 : -1))
        startY.current = e.clientY
      }}
      onPointerUp={() => {
        startY.current = null
      }}
      onClick={() => {
        if (dragged.current) return
        setText(String(n))
        setEditing(true)
      }}
    >
      <span className="fir-amount-ghost" aria-hidden="true">
        {stepAmount(n, -1)}
      </span>
      <span className="fir-amount-value">
        {String(n).replace('.', ',')} <small>{unit}</small>
      </span>
      <span className="fir-amount-ghost" aria-hidden="true">
        {stepAmount(n, 1)}
      </span>
    </button>
  )
}
