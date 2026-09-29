import { useRef } from 'react'
import type { Child } from '../types'
import { useTimelineFacts } from '../components/design/timeline/store'
import { moodFor, type Mood } from './mood'

const SKIN = ['#f4c7a1', '#e8b48a', '#d49a6a', '#b97b52', '#f2d3b3', '#8d5a3b']

function skinFor(child: Child) {
  let h = 0
  for (const ch of child.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return child.color ?? SKIN[h % SKIN.length]
}

/** Edi's pictogram child: a face whose mood follows the thread. */
export function FaceGlyph({ child, mood, size = 44 }: { child: Child; mood: Mood; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" data-mood={mood} aria-hidden="true" className="fir-face-svg">
      <circle cx="24" cy="24" r="21" fill={skinFor(child)} />
      <path d="M8 18c2-9 9-14 16-14s14 5 16 14c-4-4-8-5-10-8-3 4-12 6-22 8z" className="fir-face-hair" />
      {mood === 'somn' ? (
        <>
          <path d="M14.5 25q3 2.5 6 0 M27.5 25q3 2.5 6 0" className="fir-face-line" />
          <path d="M20 34q4 1.5 8 0" className="fir-face-line" />
        </>
      ) : (
        <>
          <circle cx="17.5" cy="24.5" r="2.4" className="fir-face-eye" />
          <circle cx="30.5" cy="24.5" r="2.4" className="fir-face-eye" />
          {mood === 'febra' ? (
            <>
              <ellipse cx="13" cy="30.5" rx="3.6" ry="2.3" className="fir-face-flush" />
              <ellipse cx="35" cy="30.5" rx="3.6" ry="2.3" className="fir-face-flush" />
              <path d="M18.5 35.5q2.75-2.2 5.5 0t5.5 0" className="fir-face-line" />
            </>
          ) : (
            <path d="M17.5 32q6.5 5.5 13 0" className="fir-face-line" />
          )}
        </>
      )}
    </svg>
  )
}

function Face({
  child,
  active,
  now,
  onPick,
  onEdit,
}: {
  child: Child
  active: boolean
  now: Date
  onPick: () => void
  onEdit: () => void
}) {
  const facts = useTimelineFacts(child.id)
  const mood = moodFor(facts, now)
  const timer = useRef<number | null>(null)
  const held = useRef(false)

  function cancel() {
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = null
  }

  return (
    <button
      type="button"
      className={`fir-face${active ? ' is-active' : ''}`}
      aria-pressed={active}
      aria-label={child.name}
      onPointerDown={() => {
        held.current = false
        cancel()
        timer.current = window.setTimeout(() => {
          held.current = true
          onEdit()
        }, 550)
      }}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onContextMenu={(e) => {
        e.preventDefault()
        cancel()
        onEdit()
      }}
      onClick={() => {
        if (!held.current) onPick()
      }}
    >
      <FaceGlyph child={child} mood={mood} />
      {active && <span className="fir-face-name">{child.name}</span>}
    </button>
  )
}

export function Faces({
  childList,
  activeId,
  now,
  onPick,
  onEdit,
  onAdd,
}: {
  childList: Child[]
  activeId: string
  now: Date
  onPick: (id: string) => void
  onEdit: (id: string) => void
  onAdd: () => void
}) {
  return (
    <div className="fir-faces" role="group" aria-label="copii">
      {childList.map((c) => (
        <Face
          key={c.id}
          child={c}
          active={c.id === activeId}
          now={now}
          onPick={() => onPick(c.id)}
          onEdit={() => onEdit(c.id)}
        />
      ))}
      <button type="button" className="fir-face fir-face--add" aria-label="adaugă copil" onClick={onAdd}>
        <span>+</span>
      </button>
    </div>
  )
}
