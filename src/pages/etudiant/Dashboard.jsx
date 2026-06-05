import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboardStats } from '../../api/dashboard'
import { apiError, fullName, formatDate } from '../../lib/format'
import { Card, CardBody, Button, PageLoader, EmptyState } from '../../components/ui'
import { InternshipStatusBadge } from '../../components/ui/StatusBadge'
import WelcomeBanner, { BannerStat } from '../../components/dashboard/WelcomeBanner'
import TaskProgressCard from '../../components/dashboard/TaskProgressCard'
import { Icon } from '../../components/icons'

function MiniInfo({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-9 h-9 rounded-lg bg-ink-100 text-ink-500 flex items-center justify-center shrink-0">
        <Icon name={icon} className="w-4 h-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-ink-400">{label}</p>
        <p className="text-sm text-ink-800 font-medium truncate">{value || '—'}</p>
      </div>
    </div>
  )
}

export default function EtudiantDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data.data))
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  const progress = stats?.taskProgress
  const it = stats?.myInternship

  return (
    <div className="space-y-6">
      <WelcomeBanner subtitle="Suivez l’avancement de votre projet de fin d’études.">
        <div className="flex gap-3">
          <BannerStat icon="tasks" label="Tâches" value={progress?.total ?? 0} />
          <BannerStat icon="check-circle" label="Terminées" value={progress?.completed ?? 0} />
        </div>
      </WelcomeBanner>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      {!it ? (
        <EmptyState
          icon="internships"
          title="Aucun stage assigné"
          description="Votre stage PFE n’a pas encore été créé. Contactez le responsable de votre filière."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <div className="p-5 sm:p-6 bg-gradient-to-br from-brand-50 to-white border-b border-ink-100 rounded-t-2xl flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Mon stage</p>
                <h2 className="font-display text-xl font-bold text-ink-900 mt-1">{it.subject}</h2>
              </div>
              <InternshipStatusBadge status={it.status} />
            </div>
            <CardBody className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <MiniInfo icon="companies" label="Entreprise" value={it.company?.name} />
                <MiniInfo icon="encadrants" label="Encadrant" value={it.academicSupervisor ? fullName(it.academicSupervisor) : null} />
                <MiniInfo icon="calendar" label="Début" value={formatDate(it.startDate)} />
                <MiniInfo icon="flag" label="Fin" value={formatDate(it.endDate)} />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button icon="internships" variant="secondary" onClick={() => navigate('/etudiant/internship')}>
                  Détails du stage
                </Button>
                <Button icon="tasks" onClick={() => navigate('/etudiant/tasks')}>
                  Mes tâches
                </Button>
              </div>
            </CardBody>
          </Card>

          <div className="lg:col-span-2">
            <TaskProgressCard progress={progress} />
          </div>
        </div>
      )}
    </div>
  )
}
