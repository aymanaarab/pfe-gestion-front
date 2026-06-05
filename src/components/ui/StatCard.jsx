import { cn } from '../../lib/cn'
import { Icon } from '../icons'
import CountUp from './CountUp'

const TONES = {
  brand: 'bg-brand-50 text-brand-700',
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-600',
  violet: 'bg-violet-50 text-violet-600',
  rose: 'bg-rose-50 text-rose-600',
  teal: 'bg-teal-50 text-teal-600',
}

export default function StatCard({ icon, label, value, tone = 'brand', hint, to, onClick }) {
  const Wrapper = to || onClick ? 'button' : 'div'
  const numeric = typeof value === 'number'

  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        'group text-left bg-white border border-ink-200/70 rounded-2xl shadow-soft p-5 transition-all duration-200 w-full',
        (to || onClick) && 'hover:shadow-lift hover:-translate-y-0.5 cursor-pointer',
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', TONES[tone])}>
          <Icon name={icon} className="w-[22px] h-[22px]" strokeWidth={1.9} />
        </div>
        {(to || onClick) && (
          <Icon
            name="arrow-up-right"
            className="w-4 h-4 text-ink-300 group-hover:text-brand-600 transition"
          />
        )}
      </div>
      <div className="mt-4">
        <div className="font-display text-3xl font-bold text-ink-900 tabular-nums">
          {numeric ? <CountUp value={value} /> : value}
        </div>
        <p className="text-sm text-ink-500 mt-1">{label}</p>
        {hint && <p className="text-xs text-ink-400 mt-1">{hint}</p>}
      </div>
    </Wrapper>
  )
}
