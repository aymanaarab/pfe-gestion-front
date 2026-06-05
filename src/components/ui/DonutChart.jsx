import { cn } from '../../lib/cn'

export default function DonutChart({ data = [], size = 180, thickness = 26 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  let cumulative = 0
  const segments = total
    ? data
        .filter((d) => d.value > 0)
        .map((d) => {
          const fraction = d.value / total
          const dash = fraction * circumference
          const seg = {
            ...d,
            fraction,
            dasharray: `${dash} ${circumference - dash}`,
            offset: -cumulative * circumference,
          }
          cumulative += fraction
          return seg
        })
    : []

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#eceef2" strokeWidth={thickness} />
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeDasharray={seg.dasharray}
              strokeDashoffset={seg.offset}
              strokeLinecap="butt"
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-bold text-ink-900">{total}</span>
          <span className="text-xs text-ink-500">Total</span>
        </div>
      </div>

      <ul className="flex-1 w-full space-y-2.5">
        {data.map((d, i) => (
          <li key={i} className="flex items-center gap-2.5 text-sm">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-ink-600 flex-1 truncate">{d.label}</span>
            <span className="font-semibold text-ink-900 tabular-nums">{d.value}</span>
            <span className={cn('text-xs text-ink-400 w-10 text-right tabular-nums')}>
              {total ? Math.round((d.value / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
