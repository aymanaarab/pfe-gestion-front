import { cn } from '../../lib/cn'

export function ProgressBar({ value = 0, tone = 'brand', className }) {
  const pct = Math.max(0, Math.min(100, value))
  const tones = {
    brand: 'bg-brand-600',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    violet: 'bg-violet-500',
  }
  return (
    <div className={cn('h-2 rounded-full bg-ink-100 overflow-hidden', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-700 ease-out', tones[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function ProgressRing({ value = 0, size = 132, stroke = 12, label, sublabel, tone = '#12914b' }) {
  const pct = Math.max(0, Math.min(100, value))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#eceef2"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-bold text-ink-900">{label ?? `${pct}%`}</span>
        {sublabel && <span className="text-xs text-ink-500 mt-0.5">{sublabel}</span>}
      </div>
    </div>
  )
}
