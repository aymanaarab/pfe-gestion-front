import { cn } from '../../lib/cn'

const TONES = {
  green: 'bg-brand-50 text-brand-800 ring-brand-600/20',
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  violet: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  gray: 'bg-ink-100 text-ink-600 ring-ink-400/20',
}

const DOT = {
  green: 'bg-brand-600',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  violet: 'bg-violet-500',
  gray: 'bg-ink-400',
}

export default function Badge({ tone = 'gray', dot = false, className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset',
        TONES[tone] || TONES.gray,
        className,
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', DOT[tone] || DOT.gray)} />}
      {children}
    </span>
  )
}
