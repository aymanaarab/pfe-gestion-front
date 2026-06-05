import { useCallback, useMemo, useState } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from '../icons'
import { ToastContext } from './toastContext'

const TONE = {
  success: { icon: 'check-circle', ring: 'text-brand-600', bar: 'bg-brand-600' },
  error: { icon: 'alert', ring: 'text-red-600', bar: 'bg-red-600' },
  info: { icon: 'info', ring: 'text-blue-600', bar: 'bg-blue-600' },
}

let counter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (type, message) => {
      counter += 1
      const id = counter
      setToasts((prev) => [...prev, { id, type, message }])
      setTimeout(() => dismiss(id), 4200)
    },
    [dismiss],
  )

  const api = useMemo(
    () => ({
      success: (m) => push('success', m),
      error: (m) => push('error', m),
      info: (m) => push('info', m),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2.5 w-[min(92vw,22rem)]">
        {toasts.map((t) => {
          const tone = TONE[t.type] || TONE.info
          return (
            <div
              key={t.id}
              className="relative bg-white border border-ink-200/70 rounded-xl shadow-lift overflow-hidden flex items-start gap-3 p-3.5 pr-9 animate-rise"
            >
              <span className={cn('mt-0.5 shrink-0', tone.ring)}>
                <Icon name={tone.icon} className="w-5 h-5" />
              </span>
              <p className="text-sm text-ink-800 leading-snug">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="absolute top-2.5 right-2.5 text-ink-400 hover:text-ink-700"
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
              <span className={cn('absolute bottom-0 left-0 h-0.5 w-full', tone.bar)} />
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
