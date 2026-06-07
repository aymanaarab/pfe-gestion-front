import { useState, useEffect, useMemo } from 'react'
import { createResponsable, updateResponsable, deleteResponsable } from '../../api/responsables'
import { getUsersByRole } from '../../api/users'
import { getFilieres, assignResponsable, unassignResponsable } from '../../api/filieres'
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
  Badge,
  useToast,
  useConfirm,
} from '../../components/ui'

const EMPTY = { firstName: '', lastName: '', email: '', password: '', filiereId: '' }

export default function Responsables() {
  const toast = useToast()
  const confirm = useConfirm()
  const [responsables, setResponsables] = useState([])
  const [filieres, setFilieres] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const reload = () =>
    Promise.all([
      getUsersByRole('RESPONSABLE_FILIERE'),
      getFilieres({ size: 200 }),
    ])
      .then(([uRes, fRes]) => {
        setResponsables(pagedContent(uRes).items)
        setFilieres(pagedContent(fRes).items)
      })
      .catch((err) => toast.error(apiError(err)))

  useEffect(() => {
    reload().finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return responsables
    return responsables.filter(
      (r) =>
        r.firstName?.toLowerCase().includes(q) ||
        r.lastName?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q),
    )
  }, [responsables, query])

  const responsableFiliere = (r) =>
    filieres.find((f) => f.responsable?.user?.id === r.id)

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  const openEdit = (r) => {
    const filiere = responsableFiliere(r)
    setEditing(r)
    setForm({
      firstName: r.firstName || '',
      lastName: r.lastName || '',
      email: r.email || '',
      password: '',
      filiereId: filiere?.id ? String(filiere.id) : '',
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { filiereId, ...data } = form
      const payload = editing ? { ...data, password: data.password || undefined } : data
      let userId

      if (editing) {
        await updateResponsable(editing.id, payload)
        userId = editing.id
        toast.success('Responsable mis à jour')
      } else {
        const res = await createResponsable(payload)
        userId = res.data.data?.id || res.data.id
        toast.success('Responsable créé')
      }

      const currentFiliere = responsableFiliere(editing)
      if (filiereId) {
        if (filiereId !== String(currentFiliere?.id ?? '')) {
          await assignResponsable(parseInt(filiereId, 10), userId)
        }
      } else if (currentFiliere) {
        await unassignResponsable(currentFiliere.id)
      }

      setModalOpen(false)
      reload()
    } catch (err) {
      toast.error(apiError(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (r) => {
    const ok = await confirm({
      title: 'Supprimer le responsable',
      message: `${r.firstName} ${r.lastName} sera supprimé définitivement.`,
      confirmLabel: 'Supprimer',
    })
    if (!ok) return
    try {
      await deleteResponsable(r.id)
      toast.success('Responsable supprimé')
      reload()
    } catch (err) {
      toast.error(apiError(err))
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Responsable',
      render: (r) => (
        <div className="min-w-0">
          <p className="font-medium text-ink-900 truncate">{r.firstName} {r.lastName}</p>
          <p className="text-xs text-ink-500 truncate">{r.email}</p>
        </div>
      ),
    },
    {
      key: 'filiere',
      header: 'Filière',
      render: (r) => {
        const f = responsableFiliere(r)
        return f ? <Badge tone="green">{f.code}</Badge> : <span className="text-ink-400">Non assigné</span>
      },
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => openEdit(r)} className="p-2 rounded-lg text-ink-500 hover:text-brand-700 hover:bg-brand-50 transition" title="Modifier">
            <Icon name="edit" className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(r)} className="p-2 rounded-lg text-ink-500 hover:text-red-600 hover:bg-red-50 transition" title="Supprimer">
            <Icon name="trash" className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Responsables de filière" description="Gérez les responsables des filières">
        <Button icon="plus" onClick={openCreate}>Nouveau responsable</Button>
      </PageHeader>

      <SearchInput value={query} onChange={setQuery} placeholder="Nom ou email…" className="max-w-md" />

      {loading ? (
        <SkeletonRows />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="user"
          title="Aucun responsable"
          description={query ? 'Aucun résultat pour cette recherche.' : 'Ajoutez votre premier responsable de filière.'}
        />
      ) : (
        <DataTable columns={columns} rows={filtered} />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier le responsable' : 'Nouveau responsable'}
        subtitle="Informations personnelles et affectation"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button type="submit" form="responsable-form" loading={saving}>
              {editing ? 'Enregistrer' : 'Créer'}
            </Button>
          </>
        }
      >
        <form id="responsable-form" onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <Field label="Prénom" required>
            <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
          </Field>
          <Field label="Nom" required>
            <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
          </Field>
          <Field label="Email" required className="sm:col-span-2">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
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
          <Field label="Filière" className="sm:col-span-2">
            <Select value={form.filiereId} onChange={(e) => setForm({ ...form, filiereId: e.target.value })}>
              <option value="">Non assigné</option>
              {filieres.map((f) => (
                <option key={f.id} value={f.id}>{f.code} — {f.name}</option>
              ))}
            </Select>
          </Field>
        </form>
      </Modal>
    </div>
  )
}
