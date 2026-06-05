import { Icon } from '../icons'

export default function EmptyState({ icon = 'layers', title, description, action }) {
  return (
    <div className="bg-white border border-dashed border-ink-200 rounded-2xl p-12 text-center animate-fade-in">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
        <Icon name={icon} className="w-7 h-7" />
      </div>
      <h3 className="mt-4 font-display font-semibold text-ink-800">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-ink-500 max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}
