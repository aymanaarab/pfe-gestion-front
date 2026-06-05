import { useState, useEffect, useMemo } from 'react'
import {
  getAcademicSupervisors,
  createAcademicSupervisor,
  updateAcademicSupervisor,
  deleteAcademicSupervisor,
} from '../../api/academicSupervisors'
import { apiError, pagedContent } from '../../lib/format'
import { Icon } from '../../components/icons'
import {
  PageHeader,
  Button,
  DataTable,
  Modal,
  Field,
  Input,
  EmptyState,
  SearchInput,
  SkeletonRows,
  Badge,
  Avatar,
  useToast,
  useConfirm,
} from '../../components/ui'

const EMPTY = { firstName: '', lastName: '', email: '', phone: '', grade: '', researchTopic: '', password: '' }

export default function Encadrants() {
  const toast = useToast()
  const confirm = useConfirm()
  const [supervisors, setSupervisors] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const reload = () =>
    getAcademicSupervisors({ size: 500 })
      .then((res) => setSupervisors(pagedContent(res).items))
      .catch((err) => toast.error(apiError(err)))

  useEffect(() => {
    reload().finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return supervisors
    return supervisors.filter(
      (s) =>
        s.user?.firstName?.toLowerCase().includes(q) ||
        s.user?.lastName?.toLowerCase().includes(q) ||
        s.user?.email?.toLowerCase().includes(q) ||
        s.grade?.toLowerCase().includes(q) ||
        s.researchTopic?.toLowerCase().includes(q),
    )
  }, [supervisors, query])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  const openEdit = (s) => {
    setEditing(s)
    setForm({
      firstName: s.user?.firstName || '',
      lastName: s.user?.lastName || '',
      email: s.user?.email || '',
      phone: s.user?.phone || '',
      grade: s.grade || '',
      researchTopic: s.researchTopic || '',
      password: '',
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form }
      if (editing) {
        if (!payload.password) delete payload.password
        await updateAcademicSupervisor(editing.id, payload)
        toast.success('Encadrant mis à jour')
      } else {
        await createAcademicSupervisor(payload)
        toast.success('Encadrant créé')
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
      title: 'Supprimer l’encadrant',
      message: `${s.user?.firstName} ${s.user?.lastName} sera supprimé définitivement.`,
      confirmLabel: 'Supprimer',
    })
    if (!ok) return
    try {
      await deleteAcademicSupervisor(s.id)
      toast.success('Encadrant supprimé')
      reload()
    } catch (err) {
      toast.error(apiError(err))
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Encadrant',
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
    { key: 'grade', header: 'Grade', render: (s) => s.grade || '—' },
    {
      key: 'researchTopic',
      header: 'Thème de recherche',
      render: (s) => <span className="text-ink-500 line-clamp-1">{s.researchTopic || '—'}</span>,
    },
    {
      key: 'internshipCount',
      header: 'Stages',
      render: (s) => <Badge tone="blue">{s.internshipCount ?? 0}</Badge>,
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
      <PageHeader title="Encadrants académiques" description="Gérez le corps encadrant">
        <Button icon="plus" onClick={openCreate}>Nouvel encadrant</Button>
      </PageHeader>

      <SearchInput value={query} onChange={setQuery} placeholder="Nom, email, grade ou thème…" className="max-w-md" />

      {loading ? (
        <SkeletonRows />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="encadrants"
          title="Aucun encadrant"
          description={query ? 'Aucun résultat pour cette recherche.' : 'Ajoutez votre premier encadrant.'}
        />
      ) : (
        <DataTable columns={columns} rows={filtered} />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier l’encadrant' : 'Nouvel encadrant'}
        subtitle="Coordonnées et profil académique"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button type="submit" form="encadrant-form" loading={saving}>{editing ? 'Enregistrer' : 'Créer'}</Button>
          </>
        }
      >
        <form id="encadrant-form" onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <Field label="Prénom" required>
            <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
          </Field>
          <Field label="Nom" required>
            <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
          </Field>
          <Field label="Email" required>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </Field>
          <Field label="Téléphone">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="Grade" required>
            <Input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} placeholder="Professeur" required />
          </Field>
          <Field label="Thème de recherche">
            <Input value={form.researchTopic} onChange={(e) => setForm({ ...form, researchTopic: e.target.value })} placeholder="Intelligence Artificielle" />
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
