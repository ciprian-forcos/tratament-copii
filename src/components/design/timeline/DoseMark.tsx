import type { ReactNode } from 'react'
import { FRESH_MARK_MS, NEXT_RING_PATH } from './markShapes'

/** True for a given dose confirmed recently enough to spring into place. */
export function isFresh(at: Date, now: Date, future: boolean) {
  return !future && now.getTime() - at.getTime() < FRESH_MARK_MS
}

/**
 * The dot on the tape. Classes only: each look restyles them in CSS
 * (Material's turning cookie, Sticlă's lens, Grec's plain ring).
 */
export function DoseDot({ future, isNext, fresh }: { future: boolean; isNext: boolean; fresh: boolean }) {
  if (isNext) {
    return (
      <NextMark>
        <svg className="tl-next-ring" viewBox="-12 -12 24 24" width={24} height={24}>
          <path className="tl-next-shape" d={NEXT_RING_PATH} />
        </svg>
      </NextMark>
    )
  }
  return (
    <div
      aria-hidden="true"
      className={['tl-dot', future ? 'tl-dot--future' : 'tl-dot--given', fresh ? 'tl-dot--fresh' : ''].join(' ')}
    />
  )
}

/** The next-dose treatment around any mark (a ring, or Edi's capsule). */
export function NextMark({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <span className={`tl-next pulse-dot${wide ? ' tl-next--wide' : ''}`} aria-hidden="true">
      {children}
    </span>
  )
}
