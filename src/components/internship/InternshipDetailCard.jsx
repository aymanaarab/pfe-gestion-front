import { Card, CardBody } from '../ui/Card'
import { InternshipStatusBadge } from '../ui/StatusBadge'
import { ProgressBar } from '../ui/Progress'
import { Icon } from '../icons'
import { fullName, formatDate, durationLabel } from '../../lib/format'

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-9 h-9 rounded-lg bg-ink-100 text-ink-500 flex items-center justify-center shrink-0">
        <Icon name={icon} className="w-4 h-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-ink-400">{label}</p>
        <p className="text-sm text-ink-800 font-medium break-words">{value || '—'}</p>
      </div>
    </div>
  )
}

function Block({ label, text }) {
  if (!text) return null
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</p>
      <p className="text-sm text-ink-700 mt-1 whitespace-pre-line leading-relaxed">{text}</p>
    </div>
  )
}

export default function InternshipDetailCard({ internship }) {
  const it = internship
  if (!it) return null
  const total = it.taskCount ?? 0
  const done = it.completedTaskCount ?? 0
  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <Card>
      <div className="p-5 sm:p-6 bg-gradient-to-br from-brand-50 to-white border-b border-ink-100 rounded-t-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">{it.subject}</h2>
            <p className="text-sm text-ink-500 mt-1">{fullName(it.student)} · {it.student?.cne}</p>
          </div>
          <InternshipStatusBadge status={it.status} />
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-ink-500 mb-1.5">
            <span>Avancement des tâches</span>
            <span className="font-semibold text-ink-700">{done}/{total} · {pct}%</span>
          </div>
          <ProgressBar value={pct} />
        </div>
      </div>

      <CardBody className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoRow icon="companies" label="Entreprise" value={it.company ? `${it.company.name}${it.company.city ? ` · ${it.company.city}` : ''}` : null} />
          <InfoRow icon="encadrants" label="Encadrant académique" value={it.academicSupervisor ? `${fullName(it.academicSupervisor)}${it.academicSupervisor.grade ? ` · ${it.academicSupervisor.grade}` : ''}` : null} />
          <InfoRow icon="user" label="Encadrant professionnel" value={it.professionalSupervisor ? `${it.professionalSupervisor.firstName} ${it.professionalSupervisor.lastName}` : null} />
          <InfoRow icon="calendar" label="Période" value={`${formatDate(it.startDate)} → ${formatDate(it.endDate)}`} />
          <InfoRow icon="clock" label="Durée" value={durationLabel(it.startDate, it.endDate)} />
          <InfoRow icon="layers" label="Technologies" value={it.technologies} />
        </div>

        {(it.description || it.objectives || it.methodology || it.solution) && (
          <div className="space-y-4 border-t border-ink-100 pt-5">
            <Block label="Description" text={it.description} />
            <Block label="Objectifs" text={it.objectives} />
            <Block label="Méthodologie" text={it.methodology} />
            <Block label="Solution" text={it.solution} />
          </div>
        )}
      </CardBody>
    </Card>
  )
}
