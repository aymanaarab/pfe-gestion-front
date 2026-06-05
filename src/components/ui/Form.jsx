import { cn } from '../../lib/cn'

const baseControl =
  'w-full h-10 rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-800 placeholder:text-ink-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 disabled:bg-ink-50 disabled:text-ink-400'

export function Field({ label, required, hint, error, className, children }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="block text-[13px] font-medium text-ink-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : (
        hint && <p className="text-xs text-ink-400">{hint}</p>
      )}
    </div>
  )
}

export function Input({ className, ...props }) {
  return <input className={cn(baseControl, className)} {...props} />
}

export function Textarea({ className, rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      className={cn(baseControl, 'h-auto py-2.5 resize-y', className)}
      {...props}
    />
  )
}

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(baseControl, 'pr-9 appearance-none cursor-pointer bg-no-repeat', className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2362708b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E\")",
        backgroundPosition: 'right 0.625rem center',
        backgroundSize: '1.1rem',
      }}
      {...props}
    >
      {children}
    </select>
  )
}
