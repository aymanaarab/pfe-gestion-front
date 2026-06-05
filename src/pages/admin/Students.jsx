import { useState, useEffect, useMemo } from 'react'
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../api/students'
import { getFilieres } from '../../api/filieres'
import { apiError, pagedContent } from '../../lib/format'
import { Icon } from '../../components/icons'
import {
  PageHeader,
  Button,
  DataTable,
  Modal,
  Field,
  Input,
  Select,
  EmptyState,
  SearchInput,
  SkeletonRows,
  Pagination,
  Badge,
  Avatar,
  useToast,
  useConfirm,
} from '../../components/ui'

const LEVELS = ['1ère année', '2ème année', '3ème année', '4ème année', '5ème année']
const PAGE_SIZE = 8
const EMPTY = {
  cne: '',
  cneMassar: '',
  level: '2ème année',
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  password: '',
  filiereId: '',
}

export default function Students() {
  const toast = useToast()
  const confirm = useConfirm()
  const [students, setStudents] = useState([])
  const [filieres, setFilieres] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [filiereFilter, setFiliereFilter] = useState('')
  const [page, setPage] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const reload = () =>
    Promise.all([getStudents({ size: 500 }), getFilieres({ size: 200 })])
      .then(([sRes, fRes]) => {
        setStudents(pagedContent(sRes).items)
        setFilieres(pagedContent(fRes).items)
      })
      .catch((err) => toast.error(apiError(err)))

  useEffect(() => {
    reload().finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return students.filter((s) => {
      const matchQ =
        !q ||
        s.cne?.toLowerCase().includes(q) ||
        s.user?.firstName?.toLowerCase().includes(q) ||
        s.user?.lastName?.toLowerCase().includes(q) ||
        s.user?.email?.toLowerCase().includes(q)
      const matchF = !filiereFilter || String(s.filiere?.id) === filiereFilter
      return matchQ && matchF
    })
  }, [students, query, filiereFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)
  const pageItems = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  const openCreate = () => {
    setEditing(null)
    setForm({ ...EMPTY, filiereId: filieres[0]?.id ? String(filieres[0].id) : '' })
    setModalOpen(true)
  }

  const openEdit = (s) => {
    setEditing(s)
    setForm({
      cne: s.cne || '',
      cneMassar: s.cneMassar || '',
      level: s.level || '2ème année',
      email: s.user?.email || '',
      firstName: s.user?.firstName || '',
      lastName: s.user?.lastName || '',
      phone: s.user?.phone || '',
      password: '',
      filiereId: s.filiere?.id ? String(s.filiere.id) : '',
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, filiereId: parseInt(form.filiereId, 10) }
      if (editing) {
        if (!payload.password) delete payload.password
        await updateStudent(editing.id, payload)
        toast.success('Étudiant mis à jour')
      } else {
        await createStudent(payload)
        toast.success('Étudiant créé')
      }
      setModalOpen(false)
      reload()
    } catch (err) {
      toast.error(apiError(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (s) => {
    const ok = await confirm({
      title: 'Supprimer l’étudiant',
      message: `${s.user?.firstName} ${s.user?.lastName} sera supprimé définitivement.`,
      confirmLabel: 'Supprimer',
    })
    if (!ok) return
    try {
      await deleteStudent(s.id)
      toast.success('Étudiant supprimé')
      reload()
    } catch (err) {
      toast.error(apiError(err))
    }
  }

  const columns = [
    {
      key: 'student',
      header: 'Étudiant',
      render: (s) => (
        <div className="flex items-center gap-3">
          <Avatar firstName={s.user?.firstName} lastName={s.user?.lastName} size="sm" />
          <div className="min-w-0">
            <p className="font-medium text-ink-900 truncate">
              {s.user?.firstName} {s.user?.lastName}
            </p>
            <p className="text-xs text-ink-500 truncate">{s.user?.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'cne', header: 'CNE', render: (s) => <span className="font-mono text-xs text-ink-600">{s.cne}</span> },
    { key: 'level', header: 'Niveau', render: (s) => s.level || '—' },
    {
      key: 'filiere',
      header: 'Filière',
      render: (s) => (s.filiere ? <Badge tone="green">{s.filiere.code}</Badge> : '—'),
    },
    {
      key: 'internship',
      header: 'Stage',
      render: (s) =>
        s.internship ? (
          <span className="text-brand-700 text-xs font-medium">Affecté</span>
        ) : (
          <span className="text-ink-400 text-xs">Aucun</span>
        ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (s) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => openEdit(s)} className="p-2 rounded-lg text-ink-500 hover:text-brand-700 hover:bg-brand-50 transition" title="Modifier">
            <Icon name="edit" className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(s)} className="p-2 rounded-lg text-ink-500 hover:text-red-600 hover:bg-red-50 transition" title="Supprimer">
            <Icon name="trash" className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Étudiants" description="Gérez les étudiants inscrits">
        <Button icon="plus" onClick={openCreate} disabled={!filieres.length}>Nouvel étudiant</Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(0) }} placeholder="Nom, CNE ou email…" className="flex-1 max-w-md" />
        <Select value={filiereFilter} onChange={(e) => { setFiliereFilter(e.target.value); setPage(0) }} className="sm:w-56">
          <option value="">Toutes les filières</option>
          {filieres.map((f) => (
            <option key={f.id} value={f.id}>{f.code} — {f.name}</option>
          ))}
        </Select>
      </div>

      {loading ? (
        <SkeletonRows />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="students"
          title="Aucun étudiant"
          description={query || filiereFilter ? 'Aucun résultat pour ces critères.' : 'Ajoutez votre premier étudiant.'}
        />
      ) : (
        <>
          <DataTable columns={columns} rows={pageItems} />
          <Pagination page={safePage} totalPages={totalPages} onPage={setPage} totalElements={filtered.length} />
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier l’étudiant' : 'Nouvel étudiant'}
        subtitle="Informations personnelles et académiques"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button type="submit" form="student-form" loading={saving}>{editing ? 'Enregistrer' : 'Créer'}</Button>
          </>
        }
      >
        <form id="student-form" onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <Field label="Prénom" required>
            <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
          </Field>
          <Field label="Nom" required>
            <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
          </Field>
          <Field label="Email" required className="sm:col-span-2">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </Field>
          <Field label="CNE" required>
            <Input value={form.cne} onChange={(e) => setForm({ ...form, cne: e.target.value })} required />
          </Field>
          <Field label="Code Massar">
            <Input value={form.cneMassar} onChange={(e) => setForm({ ...form, cneMassar: e.target.value })} />
          </Field>
          <Field label="Téléphone">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="Niveau" required>
            <Select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </Select>
          </Field>
          <Field label="Filière" required className="sm:col-span-2">
            <Select value={form.filiereId} onChange={(e) => setForm({ ...form, filiereId: e.target.value })} required>
              <option value="">Sélectionner…</option>
              {filieres.map((f) => <option key={f.id} value={f.id}>{f.code} — {f.name}</option>)}
            </Select>
          </Field>
          <Field
            label={editing ? 'Nouveau mot de passe' : 'Mot de passe'}
            required={!editing}
            hint={editing ? 'Laisser vide pour conserver le mot de passe actuel' : 'Minimum 8 caractères'}
            className="sm:col-span-2"
          >
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required={!editing}
              minLength={8}
              autoComplete="new-password"
            />
          </Field>
        </form>
      </Modal>
    </div>
  )
}
