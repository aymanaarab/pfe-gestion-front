import { cn } from '../../lib/cn'

export function Skeleton({ className }) {
  return <div className={cn('skeleton rounded-lg', className)} />
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-ink-200/70 rounded-2xl shadow-soft p-5 space-y-3">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-7 w-20" />
      <Skeleton className="h-3 w-28" />
    </div>
  )
}

export function SkeletonRows({ rows = 5 }) {
  return (
    <div className="bg-white border border-ink-200/70 rounded-2xl shadow-soft overflow-hidden">
      <div className="h-11 bg-ink-50 border-b border-ink-200/70" />
      <div className="divide-y divide-ink-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5">
            <Skeleton className="h-4 w-4/12" />
            <Skeleton className="h-4 w-3/12" />
            <Skeleton className="h-4 w-2/12" />
            <Skeleton className="h-4 w-2/12 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Skeleton
