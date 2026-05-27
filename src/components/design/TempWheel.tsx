import { useEffect, useRef, useState } from 'react'

interface WheelProps<T extends number> {
  values: T[]
  value: T
  onChange: (v: T) => void
  width?: number
  height?: number
  itemH?: number
}

function Wheel<T extends number>({ values, value, onChange, width = 80, height = 200, itemH = 44 }: WheelProps<T>) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [scrolling, setScrolling] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const i = values.indexOf(value)
    if (i < 0) return
    el.scrollTo({ top: i * itemH, behavior: 'auto' })
  }, [value, values, itemH])

  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onScroll = () => {
    const el = ref.current
    if (!el) return
    setScrolling(true)
    if (snapTimer.current) clearTimeout(snapTimer.current)
    snapTimer.current = setTimeout(() => {
      const i = Math.round(el.scrollTop / itemH)
      const v = values[Math.max(0, Math.min(values.length - 1, i))]
      el.scrollTo({ top: i * itemH, behavior: 'smooth' })
      setScrolling(false)
      if (v !== value) onChange(v)
    }, 120)
  }

  const pad = (height - itemH) / 2

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        WebkitMaskImage:
          'linear-gradient(180deg, transparent 0%, #000 22%, #000 78%, transparent 100%)',
        maskImage:
          'linear-gradient(180deg, transparent 0%, #000 22%, #000 78%, transparent 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -6,
          right: -6,
          top: pad,
          height: itemH,
          borderTop: '1.5px solid var(--accent)',
          borderBottom: '1.5px solid var(--accent)',
          background: 'rgba(245,177,74,0.06)',
          pointerEvents: 'none',
          borderRadius: 0,
        }}
      />
      <div
        ref={ref}
        onScroll={onScroll}
        style={{
          width,
          height,
          overflowY: 'auto',
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
        }}
      >
        <div style={{ height: pad }} />
        {values.map((v) => (
          <div
            key={String(v)}
            onClick={() => {
              ref.current?.scrollTo({ top: values.indexOf(v) * itemH, behavior: 'smooth' })
              setTimeout(() => onChange(v), 150)
            }}
            style={{
              height: itemH,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              scrollSnapAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 32,
              fontWeight: 500,
              color: v === value && !scrolling ? 'var(--accent)' : 'var(--ink-2)',
              transition: 'color .15s',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {String(v).padStart(v < 10 && v >= 0 ? 1 : 2, '0')}
          </div>
        ))}
        <div style={{ height: pad }} />
      </div>
    </div>
  )
}

interface TempWheelProps {
  open: boolean
  value: number
  onChange: (v: number) => void
  onClose: () => void
}

export function TempWheel({ open, value, onChange, onClose }: TempWheelProps) {
  const [intV, setIntV] = useState(Math.floor(value))
  const [decV, setDecV] = useState(Math.round((value - Math.floor(value)) * 10))

  useEffect(() => {
    if (!open) return
    setIntV(Math.floor(value))
    setDecV(Math.round((value - Math.floor(value)) * 10))
  }, [open, value])

  if (!open) return null

  const ints = Array.from({ length: 9 }, (_, i) => 35 + i)
  const decs = Array.from({ length: 10 }, (_, i) => i)
  const combined = intV + decV / 10
  const fever = combined >= 38

  const commit = () => {
    onChange(+combined.toFixed(1))
    onClose()
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: 'var(--bg-2)',
          borderTop: '1.5px solid var(--line)',
          borderRadius: '20px 20px 0 0',
          padding: '14px 18px 18px',
          color: 'var(--ink)',
          boxShadow: '0 -20px 40px rgba(0,0,0,0.45)',
        }}
      >
        <div
          style={{
            width: 38,
            height: 4,
            borderRadius: 4,
            background: 'var(--line)',
            margin: '0 auto 12px',
          }}
        />
        <div className="eyebrow" style={{ textAlign: 'center', marginBottom: 4 }}>
          temperatura · acum
        </div>
        <div
          style={{
            textAlign: 'center',
            marginBottom: 10,
            fontFamily: 'var(--font-hand)',
            fontSize: 22,
            color: fever ? 'var(--danger)' : 'var(--safe)',
          }}
        >
          {combined.toFixed(1)}°C · {combined >= 40 ? 'febră mare' : fever ? 'febră' : 'ok'}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            position: 'relative',
            margin: '4px 0 14px',
          }}
        >
          <Wheel values={ints} value={intV} onChange={setIntV} width={80} />
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 32,
              color: 'var(--ink-3)',
              transform: 'translateY(-2px)',
            }}
          >
            :
          </div>
          <Wheel values={decs} value={decV} onChange={setDecV} width={64} />
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 22,
              color: 'var(--ink-3)',
              marginLeft: 10,
              letterSpacing: '0.04em',
            }}
          >
            °C
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              minHeight: 52,
              borderRadius: 14,
              border: '1.5px solid var(--line)',
              background: 'transparent',
              color: 'var(--ink-2)',
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            Anulează
          </button>
          <button
            onClick={commit}
            style={{
              flex: 2,
              minHeight: 52,
              borderRadius: 14,
              border: '1.5px solid var(--accent)',
              background: 'var(--accent)',
              color: '#1a1207',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Salvează {combined.toFixed(1)}°C
          </button>
        </div>
      </div>
    </div>
  )
}
