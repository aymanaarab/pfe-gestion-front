import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getInternship } from '../../api/internships'
import { apiError } from '../../lib/format'
import { Button, Card, CardHeader, CardBody, PageLoader, EmptyState } from '../../components/ui'
import InternshipDetailCard from '../../components/internship/InternshipDetailCard'
import TaskBoard from '../../components/tasks/TaskBoard'

export default function EncadrantInternshipDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [internship, setInternship] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getInternship(id)
      .then((res) => setInternship(res.data.data))
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <PageLoader />

  if (error || !internship) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" icon="chevron-left" onClick={() => navigate('/encadrant/internships')}>Retour</Button>
        <EmptyState icon="internships" title="Stage introuvable" description={error || 'Ce stage n’existe pas ou ne vous est pas accessible.'} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" icon="chevron-left" onClick={() => navigate('/encadrant/internships')}>Retour aux stages</Button>

      <InternshipDetailCard internship={internship} />

      <Card>
        <CardHeader title="Tâches du stage" subtitle="Créez et suivez les tâches de l’étudiant" />
        <CardBody>
          <TaskBoard internshipId={internship.id} canManage />
        </CardBody>
      </Card>
    </div>
  )
}
