import { useState, useEffect } from 'react'
import { getDashboardStats } from '../../api/dashboard'
import { apiError } from '../../lib/format'
import { PageHeader, PageLoader, EmptyState } from '../../components/ui'
import InternshipDetailCard from '../../components/internship/InternshipDetailCard'

export default function EtudiantInternship() {
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
      <PageHeader title="Mon stage" description="Détails de votre projet de fin d’études" />
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      {internship ? (
        <InternshipDetailCard internship={internship} />
      ) : (
        <EmptyState
          icon="internships"
          title="Aucun stage assigné"
          description="Votre stage PFE n’a pas encore été créé. Contactez le responsable de votre filière."
        />
      )}
    </div>
  )
}
