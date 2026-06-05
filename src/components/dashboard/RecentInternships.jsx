import { Card, CardHeader } from '../ui/Card'
import { InternshipStatusBadge } from '../ui/StatusBadge'
import Avatar from '../ui/Avatar'
import EmptyState from '../ui/EmptyState'
import { fullName, formatDate } from '../../lib/format'

export default function RecentInternships({ internships = [], title = 'Stages récents' }) {
  return (
    <Card>
      <CardHeader title={title} subtitle={`${internships.length} affiché(s)`} />
      {internships.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon="internships"
            title="Aucun stage récent"
            description="Les nouveaux stages apparaîtront ici."
          />
        </div>
      ) : (
        <div className="divide-y divide-ink-100 mt-2">
          {internships.map((it) => (
            <div key={it.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-ink-50/60 transition">
              <Avatar firstName={it.student?.firstName} lastName={it.student?.lastName} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink-900 truncate">{it.subject}</p>
                <p className="text-xs text-ink-500 truncate">
                  {fullName(it.student)} · {it.company?.name || 'Entreprise non définie'}
                </p>
              </div>
              <div className="hidden sm:block text-xs text-ink-400 shrink-0">{formatDate(it.startDate)}</div>
              <InternshipStatusBadge status={it.status} />
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
