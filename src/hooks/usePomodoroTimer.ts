import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useTimerStore } from '@/stores/useTimerStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { copy } from '@/lib/theme'

export function usePomodoroTimer() {
  const phase = useTimerStore((s) => s.phase)

  // Keep latest store values accessible inside interval without re-creating it
  const timerRef = useRef(useTimerStore.getState())
  const settingsRef = useRef(useSettingsStore.getState())

  useEffect(() => {
    const unsubTimer = useTimerStore.subscribe((s) => { timerRef.current = s })
    const unsubSettings = useSettingsStore.subscribe((s) => { settingsRef.current = s })
    return () => { unsubTimer(); unsubSettings() }
  }, [])

  useEffect(() => {
    if (phase !== 'running') return

    const id = setInterval(() => {
      const { phase: p, timeLeft, mode, isExtended, sessionCount } = timerRef.current
      const settings = settingsRef.current

      if (p !== 'running') {
        clearInterval(id)
        return
      }

      if (timeLeft <= 1) {
        clearInterval(id)
        useTimerStore.getState().pause()
        playSound(settings.soundEnabled)
        handleCompletion(mode, isExtended, sessionCount, settings)
      } else {
        useTimerStore.getState().tick()
      }
    }, 1000)

    return () => clearInterval(id)
  }, [phase])
}

function playSound(enabled: boolean) {
  if (!enabled) return
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(523.25, ctx.currentTime)
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15)
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.28, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.85)
  } catch (_) {}
}

function handleCompletion(
  mode: string,
  isExtended: boolean,
  sessionCount: number,
  settings: ReturnType<typeof useSettingsStore.getState>,
) {
  const { firstDuration, breakDuration, longBreakDuration, longBreakInterval, autoStartBreak } = settings
  const store = useTimerStore.getState()

  if (mode === 'focus' && !isExtended) {
    store.enterCheckpoint()
    return
  }

  if (mode === 'focus' && isExtended) {
    store.completeSession(true)
    toast.success(copy.toast.full, { duration: 3000 })
    const nextIsLong = (sessionCount + 1) % longBreakInterval === 0
    if (autoStartBreak) {
      store.enterBreak(
        nextIsLong ? longBreakDuration * 60 : breakDuration * 60,
        nextIsLong ? 'longBreak' : 'shortBreak',
      )
    } else {
      store.reset(firstDuration * 60)
    }
    return
  }

  if (mode === 'shortBreak' || mode === 'longBreak') {
    store.reset(firstDuration * 60)
  }
}
