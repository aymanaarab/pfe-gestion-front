import { cn } from '../../lib/cn'
import { Icon } from '../icons'

export default function SearchInput({ value, onChange, placeholder = 'Rechercher…', className }) {
  return (
    <div className={cn('relative', className)}>
      <Icon
        name="search"
        className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-9 rounded-xl border border-ink-200 bg-white text-sm text-ink-800 placeholder:text-ink-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
        >
          <Icon name="close" className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
