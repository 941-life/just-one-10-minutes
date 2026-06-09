import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TimerMode, TimerPhase } from '@/lib/theme'
import { todayISO } from '@/lib/time'

interface TimerState {
  mode: TimerMode
  phase: TimerPhase
  timeLeft: number
  totalDuration: number
  isExtended: boolean
  sessionCount: number
  microCount: number
  lastResetDate: string
}

interface TimerActions {
  setMode: (mode: TimerMode, durationSeconds: number) => void
  setTimeLeft: (s: number) => void
  setTotalDuration: (s: number) => void
  tick: () => void
  start: () => void
  pause: () => void
  reset: (durationSeconds: number) => void
  enterCheckpoint: () => void
  continueSession: (extSeconds: number) => void
  completeSession: (isFull: boolean) => void
  enterBreak: (durationSeconds: number, mode: TimerMode) => void
  checkMidnightReset: () => void
}

export const useTimerStore = create<TimerState & TimerActions>()(
  persist(
    (set, get) => ({
      mode: 'focus',
      phase: 'idle',
      timeLeft: 10 * 60,
      totalDuration: 10 * 60,
      isExtended: false,
      sessionCount: 0,
      microCount: 0,
      lastResetDate: todayISO(),

      setMode: (mode, durationSeconds) =>
        set({ mode, timeLeft: durationSeconds, totalDuration: durationSeconds, phase: 'idle', isExtended: false }),

      setTimeLeft: (s) => set({ timeLeft: s }),
      setTotalDuration: (s) => set({ totalDuration: s }),

      tick: () => set((s) => ({ timeLeft: Math.max(0, s.timeLeft - 1) })),

      start: () => set({ phase: 'running' }),
      pause: () => set({ phase: 'paused' }),

      reset: (durationSeconds) =>
        set({ phase: 'idle', timeLeft: durationSeconds, totalDuration: durationSeconds, isExtended: false }),

      enterCheckpoint: () => set({ phase: 'checkpoint' }),

      continueSession: (extSeconds) =>
        set({
          phase: 'running',
          timeLeft: extSeconds,
          totalDuration: extSeconds,
          isExtended: true,
        }),

      completeSession: (isFull) => {
        const s = get()
        set({
          sessionCount: isFull ? s.sessionCount + 1 : s.sessionCount,
          microCount: !isFull ? s.microCount + 1 : s.microCount,
        })
      },

      enterBreak: (durationSeconds, mode) =>
        set({
          mode,
          phase: 'running',
          timeLeft: durationSeconds,
          totalDuration: durationSeconds,
          isExtended: false,
        }),

      checkMidnightReset: () => {
        const today = todayISO()
        if (get().lastResetDate !== today) {
          set({ sessionCount: 0, microCount: 0, lastResetDate: today })
        }
      },
    }),
    {
      name: 'pomo-timer',
      partialize: (s) => ({
        sessionCount: s.sessionCount,
        microCount: s.microCount,
        lastResetDate: s.lastResetDate,
      }),
    },
  ),
)
