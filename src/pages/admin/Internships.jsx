import { useState, useEffect, useMemo } from 'react'
import {
  getInternships,
  createInternship,
  updateInternship,
  deleteInternship,
  updateInternshipStatus,
  assignCompany,
  assignAcademicSupervisor,
  assignProfessionalSupervisor,
} from '../../api/internships'
import { getStudents } from '../../api/students'
import { getCompanies } from '../../api/companies'
import { getAcademicSupervisors } from '../../api/academicSupervisors'
import { getProfessionalSupervisors } from '../../api/professionalSupervisors'
import { apiError, pagedContent, fullName, formatDate, durationLabel, INTERNSHIP_STATUS, INTERNSHIP_STATUS_ORDER } from '../../lib/format'
import { Icon } from '../../components/icons'
import {
  PageHeader,
  Button,
  DataTable,
  Modal,
  Field,
  Input,
  Textarea,
  Select,
  EmptyState,
  SearchInput,
  SkeletonRows,
  Pagination,
  Avatar,
  useToast,
  useConfirm,
  InternshipStatusBadge,
} from '../../components/ui'

const PAGE_SIZE = 8
const EMPTY = {
  subject: '',
  description: '',
  objectives: '',
  methodology: '',
  technologies: '',
  startDate: '',
  endDate: '',
  status: 'PENDING',
  studentId: '',
  companyId: '',
  academicSupervisorId: '',
  professionalSupervisorId: '',
}

