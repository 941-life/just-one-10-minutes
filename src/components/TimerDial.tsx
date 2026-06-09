import { type KeyboardEvent, type ReactNode } from 'react'
import { useDialDrag } from '@/hooks/useDialDrag'
import type { TimerPhase } from '@/lib/theme'

const SIZE = 280
const CX = 140
const CY = 140
const R_ARC = 100
const R_FACE = 82
const R_KNOB = 30
const CIRCUMFERENCE = 2 * Math.PI * R_ARC
const TICK_COUNT = 12
const LABELS = [30, 60]

interface Props {
  progress: number
  isRunning?: boolean
  phase: TimerPhase
  selectedMinutes: number
  onToggle: () => void
  onDragSet: (minutes: number) => void
  children: ReactNode
}

export default function TimerDial({
  progress,
  phase,
  selectedMinutes,
  onToggle,
  onDragSet,
  children,
}: Props) {
  const isDraggable = phase === 'idle' || phase === 'paused'

  const { svgRef, dragging, onPointerDown, onPointerMove, onPointerUp } = useDialDrag({
    onSet: onDragSet,
    enabled: isDraggable,
  })

  const clampedProgress = Math.max(0, Math.min(1, progress))
  const dashOffset = (1 - clampedProgress) * CIRCUMFERENCE

  const handleAngle = clampedProgress * 2 * Math.PI - Math.PI / 2
  const handleX = CX + R_ARC * Math.cos(handleAngle)
  const handleY = CY + R_ARC * Math.sin(handleAngle)
  const bubbleX = CX + (R_ARC + 34) * Math.cos(handleAngle)
  const bubbleY = CY + (R_ARC + 34) * Math.sin(handleAngle)

  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => {
    const angle = (i / TICK_COUNT) * 2 * Math.PI - Math.PI / 2
    const r1 = R_ARC + 13
    const r2 = R_ARC + 20
    return {
      x1: CX + r1 * Math.cos(angle),
      y1: CY + r1 * Math.sin(angle),
      x2: CX + r2 * Math.cos(angle),
      y2: CY + r2 * Math.sin(angle),
    }
  })

  const labels = LABELS.map((minutes) => {
    const angle = (minutes / 60) * 2 * Math.PI - Math.PI / 2
    const radius = R_ARC + 34
    return {
      minutes,
      x: CX + radius * Math.cos(angle),
      y: CY + radius * Math.sin(angle),
    }
  })

  function handleKeyDown(e: KeyboardEvent<SVGCircleElement>) {
    if (!isDraggable) return

    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      onDragSet(Math.min(60, selectedMinutes + 1))
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      onDragSet(Math.max(1, selectedMinutes - 1))
    }

    if (e.key === 'PageUp') {
      e.preventDefault()
      onDragSet(Math.min(60, selectedMinutes + 5))
    }

    if (e.key === 'PageDown') {
      e.preventDefault()
      onDragSet(Math.max(1, selectedMinutes - 5))
    }

    if (e.key === 'Home') {
      e.preventDefault()
      onDragSet(1)
    }

    if (e.key === 'End') {
      e.preventDefault()
      onDragSet(60)
    }
  }

  return (
    <svg
      ref={svgRef}
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="timer-dial"
      style={{
        touchAction: 'none',
        cursor: isDraggable ? (dragging ? 'grabbing' : 'grab') : 'default',
        display: 'block',
      }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <defs>
        <filter id="dial-soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="var(--color-shadow)" floodOpacity="0.7" />
        </filter>
      </defs>

      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke="var(--color-text)"
          strokeWidth={i % 3 === 0 ? 2.4 : 1.2}
          strokeLinecap="round"
          opacity={isDraggable ? (i % 3 === 0 ? 0.2 : 0.13) : 0.08}
        />
      ))}

      {isDraggable && labels.map((label) => (
        <text
          key={label.minutes}
          x={label.x}
          y={label.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="dial-label"
          fill="var(--color-text-muted)"
        >
          {label.minutes}
        </text>
      ))}

      <circle
        cx={CX} cy={CY} r={R_ARC}
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth={14}
        onPointerDown={isDraggable ? onPointerDown : undefined}
      />

      {isDraggable && (
        <circle
          cx={CX} cy={CY} r={R_ARC}
          fill="none"
          stroke="transparent"
          strokeWidth={42}
          className="dial-hit-area"
          onPointerDown={onPointerDown}
        />
      )}

      <circle
        cx={CX} cy={CY} r={R_ARC}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth={14}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${CX} ${CY})`}
        className="progress-arc"
        style={{ transition: dragging ? 'none' : phase === 'running' ? 'stroke-dashoffset 1000ms linear' : 'stroke-dashoffset 300ms ease' }}
        onPointerDown={isDraggable ? onPointerDown : undefined}
      />

      {isDraggable && (
        <g
          className="dial-bubble"
          style={{
            opacity: dragging ? 1 : 0.84,
            transform: dragging ? 'scale(1.04)' : 'scale(1)',
            transformOrigin: `${bubbleX}px ${bubbleY}px`,
          }}
        >
          <rect
            x={bubbleX - 25}
            y={bubbleY - 13}
            width={50}
            height={26}
            rx={13}
            fill="rgba(255,255,255,0.82)"
            stroke="var(--color-border)"
          />
          <text
            x={bubbleX}
            y={bubbleY + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            className="dial-bubble-text"
            fill="var(--color-text)"
          >
            {selectedMinutes}분
          </text>
        </g>
      )}

      <circle cx={CX} cy={CY} r={R_FACE} fill="var(--color-dial)" filter="url(#dial-soft-shadow)" />

      <circle
        cx={CX} cy={CY} r={R_KNOB}
        fill="var(--color-knob)"
        style={{ cursor: 'pointer', filter: 'drop-shadow(0 4px 8px var(--color-shadow))' }}
        onClick={onToggle}
        role="button"
        aria-label="타이머 시작 또는 일시정지"
      />
      <circle
        cx={CX - 5} cy={CY - 6} r={10}
        fill="rgba(255,255,255,0.55)"
        onClick={onToggle}
        style={{ cursor: 'pointer', pointerEvents: 'none' }}
      />

      {isDraggable && (
        <circle
          cx={handleX}
          cy={handleY}
          r={dragging ? 11 : 9}
          fill="var(--color-primary)"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth={3}
          role="slider"
          tabIndex={0}
          aria-valuemin={1}
          aria-valuemax={60}
          aria-valuenow={selectedMinutes}
          aria-label="집중 시간 조절"
          style={{ cursor: dragging ? 'grabbing' : 'grab', filter: 'drop-shadow(0 3px 8px var(--color-shadow))' }}
          onPointerDown={onPointerDown}
          onKeyDown={handleKeyDown}
        />
      )}

      <foreignObject x={CX - 80} y={CY - 40} width={160} height={80}>
        <div className="flex items-center justify-center h-full">
          {children}
        </div>
      </foreignObject>
    </svg>
  )
}
