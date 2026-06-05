export default function BarChart({ data = [], color = '#12914b' }) {
  const max = Math.max(1, ...data.map((d) => d.value))

  if (!data.length) {
    return <p className="text-sm text-ink-400 py-6 text-center">Aucune donnée disponible</p>
  }

  return (
    <div className="space-y-3.5">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-28 sm:w-36 text-sm text-ink-600 truncate shrink-0" title={d.label}>
            {d.label}
          </span>
          <div className="flex-1 h-7 rounded-lg bg-ink-100 overflow-hidden relative">
            <div
              className="h-full rounded-lg flex items-center justify-end pr-2 transition-all duration-700 ease-out"
              style={{
                width: `${Math.max((d.value / max) * 100, d.value > 0 ? 8 : 0)}%`,
                backgroundColor: color,
                minWidth: d.value > 0 ? '1.75rem' : 0,
              }}
            >
              {d.value > 0 && (
                <span className="text-xs font-semibold text-white tabular-nums">{d.value}</span>
              )}
            </div>
            {d.value === 0 && (
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-ink-400">0</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