export default function Internships() {
  const toast = useToast()
  const confirm = useConfirm()
  const [internships, setInternships] = useState([])
  const [students, setStudents] = useState([])
  const [companies, setCompanies] = useState([])
  const [supervisors, setSupervisors] = useState([])
  const [proSupervisors, setProSupervisors] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(0)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const [detail, setDetail] = useState(null)

  const reload = () =>
    Promise.all([
      getInternships({ size: 500 }),
      getStudents({ size: 500 }),
      getCompanies({ size: 500 }),
      getAcademicSupervisors({ size: 500 }),
      getProfessionalSupervisors({ size: 500 }),
    ])
      .then(([iRes, sRes, cRes, supRes, proRes]) => {
        setInternships(pagedContent(iRes).items)
        setStudents(pagedContent(sRes).items)
        setCompanies(pagedContent(cRes).items)
        setSupervisors(pagedContent(supRes).items)
        setProSupervisors(pagedContent(proRes).items)
      })
      .catch((err) => toast.error(apiError(err)))

  useEffect(() => {
    reload().finally(() => setLoading(false))
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)
  const pageItems = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  const availableStudents = useMemo(
    () => students.filter((s) => !s.internship || s.id === editing?.student?.id),
    [students, editing],
  )

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY)
    setFormOpen(true)
  }

  const openEdit = (it) => {
    setEditing(it)
    setForm({
      subject: it.subject || '',
      description: it.description || '',
      objectives: it.objectives || '',
      methodology: it.methodology || '',
      technologies: it.technologies || '',
      startDate: it.startDate || '',
      endDate: it.endDate || '',
      status: it.status || 'PENDING',
      studentId: it.student?.id ? String(it.student.id) : '',
      companyId: it.company?.id ? String(it.company.id) : '',
      academicSupervisorId: it.academicSupervisor?.id ? String(it.academicSupervisor.id) : '',
      professionalSupervisorId: it.professionalSupervisor?.id ? String(it.professionalSupervisor.id) : '',
    })
    setFormOpen(true)
  }

  const toId = (v) => (v ? parseInt(v, 10) : null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.endDate && form.startDate && form.endDate < form.startDate) {
      toast.error('La date de fin doit suivre la date de début')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        studentId: toId(form.studentId),
        companyId: toId(form.companyId),
        academicSupervisorId: toId(form.academicSupervisorId),
        professionalSupervisorId: toId(form.professionalSupervisorId),
      }
      if (editing) {
        await updateInternship(editing.id, payload)
        toast.success('Stage mis à jour')
      } else {
        await createInternship(payload)
        toast.success('Stage créé')
      }
      setFormOpen(false)
      reload()
    } catch (err) {
      toast.error(apiError(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (it) => {
    const ok = await confirm({
      title: 'Supprimer le stage',
      message: `Le stage « ${it.subject} » sera supprimé définitivement.`,
      confirmLabel: 'Supprimer',
    })
    if (!ok) return
    try {
      await deleteInternship(it.id)
      toast.success('Stage supprimé')
      setDetail(null)
      reload()
    } catch (err) {
      toast.error(apiError(err))
    }
  }

  const applyChange = async (fn, successMsg) => {
    try {
      await fn()
      toast.success(successMsg)
      const res = await getInternships({ size: 500 })
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
    {
      key: 'supervisor',
      header: 'Encadrant',
      render: (it) => (it.academicSupervisor ? fullName(it.academicSupervisor) : <span className="text-ink-400">—</span>),
    },
    {
      key: 'period',
      header: 'Période',
      render: (it) => <span className="text-xs text-ink-500 whitespace-nowrap">{formatDate(it.startDate)} → {formatDate(it.endDate)}</span>,
    },
    { key: 'status', header: 'Statut', render: (it) => <InternshipStatusBadge status={it.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (it) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => setDetail(it)} className="p-2 rounded-lg text-ink-500 hover:text-brand-700 hover:bg-brand-50 transition" title="Détails">
            <Icon name="external-link" className="w-4 h-4" />
          </button>
          <button onClick={() => openEdit(it)} className="p-2 rounded-lg text-ink-500 hover:text-brand-700 hover:bg-brand-50 transition" title="Modifier">
            <Icon name="edit" className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(it)} className="p-2 rounded-lg text-ink-500 hover:text-red-600 hover:bg-red-50 transition" title="Supprimer">
            <Icon name="trash" className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Stages" description="Suivi de l’ensemble des stages PFE">
        <Button icon="plus" onClick={openCreate} disabled={!students.length}>Nouveau stage</Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(0) }} placeholder="Sujet, étudiant ou entreprise…" className="flex-1 max-w-md" />
        <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0) }} className="sm:w-52">
          <option value="">Tous les statuts</option>
          {INTERNSHIP_STATUS_ORDER.map((s) => (
            <option key={s} value={s}>{INTERNSHIP_STATUS[s].label}</option>
          ))}
        </Select>
      </div>

      {loading ? (
        <SkeletonRows />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="internships"
          title="Aucun stage"
          description={query || statusFilter ? 'Aucun résultat pour ces critères.' : 'Créez le premier stage PFE.'}
        />
      ) : (
        <>
          <DataTable columns={columns} rows={pageItems} onRowClick={setDetail} />
          <Pagination page={safePage} totalPages={totalPages} onPage={setPage} totalElements={filtered.length} />
        </>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Modifier le stage' : 'Nouveau stage'}
        subtitle="Sujet, planning et affectations"
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>Annuler</Button>
            <Button type="submit" form="internship-form" loading={saving}>{editing ? 'Enregistrer' : 'Créer'}</Button>
          </>
        }
      >
        <form id="internship-form" onSubmit={handleSubmit} className="space-y-4">
          <Field label="Sujet du stage" required>
            <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          </Field>
          <Field label="Description">
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Objectifs">
              <Textarea value={form.objectives} onChange={(e) => setForm({ ...form, objectives: e.target.value })} rows={2} />
            </Field>
            <Field label="Technologies">
              <Textarea value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} rows={2} placeholder="Spring Boot, React…" />
            </Field>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Méthodologie">
              <Input value={form.methodology} onChange={(e) => setForm({ ...form, methodology: e.target.value })} placeholder="Agile / Scrum" />
            </Field>
            <Field label="Date de début" required>
              <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            </Field>
            <Field label="Date de fin" required>
              <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Étudiant" required>
              <Select value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required disabled={!!editing}>
                <option value="">Sélectionner…</option>
                {availableStudents.map((s) => (
                  <option key={s.id} value={s.id}>{s.user?.firstName} {s.user?.lastName} ({s.cne})</option>
                ))}
              </Select>
            </Field>
            <Field label="Statut" required>
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {INTERNSHIP_STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>{INTERNSHIP_STATUS[s].label}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Entreprise">
              <Select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}>
                <option value="">—</option>
                {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </Field>
            <Field label="Encadrant académique">
              <Select value={form.academicSupervisorId} onChange={(e) => setForm({ ...form, academicSupervisorId: e.target.value })}>
                <option value="">—</option>
                {supervisors.map((s) => <option key={s.id} value={s.id}>{s.user?.firstName} {s.user?.lastName}</option>)}
              </Select>
            </Field>
            <Field label="Encadrant professionnel">
              <Select value={form.professionalSupervisorId} onChange={(e) => setForm({ ...form, professionalSupervisorId: e.target.value })}>
                <option value="">—</option>
                {proSupervisors.map((s) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
              </Select>
            </Field>
          </div>
        </form>
      </Modal>

      <InternshipDetailModal
        internship={detail}
        onClose={() => setDetail(null)}
        companies={companies}
        supervisors={supervisors}
        proSupervisors={proSupervisors}
        onEdit={(it) => { setDetail(null); openEdit(it) }}
        onDelete={handleDelete}
        onStatus={(it, status) => applyChange(() => updateInternshipStatus(it.id, status), 'Statut mis à jour')}
        onCompany={(it, id) => applyChange(() => assignCompany(it.id, id), 'Entreprise affectée')}
        onSupervisor={(it, id) => applyChange(() => assignAcademicSupervisor(it.id, id), 'Encadrant affecté')}
        onProSupervisor={(it, id) => applyChange(() => assignProfessionalSupervisor(it.id, id), 'Encadrant pro affecté')}
      />
    </div>
  )
}

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

function InternshipDetailModal({
  internship,
  onClose,
  companies,
  supervisors,
  proSupervisors,
  onEdit,
  onDelete,
  onStatus,
  onCompany,
  onSupervisor,
  onProSupervisor,
}) {
  const it = internship
  return (
    <Modal
      open={!!it}
      onClose={onClose}
      title={it?.subject}
      subtitle={it ? `${fullName(it.student)} · ${it.student?.cne || ''}` : ''}
      size="xl"
      footer={
        it && (
          <>
            <Button variant="danger-ghost" icon="trash" onClick={() => onDelete(it)}>Supprimer</Button>
            <Button variant="secondary" icon="edit" onClick={() => onEdit(it)}>Modifier</Button>
            <Button variant="secondary" onClick={onClose}>Fermer</Button>
          </>
        )
      }
    >
      {it && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <InternshipStatusBadge status={it.status} />
            <span className="text-xs text-ink-400">
              {it.completedTaskCount ?? 0}/{it.taskCount ?? 0} tâches terminées
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <InfoRow icon="companies" label="Entreprise" value={it.company?.name} />
            <InfoRow icon="encadrants" label="Encadrant académique" value={it.academicSupervisor ? fullName(it.academicSupervisor) : null} />
            <InfoRow icon="user" label="Encadrant professionnel" value={it.professionalSupervisor ? `${it.professionalSupervisor.firstName} ${it.professionalSupervisor.lastName}` : null} />
            <InfoRow icon="calendar" label="Période" value={`${formatDate(it.startDate)} → ${formatDate(it.endDate)}`} />
            <InfoRow icon="clock" label="Durée" value={durationLabel(it.startDate, it.endDate)} />
            <InfoRow icon="layers" label="Technologies" value={it.technologies} />
          </div>

          {(it.description || it.objectives || it.methodology) && (
            <div className="space-y-3 border-t border-ink-100 pt-4">
              {it.description && <DetailBlock label="Description" text={it.description} />}
              {it.objectives && <DetailBlock label="Objectifs" text={it.objectives} />}
              {it.methodology && <DetailBlock label="Méthodologie" text={it.methodology} />}
            </div>
          )}

          <div className="border-t border-ink-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-3">Gestion rapide</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Statut">
                <Select value={it.status} onChange={(e) => onStatus(it, e.target.value)}>
                  {INTERNSHIP_STATUS_ORDER.map((s) => <option key={s} value={s}>{INTERNSHIP_STATUS[s].label}</option>)}
                </Select>
              </Field>
              <Field label="Entreprise">
                <Select value={it.company?.id || ''} onChange={(e) => e.target.value && onCompany(it, e.target.value)}>
                  <option value="">Affecter…</option>
                  {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </Field>
              <Field label="Encadrant académique">
                <Select value={it.academicSupervisor?.id || ''} onChange={(e) => e.target.value && onSupervisor(it, e.target.value)}>
                  <option value="">Affecter…</option>
                  {supervisors.map((s) => <option key={s.id} value={s.id}>{s.user?.firstName} {s.user?.lastName}</option>)}
                </Select>
              </Field>
              <Field label="Encadrant professionnel">
                <Select value={it.professionalSupervisor?.id || ''} onChange={(e) => e.target.value && onProSupervisor(it, e.target.value)}>
                  <option value="">Affecter…</option>
                  {proSupervisors.map((s) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                </Select>
              </Field>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

function DetailBlock({ label, text }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</p>
      <p className="text-sm text-ink-700 mt-1 whitespace-pre-line leading-relaxed">{text}</p>
    </div>
  )
}
