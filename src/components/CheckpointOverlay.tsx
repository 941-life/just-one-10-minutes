import { motion } from 'framer-motion'
import { copy } from '@/lib/theme'

interface Props {
  onKeepGoing: () => void
  onTakeBreak: () => void
}

export default function CheckpointOverlay({ onKeepGoing, onTakeBreak }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 rounded-4xl flex items-center justify-center"
      style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,248,240,0.88)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 8 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28, delay: 0.06 }}
        className="flex flex-col items-center gap-5 px-6 text-center"
      >
        <div className="flex flex-col items-center gap-1.5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.15 }}
            className="text-3xl mb-1"
          >
            ✓
          </motion.div>
          <h2
            className="font-bold text-lg leading-snug"
            style={{ color: 'var(--color-text)' }}
          >
            {copy.checkpoint.title}
          </h2>
          <p
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {copy.checkpoint.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 w-full">
          <motion.button
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            onClick={onKeepGoing}
            className="w-full py-3 rounded-full font-bold text-sm text-white select-none"
            style={{
              background: 'var(--color-primary)',
              boxShadow: '0 6px 20px var(--color-shadow)',
            }}
          >
            {copy.checkpoint.keepGoing}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            onClick={onTakeBreak}
            className="w-full py-3 rounded-full font-semibold text-sm select-none"
            style={{
              background: 'rgba(255,255,255,0.7)',
              border: '1.5px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            {copy.checkpoint.takeBreak}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
