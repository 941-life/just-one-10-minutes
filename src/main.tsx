import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          fontFamily: 'Pretendard, system-ui, sans-serif',
          fontSize: '14px',
          fontWeight: '600',
          borderRadius: '999px',
          padding: '10px 20px',
          background: 'rgba(255,255,255,0.92)',
          color: '#9e3b3b',
          boxShadow: '0 8px 24px rgba(158,59,59,0.14)',
          backdropFilter: 'blur(8px)',
        },
      }}
    />
  </StrictMode>,
)
