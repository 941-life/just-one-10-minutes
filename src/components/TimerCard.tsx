import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  isRunning: boolean
  children: ReactNode
}

export default function TimerCard({ isRunning, children }: Props) {
  return (
    <motion.div
      className="timer-card relative rounded-4xl p-7 flex items-center justify-center"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
      animate={{
        y: isRunning ? -6 : 0,
        boxShadow: isRunning
          ? '0 32px 80px var(--color-shadow), 0 8px 20px rgba(0,0,0,0.06)'
          : '0 16px 48px var(--color-shadow)',
      }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
    >
      {children}
    </motion.div>
  )
}
