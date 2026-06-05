import { cn } from '../../lib/cn'

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-white border border-ink-200/70 rounded-2xl shadow-soft',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action, icon, className }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 px-5 pt-5', className)}>
      <div className="flex items-start gap-3 min-w-0">
        {icon}
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-ink-900 text-[15px] leading-tight truncate">
            {title}
          </h3>
          {subtitle && <p className="text-xs text-ink-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

export function CardBody({ className, children }) {
  return <div className={cn('p-5', className)}>{children}</div>
}

export default Card
