import { cn } from '../../lib/cn'

export default function PageHeader({ title, description, children, className }) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4', className)}>
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold text-ink-900 tracking-tight">{title}</h1>
        {description && <p className="text-sm text-ink-500 mt-1">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  )
}
