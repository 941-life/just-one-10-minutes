import { useEffect } from 'react'
import { useTimerStore } from '@/stores/useTimerStore'
import { useSettingsStore } from '@/stores/useSettingsStore'

export function useKeyboard() {
  const { phase, start, pause, reset, totalDuration } = useTimerStore()
  const { isSettingsOpen, closeSettings } = useSettingsStore()

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (e.code === 'Space') {
        e.preventDefault()
        if (phase === 'running') pause()
        else if (phase === 'idle' || phase === 'paused') start()
      }

      if (e.code === 'KeyR') {
        reset(totalDuration)
      }

      if (e.code === 'Escape') {
        if (isSettingsOpen) closeSettings()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase, totalDuration, isSettingsOpen, start, pause, reset, closeSettings])
}
