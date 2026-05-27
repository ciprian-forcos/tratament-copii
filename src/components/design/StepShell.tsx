import type { ReactNode } from 'react'
import { StatusBar } from './StatusBar'

interface Props {
  step: 1 | 2 | 3
  title: string
  hint?: string
  children: ReactNode
  onBack: () => void
  onNext: () => void
  ctaLabel?: string
  ctaDisabled?: boolean
}

export function StepShell({
  step,
  title,
  hint,
  children,
  onBack,
  onNext,
  ctaLabel = 'Continuă',
  ctaDisabled = false,
}: Props) {
  return (
    <div className="phone">
      <StatusBar />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px 4px',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--ink-2)',
            fontSize: 22,
            cursor: 'pointer',
            padding: '8px 10px',
          }}
        >
          ←
        </button>
        <div className="progress" style={{ flex: 1 }}>
          <span className={step >= 1 ? (step > 1 ? 'done' : 'active') : ''} />
          <span className={step >= 2 ? (step > 2 ? 'done' : 'active') : ''} />
          <span className={step >= 3 ? 'active' : ''} />
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ padding: '14px 22px 0' }}>
        <div className="eyebrow">pas {step} din 3</div>
        <h1
          style={{
            fontSize: 30,
            lineHeight: 1.08,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: '6px 0 4px',
            color: 'var(--ink)',
          }}
        >
          {title}
        </h1>
        {hint && (
          <div className="hand" style={{ fontSize: 22, color: 'var(--ink-2)' }}>
            {hint}
          </div>
        )}
      </div>

      <div
        style={{
          flex: 1,
          padding: '20px 22px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        {children}
      </div>

      <div style={{ padding: '0 18px 22px' }}>
        <button
          className="btn-primary"
          style={ctaDisabled ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
          onClick={ctaDisabled ? undefined : onNext}
        >
          {ctaLabel} <span className="arrow">→</span>
        </button>
      </div>
    </div>
  )
}
