import { cn } from '../../lib/cn'

export function Spinner({ className = 'w-6 h-6' }) {
  return (
    <span
      className={cn(
        'inline-block border-[3px] border-brand-600 border-t-transparent rounded-full animate-spin',
        className,
      )}
    />
  )
}

export function PageLoader({ label = 'Chargement…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 animate-fade-in">
      <Spinner className="w-9 h-9" />
      <p className="text-sm text-ink-500">{label}</p>
    </div>
  )
}

export default Spinner
