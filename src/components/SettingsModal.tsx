import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useTimerStore } from '@/stores/useTimerStore'
import { copy } from '@/lib/theme'

function DurationStepper({
  label,
  value,
  onChange,
  min = 1,
  max = 60,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
}) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
        {label}
      </span>
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onChange(Math.max(min, value - 5))}
          className="w-8 h-8 rounded-full font-bold text-lg flex items-center justify-center select-none"
          style={{
            background: 'rgba(255,255,255,0.6)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
        >
          -
        </motion.button>
        <span className="w-12 text-center font-bold text-sm" style={{ color: 'var(--color-text)' }}>
          {value}{copy.settings.unit}
        </span>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onChange(Math.min(max, value + 5))}
          className="w-8 h-8 rounded-full font-bold text-lg flex items-center justify-center select-none"
          style={{
            background: 'var(--color-primary)',
            color: 'white',
          }}
        >
          +
        </motion.button>
      </div>
    </div>
  )
}

function Toggle({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
        {label}
      </span>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="relative w-11 h-6 rounded-full transition-colors duration-200"
        style={{ background: value ? 'var(--color-primary)' : 'rgba(0,0,0,0.12)' }}
      >
        <motion.div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
          animate={{ left: value ? '22px' : '2px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        />
      </motion.button>
    </div>
  )
}

export default function SettingsModal() {
  const {
    firstDuration, extDuration, breakDuration, longBreakDuration,
    autoStartBreak, soundEnabled,
    setFirstDuration, setExtDuration, setBreakDuration, setLongBreakDuration,
    toggleAutoStartBreak, toggleSound, closeSettings,
  } = useSettingsStore()

  const { reset, phase } = useTimerStore()

  function handleFirstDuration(v: number) {
    setFirstDuration(v)
    if (phase === 'idle') reset(v * 60)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(4px)' }}
        onClick={closeSettings}
      />

      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-4xl px-6 pt-5 pb-10"
        style={{
          background: 'var(--color-dial)',
          maxWidth: '480px',
          margin: '0 auto',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-base" style={{ color: 'var(--color-text)' }}>
            {copy.settings.title}
          </h2>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={closeSettings}
            className="p-1.5 rounded-full"
            style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}
          >
            <X size={16} />
          </motion.button>
        </div>

        <div className="flex flex-col">
          <DurationStepper
            label={copy.settings.firstDuration}
            value={firstDuration}
            onChange={handleFirstDuration}
          />
          <DurationStepper
            label={copy.settings.extDuration}
            value={extDuration}
            onChange={setExtDuration}
          />
          <DurationStepper
            label={copy.settings.breakDuration}
            value={breakDuration}
            onChange={setBreakDuration}
          />
          <DurationStepper
            label={copy.settings.longBreakDuration}
            value={longBreakDuration}
            onChange={setLongBreakDuration}
          />
          <Toggle
            label={copy.settings.autoStartBreak}
            value={autoStartBreak}
            onToggle={toggleAutoStartBreak}
          />
          <Toggle
            label={copy.settings.sound}
            value={soundEnabled}
            onToggle={toggleSound}
          />
        </div>
      </motion.div>
    </>
  )
}
