import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  sessionCount: number
  microCount: number
  longBreakInterval: number
}

export default function SessionStamps({ sessionCount, microCount, longBreakInterval }: Props) {
  const total = sessionCount + microCount
  if (total === 0) return <div className="h-10" />

  const stamps = Array.from({ length: total }, (_, i) => {
    const isFull = i < sessionCount
    return { id: i, isFull }
  })

  return (
    <div className="flex flex-col items-center gap-1.5 pb-2">
      <p className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
        오늘의 집중
      </p>
      <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-xs">
        <AnimatePresence>
          {stamps.map((stamp, idx) => (
            <motion.div
              key={stamp.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 16,
                delay: 0.05 * (idx % longBreakInterval),
              }}
              className="flex items-center justify-center"
            >
              {stamp.isFull ? (
                <span style={{ fontSize: '18px', lineHeight: 1 }}>✓</span>
              ) : (
                <div
                  className="rounded-full"
                  style={{
                    width: '12px',
                    height: '12px',
                    background: 'var(--color-primary)',
                    opacity: 0.6,
                    border: '1.5px solid var(--color-border)',
                  }}
                />
              )}
              {(idx + 1) % longBreakInterval === 0 && idx < total - 1 && (
                <div className="w-3" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
