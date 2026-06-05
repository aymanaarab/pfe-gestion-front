import { Card } from '../ui/Card'
import Avatar from '../ui/Avatar'
import { ProgressBar } from '../ui/Progress'
import { InternshipStatusBadge } from '../ui/StatusBadge'
import { Icon } from '../icons'
import { fullName, formatDate } from '../../lib/format'

export default function InternshipCard({ internship: it, onClick }) {
  const total = it.taskCount ?? 0
  const done = it.completedTaskCount ?? 0
  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <Card
      onClick={onClick}
      className="p-5 cursor-pointer hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="flex items-start gap-3">
        <Avatar firstName={it.student?.firstName} lastName={it.student?.lastName} size="md" />
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-semibold text-ink-900 truncate">{it.subject}</h3>
          <p className="text-xs text-ink-500 truncate">{fullName(it.student)}</p>
        </div>
        <Icon name="chevron-right" className="w-4 h-4 text-ink-300 group-hover:text-brand-600 transition" />
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-ink-500">
        <Icon name="companies" className="w-4 h-4 text-ink-400" />
        <span className="truncate">{it.company?.name || 'Entreprise non définie'}</span>
      </div>
      <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-500">
        <Icon name="calendar" className="w-4 h-4 text-ink-400" />
        <span>{formatDate(it.startDate)} → {formatDate(it.endDate)}</span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-ink-500 mb-1.5">
          <span>Tâches</span>
          <span className="font-medium text-ink-700">{done}/{total}</span>
        </div>
        <ProgressBar value={pct} />
      </div>

      <div className="mt-4 pt-3 border-t border-ink-100 flex items-center justify-between">
        <InternshipStatusBadge status={it.status} />
        <span className="text-xs font-medium text-brand-700 group-hover:underline">Gérer →</span>
      </div>
    </Card>
  )
}
