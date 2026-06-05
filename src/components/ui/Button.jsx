import { cn } from '../../lib/cn'
import { Icon } from '../icons'

const VARIANTS = {
  primary:
    'bg-brand-700 text-white shadow-soft hover:bg-brand-800 active:bg-brand-900 focus-visible:ring-brand-600/40',
  secondary:
    'bg-white text-ink-700 border border-ink-200 hover:bg-ink-50 hover:border-ink-300 focus-visible:ring-ink-300/50',
  ghost:
    'text-ink-600 hover:bg-ink-100 hover:text-ink-900 focus-visible:ring-ink-300/50',
  subtle:
    'bg-brand-50 text-brand-800 hover:bg-brand-100 focus-visible:ring-brand-500/30',
  danger:
    'bg-red-600 text-white shadow-soft hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500/40',
  'danger-ghost':
    'text-red-600 hover:bg-red-50 focus-visible:ring-red-400/40',
}

const SIZES = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-sm gap-2 rounded-xl',
  icon: 'h-9 w-9 rounded-lg justify-center',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150 outline-none focus-visible:ring-4 disabled:opacity-50 disabled:pointer-events-none select-none',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <Icon name={icon} className="w-4 h-4" />
      )}
      {children && <span>{children}</span>}
      {iconRight && !loading && <Icon name={iconRight} className="w-4 h-4" />}
    </button>
  )
}
