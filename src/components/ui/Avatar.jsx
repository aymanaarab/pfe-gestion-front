import { cn } from '../../lib/cn'
import { initials } from '../../lib/format'

const SIZES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

const TONES = [
  'from-brand-500 to-brand-700',
  'from-blue-500 to-indigo-600',
  'from-amber-500 to-orange-600',
  'from-violet-500 to-purple-600',
  'from-rose-500 to-pink-600',
  'from-teal-500 to-emerald-600',
]

function pick(seed = '') {
  let sum = 0
  for (let i = 0; i < seed.length; i += 1) sum += seed.charCodeAt(i)
  return TONES[sum % TONES.length]
}

export default function Avatar({ firstName, lastName, size = 'md', className }) {
  const text = initials(firstName, lastName)
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold text-white bg-gradient-to-br shadow-soft shrink-0',
        pick(`${firstName}${lastName}`),
        SIZES[size],
        className,
      )}
    >
      {text}
    </span>
  )
}
