import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../context/auth-context'
import { getMe } from '../../api/auth'
import { getStudentsByFiliere } from '../../api/students'
import { pagedContent } from '../../lib/format'
import {
  PageHeader,
  DataTable,
  SearchInput,
  EmptyState,
  SkeletonRows,
  Badge,
  Avatar,
} from '../../components/ui'

export default function ResponsableStudents() {
  const { user } = useAuth()
  const [filiereId, setFiliereId] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      let fid = user?.filiereId
      if (!fid) {
        const me = await getMe().catch(() => null)
        fid = me?.data?.data?.filiereId || null
      }
      if (!fid) {
        if (active) {
          setFiliereId(null)
          setLoading(false)
        }
        return
      }
      const res = await getStudentsByFiliere(fid, { size: 500 }).catch(() => null)
      if (!active) return
      setFiliereId(fid)
      setStudents(res ? pagedContent(res).items : [])
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [user?.filiereId])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return students
    return students.filter(
      (s) =>
        s.cne?.toLowerCase().includes(q) ||
        s.user?.firstName?.toLowerCase().includes(q) ||
        s.user?.lastName?.toLowerCase().includes(q) ||
        s.user?.email?.toLowerCase().includes(q),
    )
  }, [students, query])

  const columns = [
    {
      key: 'student',
      header: 'Étudiant',
      render: (s) => (
        <div className="flex items-center gap-3">
          <Avatar firstName={s.user?.firstName} lastName={s.user?.lastName} size="sm" />
          <div className="min-w-0">
            <p className="font-medium text-ink-900 truncate">{s.user?.firstName} {s.user?.lastName}</p>
            <p className="text-xs text-ink-500 truncate">{s.user?.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'cne', header: 'CNE', render: (s) => <span className="font-mono text-xs text-ink-600">{s.cne}</span> },
    { key: 'level', header: 'Niveau', render: (s) => s.level || '—' },
    {
      key: 'internship',
      header: 'Stage',
      render: (s) =>
        s.internship ? (
          <Badge tone="green" dot>Affecté</Badge>
        ) : (
          <Badge tone="gray" dot>Aucun</Badge>
        ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Étudiants" description="Étudiants de votre filière" />

      <SearchInput value={query} onChange={setQuery} placeholder="Nom, CNE ou email…" className="max-w-md" />

      {loading ? (
        <SkeletonRows />
      ) : !filiereId ? (
        <EmptyState icon="filieres" title="Aucune filière assignée" description="Contactez l’administration pour être rattaché à une filière." />
      ) : filtered.length === 0 ? (
        <EmptyState icon="students" title="Aucun étudiant" description={query ? 'Aucun résultat pour cette recherche.' : 'Aucun étudiant dans cette filière.'} />
      ) : (
        <DataTable columns={columns} rows={filtered} />
      )}
    </div>
  )
}
