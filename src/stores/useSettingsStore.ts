import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  firstDuration: number
  extDuration: number
  breakDuration: number
  longBreakDuration: number
  longBreakInterval: number
  autoStartBreak: boolean
  soundEnabled: boolean
  isSettingsOpen: boolean
}

interface SettingsActions {
  setFirstDuration: (v: number) => void
  setExtDuration: (v: number) => void
  setBreakDuration: (v: number) => void
  setLongBreakDuration: (v: number) => void
  setLongBreakInterval: (v: number) => void
  toggleAutoStartBreak: () => void
  toggleSound: () => void
  openSettings: () => void
  closeSettings: () => void
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      firstDuration: 10,
      extDuration: 15,
      breakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
      autoStartBreak: false,
      soundEnabled: true,
      isSettingsOpen: false,

      setFirstDuration: (v) => set({ firstDuration: v }),
      setExtDuration: (v) => set({ extDuration: v }),
      setBreakDuration: (v) => set({ breakDuration: v }),
      setLongBreakDuration: (v) => set({ longBreakDuration: v }),
      setLongBreakInterval: (v) => set({ longBreakInterval: v }),
      toggleAutoStartBreak: () => set((s) => ({ autoStartBreak: !s.autoStartBreak })),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      openSettings: () => set({ isSettingsOpen: true }),
      closeSettings: () => set({ isSettingsOpen: false }),
    }),
    {
      name: 'pomo-settings',
      partialize: (s) => ({
        firstDuration: s.firstDuration,
        extDuration: s.extDuration,
        breakDuration: s.breakDuration,
        longBreakDuration: s.longBreakDuration,
        longBreakInterval: s.longBreakInterval,
        autoStartBreak: s.autoStartBreak,
        soundEnabled: s.soundEnabled,
      }),
    },
  ),
)
