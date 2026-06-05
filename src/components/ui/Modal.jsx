import { useEffect } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from '../icons'

const WIDTHS = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export default function Modal({ open, onClose, title, subtitle, size = 'md', children, footer }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink-950/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-white w-full rounded-t-3xl sm:rounded-2xl shadow-lift flex flex-col max-h-[92vh] animate-scale-in',
          WIDTHS[size],
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-ink-100">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-900">{title}</h2>
            {subtitle && <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-ink-400 hover:text-ink-700 hover:bg-ink-100 rounded-lg p-1.5 -mr-1.5 transition"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto scroll-slim">{children}</div>

        {footer && (
          <div className="px-6 py-4 border-t border-ink-100 flex items-center justify-end gap-2 bg-ink-50/50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
