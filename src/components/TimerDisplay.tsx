import { motion } from 'framer-motion'
import { formatTime } from '@/lib/time'
import { copy, type TimerMode, type TimerPhase } from '@/lib/theme'

interface Props {
  timeLeft: number
  mode: TimerMode
  phase: TimerPhase
  selectedMinutes: number
}

export default function TimerDisplay({ timeLeft, mode, phase, selectedMinutes }: Props) {
  const message = getDisplayMessage(mode, phase, selectedMinutes)

  return (
    <div className="flex flex-col items-center gap-1.5 select-none pointer-events-none">
      <span
        className="font-nunito font-bold tabular-nums leading-none"
        style={{
          fontSize: '48px',
          color: 'var(--color-text)',
          letterSpacing: 0,
        }}
      >
        {formatTime(timeLeft)}
      </span>

      <motion.p
        initial={{ opacity: 0.82 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        className="max-w-[150px] text-center text-xs font-semibold leading-tight"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {message}
      </motion.p>
    </div>
  )
}

function getDisplayMessage(mode: TimerMode, phase: TimerPhase, selectedMinutes: number) {
  if (mode !== 'focus') return copy.modeLabel[mode]

  if (phase === 'running') return copy.prompt.running
  if (phase === 'paused') return copy.prompt.paused(selectedMinutes)
  if (selectedMinutes === 10) return copy.prompt.focusDefault

  return copy.prompt.focusCustom(selectedMinutes)
}
