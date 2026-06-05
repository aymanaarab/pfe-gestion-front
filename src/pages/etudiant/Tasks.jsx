import { useState, useEffect } from 'react'
import { getDashboardStats } from '../../api/dashboard'
import { apiError } from '../../lib/format'
import { PageHeader, PageLoader, EmptyState } from '../../components/ui'
import TaskBoard from '../../components/tasks/TaskBoard'

export default function EtudiantTasks() {
  const [internship, setInternship] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDashboardStats()
      .then((res) => setInternship(res.data.data?.myInternship || null))
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mes tâches"
        description={internship ? internship.subject : 'Suivi de vos tâches de stage'}
      />
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      {internship ? (
        <TaskBoard internshipId={internship.id} canManage={false} />
      ) : (
        <EmptyState
          icon="tasks"
          title="Aucun stage assigné"
          description="Vous pourrez suivre vos tâches dès qu’un stage vous sera attribué."
        />
      )}
    </div>
  )
}
