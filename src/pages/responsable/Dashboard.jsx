import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import { getDashboardStats } from '../../api/dashboard'
import { internshipDonutData } from '../../lib/charts'
import { apiError } from '../../lib/format'
import { StatCard, Card, CardHeader, CardBody, DonutChart, PageLoader } from '../../components/ui'
import WelcomeBanner from '../../components/dashboard/WelcomeBanner'
import TaskProgressCard from '../../components/dashboard/TaskProgressCard'
import RecentInternships from '../../components/dashboard/RecentInternships'

export default function ResponsableDashboard() {
  const { user } = useAuth()
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

  const counts = stats?.counts || {}
  const donut = internshipDonutData(stats?.internshipStatusBreakdown)

  return (
    <div className="space-y-6">
      <WelcomeBanner subtitle={user?.filiereName ? `Filière ${user.filiereName}` : 'Responsable de filière'} />

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      {!user?.filiereId && !error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm">
          Aucune filière ne vous est encore assignée. Contactez l’administration.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard icon="students" label="Étudiants de la filière" value={counts.students || 0} tone="blue" onClick={() => navigate('/responsable/students')} />
        <StatCard icon="internships" label="Stages de la filière" value={counts.internships || 0} tone="brand" onClick={() => navigate('/responsable/internships')} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader title="Stages par statut" />
          <CardBody>
            {donut.length ? <DonutChart data={donut} /> : <p className="text-sm text-ink-400 text-center py-10">Aucun stage</p>}
          </CardBody>
        </Card>
        <div className="lg:col-span-3">
          <TaskProgressCard progress={stats?.taskProgress} />
        </div>
      </div>

      <RecentInternships internships={stats?.recentInternships} title="Stages récents de la filière" />
    </div>
  )
}
