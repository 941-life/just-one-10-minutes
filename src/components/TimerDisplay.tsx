import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { formatTime } from '@/lib/time'
import { copy, type TimerMode, type TimerPhase } from '@/lib/theme'

interface Props {
  timeLeft: number
  mode: TimerMode
  phase: TimerPhase
  selectedMinutes: number
}

export default function TimerDisplay({ timeLeft, mode, phase, selectedMinutes }: Props) {
  const [useRichPromptMotion, setUseRichPromptMotion] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches
  })

  const message = getDisplayMessage(mode, phase, selectedMinutes)
  const promptKey = useRichPromptMotion
    ? `${mode}-${phase}-${selectedMinutes}`
    : `${mode}-${phase}`
  const promptClassName = 'min-h-[28px] max-w-[150px] text-center text-xs font-semibold leading-tight'

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setUseRichPromptMotion(query.matches)

    update()
    query.addEventListener('change', update)

    return () => query.removeEventListener('change', update)
  }, [])

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

      {useRichPromptMotion ? (
        <AnimatePresence mode="wait">
          <motion.p
            key={promptKey}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={promptClassName}
            style={{ color: 'var(--color-text-muted)' }}
          >
            {message}
          </motion.p>
        </AnimatePresence>
      ) : (
        <p
          className={promptClassName}
          style={{ color: 'var(--color-text-muted)' }}
        >
          {message}
        </p>
      )}
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
