import { useState, useEffect, useMemo } from 'react'
import { getFilieres, createFiliere, updateFiliere, deleteFiliere, assignResponsable, unassignResponsable } from '../../api/filieres'
import { getUsersByRole } from '../../api/users'
import { apiError, fullName, pagedContent } from '../../lib/format'
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
  Badge,
  useToast,
  useConfirm,
} from '../../components/ui'

const EMPTY = { code: '', name: '', description: '', responsableId: '' }

export default function Filieres() {
  const toast = useToast()
  const confirm = useConfirm()
  const [filieres, setFilieres] = useState([])
  const [responsables, setResponsables] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const reload = () =>
    getFilieres({ size: 200 })
      .then((res) => setFilieres(pagedContent(res).items))
      .catch((err) => toast.error(apiError(err)))

  useEffect(() => {
    Promise.all([
      reload(),
      getUsersByRole('RESPONSABLE_FILIERE')
        .then((res) => setResponsables(pagedContent(res).items))
        .catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return filieres
    return filieres.filter(
      (f) =>
        f.name?.toLowerCase().includes(q) ||
        f.code?.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q),
    )
  }, [filieres, query])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  const openEdit = (f) => {
    setEditing(f)
    setForm({ code: f.code, name: f.name, description: f.description || '', responsableId: f.responsable?.user?.id ? String(f.responsable.user.id) : '' })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { responsableId, ...data } = form
      let filiereId

      if (editing) {
        await updateFiliere(editing.id, data)
        filiereId = editing.id
        toast.success('Filière mise à jour')
      } else {
        const res = await createFiliere(data)
        filiereId = res.data.data?.id || res.data.id
        toast.success('Filière créée')
      }

      const currentUserId = editing?.responsable?.user?.id
      if (responsableId) {
        if (responsableId !== String(currentUserId ?? '')) {
          await assignResponsable(filiereId, parseInt(responsableId, 10))
        }
      } else if (currentUserId) {
        await unassignResponsable(filiereId)
      }

      setModalOpen(false)
      reload()
    } catch (err) {
      toast.error(apiError(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (f) => {
    const ok = await confirm({
      title: 'Supprimer la filière',
      message: `« ${f.name} » sera supprimée définitivement.`,
      confirmLabel: 'Supprimer',
    })
    if (!ok) return
    try {
      await deleteFiliere(f.id)
      toast.success('Filière supprimée')
      reload()
    } catch (err) {
      toast.error(apiError(err))
    }
  }

  const columns = [
    {
      key: 'code',
      header: 'Code',
      render: (f) => <Badge tone="green">{f.code}</Badge>,
    },
    { key: 'name', header: 'Nom', className: 'font-medium text-ink-900', render: (f) => f.name },
    {
      key: 'description',
      header: 'Description',
      render: (f) => <span className="text-ink-500 line-clamp-1">{f.description || '—'}</span>,
    },
    {
      key: 'responsable',
      header: 'Responsable',
      render: (f) => (f.responsable ? fullName(f.responsable) : <span className="text-ink-400">Non assigné</span>),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (f) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => openEdit(f)} className="p-2 rounded-lg text-ink-500 hover:text-brand-700 hover:bg-brand-50 transition" title="Modifier">
            <Icon name="edit" className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(f)} className="p-2 rounded-lg text-ink-500 hover:text-red-600 hover:bg-red-50 transition" title="Supprimer">
            <Icon name="trash" className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Filières" description="Gérez les filières de la faculté">
        <Button icon="plus" onClick={openCreate}>Nouvelle filière</Button>
      </PageHeader>

      <SearchInput value={query} onChange={setQuery} placeholder="Rechercher une filière…" className="max-w-md" />

      {loading ? (
        <SkeletonRows />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="filieres"
          title="Aucune filière"
          description={query ? 'Aucun résultat pour cette recherche.' : 'Commencez par créer une filière.'}
          action={!query && <Button icon="plus" onClick={openCreate}>Nouvelle filière</Button>}
        />
      ) : (
        <DataTable columns={columns} rows={filtered} />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier la filière' : 'Nouvelle filière'}
        subtitle="Renseignez les informations de la filière"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button type="submit" form="filiere-form" loading={saving}>
              {editing ? 'Enregistrer' : 'Créer'}
            </Button>
          </>
        }
      >
        <form id="filiere-form" onSubmit={handleSubmit} className="space-y-4">
          <Field label="Code" required>
            <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="ex : GI" required />
          </Field>
          <Field label="Nom" required>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Génie Informatique" required />
          </Field>
          <Field label="Description">
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Brève description de la filière" />
          </Field>
          <Field label="Responsable de filière">
            <Select value={form.responsableId} onChange={(e) => setForm({ ...form, responsableId: e.target.value })}>
              <option value="">Non assigné</option>
              {responsables.map((u) => (
                <option key={u.id} value={u.id}>{fullName(u)}</option>
              ))}
            </Select>
          </Field>
        </form>
      </Modal>
    </div>
  )
}
