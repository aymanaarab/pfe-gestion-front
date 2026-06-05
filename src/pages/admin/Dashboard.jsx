import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboardStats } from '../../api/dashboard'
import { internshipDonutData } from '../../lib/charts'
import { apiError } from '../../lib/format'
import {
  StatCard,
  Card,
  CardHeader,
  CardBody,
  DonutChart,
  BarChart,
  SkeletonCard,
  PageLoader,
} from '../../components/ui'
import WelcomeBanner from '../../components/dashboard/WelcomeBanner'
import TaskProgressCard from '../../components/dashboard/TaskProgressCard'
import RecentInternships from '../../components/dashboard/RecentInternships'

export default function AdminDashboard() {
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-32 rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <PageLoader label="Chargement des statistiques…" />
      </div>
    )
  }

  const counts = stats?.counts || {}
  const donut = internshipDonutData(stats?.internshipStatusBreakdown)
  const filiereData = (stats?.studentsPerFiliere || []).map((f) => ({ label: f.name, value: f.count }))

  return (
    <div className="space-y-6">
      <WelcomeBanner subtitle="Voici l’état global de la plateforme aujourd’hui." />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="students" label="Étudiants" value={counts.students || 0} tone="blue" onClick={() => navigate('/admin/students')} />
        <StatCard icon="encadrants" label="Encadrants" value={counts.supervisors || 0} tone="violet" onClick={() => navigate('/admin/encadrants')} />
        <StatCard icon="internships" label="Stages" value={counts.internships || 0} tone="brand" onClick={() => navigate('/admin/internships')} />
        <StatCard icon="companies" label="Entreprises" value={counts.companies || 0} tone="amber" onClick={() => navigate('/admin/companies')} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader title="Répartition des stages" subtitle="Par statut" />
          <CardBody>
            {donut.length ? (
              <DonutChart data={donut} />
            ) : (
              <p className="text-sm text-ink-400 text-center py-10">Aucun stage enregistré</p>
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader title="Étudiants par filière" subtitle={`${counts.filieres || 0} filière(s)`} />
          <CardBody>
            <BarChart data={filiereData} />
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <TaskProgressCard progress={stats?.taskProgress} />
        </div>
        <div className="lg:col-span-3">
          <RecentInternships internships={stats?.recentInternships} />
        </div>
      </div>
    </div>
  )
}
