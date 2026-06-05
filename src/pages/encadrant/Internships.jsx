import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboardStats } from '../../api/dashboard'
import { apiError, fullName, INTERNSHIP_STATUS, INTERNSHIP_STATUS_ORDER } from '../../lib/format'
import { PageHeader, SearchInput, Select, EmptyState, PageLoader } from '../../components/ui'
import InternshipCard from '../../components/internship/InternshipCard'

export default function EncadrantInternships() {
  const navigate = useNavigate()
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    getDashboardStats()
      .then((res) => setInternships(res.data.data?.supervisedInternships || []))
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return internships.filter((it) => {
      const matchQ =
        !q ||
        it.subject?.toLowerCase().includes(q) ||
        fullName(it.student).toLowerCase().includes(q) ||
        it.company?.name?.toLowerCase().includes(q)
      const matchS = !statusFilter || it.status === statusFilter
      return matchQ && matchS
    })
  }, [internships, query, statusFilter])

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <PageHeader title="Mes stages" description="Stages dont vous êtes l’encadrant académique" />

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={query} onChange={setQuery} placeholder="Sujet, étudiant ou entreprise…" className="flex-1 max-w-md" />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-52">
          <option value="">Tous les statuts</option>
          {INTERNSHIP_STATUS_ORDER.map((s) => <option key={s} value={s}>{INTERNSHIP_STATUS[s].label}</option>)}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="internships"
          title="Aucun stage"
          description={query || statusFilter ? 'Aucun résultat pour ces critères.' : 'Aucun stage ne vous est encore affecté.'}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it) => (
            <InternshipCard key={it.id} internship={it} onClick={() => navigate(`/encadrant/internships/${it.id}`)} />
          ))}
        </div>
      )}
    </div>
  )
}
