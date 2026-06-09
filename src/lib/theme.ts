export type TimerMode = 'focus' | 'shortBreak' | 'longBreak'
export type TimerPhase = 'idle' | 'running' | 'paused' | 'checkpoint' | 'break'

export interface ThemeTokens {
  bg: string
  surface: string
  primary: string
  text: string
  textMuted: string
  dial: string
  knob: string
  border: string
  shadow: string
}

export const themes: Record<TimerMode, ThemeTokens> = {
  focus: {
    bg: '#feeac9',
    surface: '#ffcdc9',
    primary: '#fd7979',
    text: '#9e3b3b',
    textMuted: '#c47b7b',
    dial: '#fff8f0',
    knob: '#ffead3',
    border: 'rgba(158,59,59,0.12)',
    shadow: 'rgba(158,59,59,0.16)',
  },
  shortBreak: {
    bg: '#f1f3e0',
    surface: '#d2dcb6',
    primary: '#a1bc98',
    text: '#778873',
    textMuted: '#a0aa9a',
    dial: '#f5f7ee',
    knob: '#e8edd0',
    border: 'rgba(119,136,115,0.12)',
    shadow: 'rgba(119,136,115,0.18)',
  },
  longBreak: {
    bg: '#f8fab4',
    surface: '#fee2ad',
    primary: '#f08787',
    text: '#9e3b3b',
    textMuted: '#c47b7b',
    dial: '#fffbee',
    knob: '#fff0c8',
    border: 'rgba(158,59,59,0.10)',
    shadow: 'rgba(240,135,135,0.18)',
  },
}

export const copy = {
  modeLabel: {
    focus: '일단 10분만 해볼까요?',
    shortBreak: '잠깐 쉬어가요',
    longBreak: '충분히 쉬세요',
  },
  modeTab: {
    focus: 'Focus',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  },
  prompt: {
    focusDefault: '일단 10분만 해볼까요?',
    focusCustom: (minutes: number) => `일단 ${minutes}분만 해볼까요?`,
    running: '좋아요, 할 수 있어요',
    paused: (minutes: number) => `${minutes}분만 다시 이어볼까요?`,
  },
  checkpoint: {
    title: '10분을 채웠어요.',
    subtitle: '계속 이어갈까요?',
    keepGoing: '조금 더 +15',
    takeBreak: '쉴래요',
  },
  button: {
    start: '해볼래요',
    pause: '잠시 멈춤',
    reset: '처음으로',
  },
  settings: {
    title: '설정',
    firstDuration: '첫 집중 시간',
    extDuration: '연장 시간',
    breakDuration: '짧은 휴식',
    longBreakDuration: '긴 휴식',
    longBreakInterval: '긴 휴식 주기',
    autoStartBreak: '휴식 자동 시작',
    sound: '소리',
    unit: '분',
  },
  toast: {
    micro: '10분 완료! 잘했어요.',
    full: '집중 세션 완료! 정말 대단해요.',
  },
}
