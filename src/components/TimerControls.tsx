import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { copy, type TimerPhase } from '@/lib/theme'

interface Props {
  isRunning: boolean
  phase: TimerPhase
  onToggle: () => void
  onReset: () => void
}

export default function TimerControls({ isRunning, phase, onToggle, onReset }: Props) {
  const isCheckpoint = phase === 'checkpoint'
  const label = isRunning ? copy.button.pause : copy.button.start

  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileTap={{ scale: 0.93 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        onClick={onToggle}
        disabled={isCheckpoint}
        className="primary-btn px-10 py-3.5 rounded-full font-bold text-sm tracking-wide text-white select-none disabled:opacity-50"
        style={{
          background: 'var(--color-primary)',
          boxShadow: '0 8px 24px var(--color-shadow)',
          minWidth: '140px',
        }}
      >
        {label}
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.88 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        onClick={onReset}
        className="p-3.5 rounded-full select-none"
        style={{
          background: 'rgba(255,255,255,0.5)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-muted)',
        }}
        aria-label={copy.button.reset}
      >
        <RotateCcw size={16} strokeWidth={2.2} />
      </motion.button>
    </div>
  )
}
