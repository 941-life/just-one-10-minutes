import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useTimerStore } from '@/stores/useTimerStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { copy, themes } from '@/lib/theme'
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer'
import { useKeyboard } from '@/hooks/useKeyboard'
import Header from '@/components/Header'
import TimerCard from '@/components/TimerCard'
import TimerDial from '@/components/TimerDial'
import TimerDisplay from '@/components/TimerDisplay'
import TimerControls from '@/components/TimerControls'
import ModeSelector from '@/components/ModeSelector'
import CheckpointOverlay from '@/components/CheckpointOverlay'
import SessionStamps from '@/components/SessionStamps'
import SettingsModal from '@/components/SettingsModal'

export default function App() {
  const {
    mode, phase, timeLeft, totalDuration,
    sessionCount, microCount,
    start, pause, reset, setMode, continueSession, enterBreak, completeSession,
    checkMidnightReset, setTimeLeft, setTotalDuration,
  } = useTimerStore()

  const {
    firstDuration, extDuration, breakDuration, longBreakDuration,
    longBreakInterval, isSettingsOpen,
  } = useSettingsStore()

  usePomodoroTimer()
  useKeyboard()

  useEffect(() => {
    checkMidnightReset()
    const onVisibility = () => {
      if (document.visibilityState === 'visible') checkMidnightReset()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [checkMidnightReset])

  useEffect(() => {
    const t = themes[mode]
    const root = document.documentElement
    root.style.setProperty('--color-bg', t.bg)
    root.style.setProperty('--color-surface', t.surface)
    root.style.setProperty('--color-primary', t.primary)
    root.style.setProperty('--color-text', t.text)
    root.style.setProperty('--color-text-muted', t.textMuted)
    root.style.setProperty('--color-dial', t.dial)
    root.style.setProperty('--color-knob', t.knob)
    root.style.setProperty('--color-border', t.border)
    root.style.setProperty('--color-shadow', t.shadow)
    document.body.style.backgroundColor = t.bg
  }, [mode])

  const isRunning = phase === 'running'
  const isBreakMode = mode === 'shortBreak' || mode === 'longBreak'
  const isAdjustingTime = phase === 'idle' || phase === 'paused'
  const selectedMinutes = Math.max(1, Math.round(timeLeft / 60))
  const progress = isAdjustingTime
    ? Math.max(1, Math.min(60, selectedMinutes)) / 60
    : totalDuration > 0 ? timeLeft / totalDuration : 1

  function handleToggle() {
    if (isRunning) pause()
    else start()
  }

  function handleReset() {
    const dur = isBreakMode
      ? (mode === 'longBreak' ? longBreakDuration : breakDuration) * 60
      : firstDuration * 60
    reset(dur)
  }

  function handleModeChange(newMode: typeof mode) {
    const dur =
      newMode === 'focus' ? firstDuration * 60
      : newMode === 'shortBreak' ? breakDuration * 60
      : longBreakDuration * 60
    setMode(newMode, dur)
  }

  function handleDragSet(minutes: number) {
    const secs = minutes * 60
    setTimeLeft(secs)
    setTotalDuration(secs)
  }

  function handleKeepGoing() {
    continueSession(extDuration * 60)
  }

  function handleTakeBreak() {
    toast(copy.toast.micro, { duration: 3000 })
    completeSession(false)
    enterBreak(breakDuration * 60, 'shortBreak')
  }

  const totalStamps = sessionCount + microCount

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-4 py-6 sm:py-10"
      style={{ background: 'var(--color-bg)' }}
    >
      <Header sessionCount={totalStamps} />

      <main className="flex flex-col items-center gap-6 w-full max-w-sm">
        <ModeSelector mode={mode} onModeChange={handleModeChange} disabled={isRunning} />

        <div className="relative">
          <TimerCard isRunning={isRunning}>
            <TimerDial
              progress={progress}
              isRunning={isRunning}
              phase={phase}
              selectedMinutes={selectedMinutes}
              onToggle={handleToggle}
              onDragSet={handleDragSet}
            >
              <TimerDisplay
                timeLeft={timeLeft}
                mode={mode}
                phase={phase}
                selectedMinutes={selectedMinutes}
              />
            </TimerDial>
          </TimerCard>

          <AnimatePresence>
            {phase === 'checkpoint' && (
              <CheckpointOverlay
                onKeepGoing={handleKeepGoing}
                onTakeBreak={handleTakeBreak}
              />
            )}
          </AnimatePresence>
        </div>

        <TimerControls
          isRunning={isRunning}
          phase={phase}
          onToggle={handleToggle}
          onReset={handleReset}
        />
      </main>

      <SessionStamps
        sessionCount={sessionCount}
        microCount={microCount}
        longBreakInterval={longBreakInterval}
      />

      <AnimatePresence>
        {isSettingsOpen && <SettingsModal />}
      </AnimatePresence>
    </div>
  )
}
