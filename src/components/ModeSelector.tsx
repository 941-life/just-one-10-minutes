import { motion } from 'framer-motion'
import { copy, type TimerMode } from '@/lib/theme'

const MODES: TimerMode[] = ['focus', 'shortBreak', 'longBreak']

interface Props {
  mode: TimerMode
  onModeChange: (mode: TimerMode) => void
  disabled: boolean
}

export default function ModeSelector({ mode, onModeChange, disabled }: Props) {
  return (
    <div
      className="flex items-center gap-1 p-1 rounded-full"
      style={{
        background: 'rgba(255,255,255,0.35)',
        border: '1px solid var(--color-border)',
      }}
    >
      {MODES.map((m) => {
        const active = m === mode
        return (
          <motion.button
            key={m}
            whileTap={{ scale: 0.94 }}
            onClick={() => !disabled && onModeChange(m)}
            disabled={disabled}
            className="mode-tab relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors select-none"
            style={{
              color: active ? 'var(--color-text)' : 'var(--color-text-muted)',
              opacity: disabled && !active ? 0.5 : 1,
              cursor: disabled ? 'default' : 'pointer',
            }}
          >
            {active && (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid var(--color-border)' }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{copy.modeTab[m]}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
