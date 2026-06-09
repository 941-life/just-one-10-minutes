import { Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSettingsStore } from '@/stores/useSettingsStore'
import tomatoLogo from '@/img/tomato.png'

interface Props {
  sessionCount: number
}

export default function Header({ sessionCount }: Props) {
  const openSettings = useSettingsStore((s) => s.openSettings)

  return (
    <header className="w-full max-w-sm flex items-center justify-between px-1">
      <div className="flex items-center gap-2.5">
        <div
          className="h-9 w-9 rounded-2xl flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.52)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 8px 22px var(--color-shadow)',
          }}
          aria-hidden="true"
        >
          <img
            src={tomatoLogo}
            alt=""
            className="h-7 w-7 object-contain"
            draggable={false}
          />
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-xl font-black tracking-tight font-nunito"
            style={{ color: 'var(--color-text)' }}
          >
            Pomo
          </span>
          {sessionCount > 0 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
              }}
            >
              오늘 {sessionCount}회
            </motion.span>
          )}
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={openSettings}
        className="p-2 rounded-xl transition-colors"
        style={{
          color: 'var(--color-text-muted)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
        aria-label="설정 열기"
      >
        <Settings size={16} strokeWidth={2} />
      </motion.button>
    </header>
  )
}
