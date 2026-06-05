import { cn } from '../../lib/cn'
import { Icon } from '../icons'

export default function Pagination({ page, totalPages, onPage, totalElements }) {
  if (totalPages <= 1) {
    return totalElements != null ? (
      <p className="text-xs text-ink-500 px-1">{totalElements} résultat(s)</p>
    ) : null
  }

  const go = (p) => onPage(Math.max(0, Math.min(totalPages - 1, p)))

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <p className="text-xs text-ink-500">
        Page <span className="font-medium text-ink-700">{page + 1}</span> sur {totalPages}
        {totalElements != null && <span className="text-ink-400"> · {totalElements} résultat(s)</span>}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => go(page - 1)}
          disabled={page === 0}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-50 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Icon name="chevron-left" className="w-4 h-4" />
        </button>
        {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={cn(
              'h-8 min-w-8 px-2 rounded-lg text-sm font-medium transition',
              i === page
                ? 'bg-brand-700 text-white shadow-soft'
                : 'text-ink-600 hover:bg-ink-100',
            )}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => go(page + 1)}
          disabled={page >= totalPages - 1}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-50 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Icon name="chevron-right" className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
