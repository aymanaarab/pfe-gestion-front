import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboardStats } from '../../api/dashboard'
import { internshipDonutData } from '../../lib/charts'
import { apiError } from '../../lib/format'
import { Card, CardHeader, CardBody, DonutChart, PageLoader } from '../../components/ui'
import WelcomeBanner, { BannerStat } from '../../components/dashboard/WelcomeBanner'
import TaskProgressCard from '../../components/dashboard/TaskProgressCard'
import InternshipCard from '../../components/internship/InternshipCard'
import EmptyState from '../../components/ui/EmptyState'

export default function EncadrantDashboard() {
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
  const supervised = stats?.supervisedInternships || []

  return (
    <div className="space-y-6">
      <WelcomeBanner subtitle="Pilotez les stages que vous encadrez.">
        <div className="flex gap-3">
          <BannerStat icon="internships" label="Stages" value={counts.internships ?? 0} />
          <BannerStat icon="check-circle" label="Tâches finies" value={counts.completedTasks ?? 0} />
        </div>
      </WelcomeBanner>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader title="Mes stages par statut" />
          <CardBody>
            {donut.length ? <DonutChart data={donut} /> : <p className="text-sm text-ink-400 text-center py-10">Aucun stage encadré</p>}
          </CardBody>
        </Card>
        <div className="lg:col-span-3">
          <TaskProgressCard progress={stats?.taskProgress} />
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-ink-900 mb-3">Stages encadrés</h2>
        {supervised.length === 0 ? (
          <EmptyState icon="internships" title="Aucun stage encadré" description="Les stages qui vous sont affectés apparaîtront ici." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {supervised.map((it) => (
              <InternshipCard key={it.id} internship={it} onClick={() => navigate(`/encadrant/internships/${it.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
