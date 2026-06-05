import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../context/auth-context'
import { getMe } from '../../api/auth'
import {
  searchInternships,
  updateInternshipStatus,
  assignCompany,
  assignProfessionalSupervisor,
} from '../../api/internships'
import { getCompanies } from '../../api/companies'
import { getProfessionalSupervisors } from '../../api/professionalSupervisors'
import {
  apiError,
  pagedContent,
  fullName,
  formatDate,
  durationLabel,
  INTERNSHIP_STATUS,
  INTERNSHIP_STATUS_ORDER,
} from '../../lib/format'
import { Icon } from '../../components/icons'
import {
  PageHeader,
  DataTable,
  Modal,
  Field,
  Select,
  SearchInput,
  EmptyState,
  SkeletonRows,
  Avatar,
  Button,
  useToast,
  InternshipStatusBadge,
} from '../../components/ui'

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
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

export default function ResponsableInternships() {
  const { user } = useAuth()
  const toast = useToast()
  const [filiereId, setFiliereId] = useState(null)
  const [internships, setInternships] = useState([])
  const [companies, setCompanies] = useState([])
  const [proSupervisors, setProSupervisors] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [detail, setDetail] = useState(null)

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
      const result = await Promise.all([
        searchInternships({ filiereId: fid, size: 500 }),
        getCompanies({ size: 500 }),
        getProfessionalSupervisors({ size: 500 }),
      ]).catch(() => null)
      if (!active) return
      setFiliereId(fid)
      if (result) {
        const [iRes, cRes, pRes] = result
        setInternships(pagedContent(iRes).items)
        setCompanies(pagedContent(cRes).items)
        setProSupervisors(pagedContent(pRes).items)
      } else {
        toast.error('Erreur lors du chargement des stages')
      }
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [user?.filiereId, toast])

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

  const applyChange = async (fn, msg) => {
    try {
      await fn()
      toast.success(msg)
      const res = await searchInternships({ filiereId, size: 500 })
      const items = pagedContent(res).items
      setInternships(items)
      setDetail((prev) => (prev ? items.find((x) => x.id === prev.id) || prev : prev))
    } catch (err) {
      toast.error(apiError(err))
    }
  }

  const columns = [
    {
      key: 'student',
      header: 'Étudiant',
      render: (it) => (
        <div className="flex items-center gap-3">
          <Avatar firstName={it.student?.firstName} lastName={it.student?.lastName} size="sm" />
          <div className="min-w-0">
            <p className="font-medium text-ink-900 truncate">{fullName(it.student)}</p>
            <p className="text-xs text-ink-500 truncate max-w-[16rem]">{it.subject}</p>
          </div>
        </div>
      ),
    },
    { key: 'company', header: 'Entreprise', render: (it) => it.company?.name || <span className="text-ink-400">—</span> },
    { key: 'supervisor', header: 'Encadrant', render: (it) => (it.academicSupervisor ? fullName(it.academicSupervisor) : <span className="text-ink-400">—</span>) },
    { key: 'status', header: 'Statut', render: (it) => <InternshipStatusBadge status={it.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (it) => (
        <button onClick={() => setDetail(it)} className="p-2 rounded-lg text-ink-500 hover:text-brand-700 hover:bg-brand-50 transition" title="Détails">
          <Icon name="external-link" className="w-4 h-4" />
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Stages" description="Stages de votre filière" />

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={query} onChange={setQuery} placeholder="Sujet, étudiant ou entreprise…" className="flex-1 max-w-md" />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-52">
          <option value="">Tous les statuts</option>
          {INTERNSHIP_STATUS_ORDER.map((s) => <option key={s} value={s}>{INTERNSHIP_STATUS[s].label}</option>)}
        </Select>
      </div>

      {loading ? (
        <SkeletonRows />
      ) : !filiereId ? (
        <EmptyState icon="filieres" title="Aucune filière assignée" description="Contactez l’administration pour être rattaché à une filière." />
      ) : filtered.length === 0 ? (
        <EmptyState icon="internships" title="Aucun stage" description={query || statusFilter ? 'Aucun résultat pour ces critères.' : 'Aucun stage dans cette filière.'} />
      ) : (
        <DataTable columns={columns} rows={filtered} onRowClick={setDetail} />
      )}

      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.subject}
        subtitle={detail ? `${fullName(detail.student)} · ${detail.student?.cne || ''}` : ''}
        size="lg"
        footer={<Button variant="secondary" onClick={() => setDetail(null)}>Fermer</Button>}
      >
        {detail && (
          <div className="space-y-6">
            <InternshipStatusBadge status={detail.status} />
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoRow icon="companies" label="Entreprise" value={detail.company?.name} />
              <InfoRow icon="encadrants" label="Encadrant académique" value={detail.academicSupervisor ? fullName(detail.academicSupervisor) : null} />
              <InfoRow icon="calendar" label="Période" value={`${formatDate(detail.startDate)} → ${formatDate(detail.endDate)}`} />
              <InfoRow icon="clock" label="Durée" value={durationLabel(detail.startDate, detail.endDate)} />
            </div>

            <div className="border-t border-ink-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-3">Validation & affectations</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Statut">
                  <Select value={detail.status} onChange={(e) => applyChange(() => updateInternshipStatus(detail.id, e.target.value), 'Statut mis à jour')}>
                    {INTERNSHIP_STATUS_ORDER.map((s) => <option key={s} value={s}>{INTERNSHIP_STATUS[s].label}</option>)}
                  </Select>
                </Field>
                <Field label="Entreprise">
                  <Select value={detail.company?.id || ''} onChange={(e) => e.target.value && applyChange(() => assignCompany(detail.id, e.target.value), 'Entreprise affectée')}>
                    <option value="">Affecter…</option>
                    {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Select>
                </Field>
                <Field label="Encadrant professionnel" className="sm:col-span-2">
                  <Select value={detail.professionalSupervisor?.id || ''} onChange={(e) => e.target.value && applyChange(() => assignProfessionalSupervisor(detail.id, e.target.value), 'Encadrant professionnel affecté')}>
                    <option value="">Affecter…</option>
                    {proSupervisors.map((s) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                  </Select>
                </Field>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
