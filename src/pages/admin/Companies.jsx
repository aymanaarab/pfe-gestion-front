import { useState, useEffect, useMemo } from 'react'
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../../api/companies'
import { apiError, pagedContent } from '../../lib/format'
import { Icon } from '../../components/icons'
import {
  PageHeader,
  Button,
  Card,
  Modal,
  Field,
  Input,
  EmptyState,
  SearchInput,
  SkeletonCard,
  Badge,
  useToast,
  useConfirm,
} from '../../components/ui'

const EMPTY = { name: '', ice: '', address: '', city: '', country: 'Maroc', website: '', sector: '' }

export default function Companies() {
  const toast = useToast()
  const confirm = useConfirm()
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const reload = () =>
    getCompanies({ size: 500 })
      .then((res) => setCompanies(pagedContent(res).items))
      .catch((err) => toast.error(apiError(err)))

  useEffect(() => {
    reload().finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return companies
    return companies.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.sector?.toLowerCase().includes(q) ||
        c.city?.toLowerCase().includes(q),
    )
  }, [companies, query])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  const openEdit = (c) => {
    setEditing(c)
    setForm({
      name: c.name || '',
      ice: c.ice || '',
      address: c.address || '',
      city: c.city || '',
      country: c.country || 'Maroc',
      website: c.website || '',
      sector: c.sector || '',
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await updateCompany(editing.id, form)
        toast.success('Entreprise mise à jour')
      } else {
        await createCompany(form)
        toast.success('Entreprise créée')
      }
      setModalOpen(false)
      reload()
    } catch (err) {
      toast.error(apiError(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (c) => {
    const ok = await confirm({
      title: 'Supprimer l’entreprise',
      message: `« ${c.name} » sera supprimée définitivement.`,
      confirmLabel: 'Supprimer',
    })
    if (!ok) return
    try {
      await deleteCompany(c.id)
      toast.success('Entreprise supprimée')
      reload()
    } catch (err) {
      toast.error(apiError(err))
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Entreprises" description="Réseau des entreprises partenaires">
        <Button icon="plus" onClick={openCreate}>Nouvelle entreprise</Button>
      </PageHeader>

      <SearchInput value={query} onChange={setQuery} placeholder="Nom, secteur ou ville…" className="max-w-md" />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="companies"
          title="Aucune entreprise"
          description={query ? 'Aucun résultat pour cette recherche.' : 'Ajoutez votre première entreprise partenaire.'}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Card key={c.id} className="p-5 flex flex-col group hover:shadow-lift transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Icon name="companies" className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-semibold text-ink-900 truncate">{c.name}</h3>
                  {c.sector && <p className="text-xs text-ink-500 truncate">{c.sector}</p>}
                </div>
                <Badge tone="green">{c.internshipCount ?? 0} stage(s)</Badge>
              </div>

              <div className="mt-4 space-y-1.5 text-sm text-ink-600 flex-1">
                {(c.address || c.city || c.country) && (
                  <p className="flex items-center gap-2">
                    <Icon name="map-pin" className="w-4 h-4 text-ink-400 shrink-0" />
                    <span className="truncate">{[c.address, c.city, c.country].filter(Boolean).join(', ')}</span>
                  </p>
                )}
                {c.ice && (
                  <p className="flex items-center gap-2">
                    <Icon name="shield" className="w-4 h-4 text-ink-400 shrink-0" />
                    <span className="text-ink-500">ICE : {c.ice}</span>
                  </p>
                )}
                {c.website && (
                  <a href={c.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-700 hover:underline">
                    <Icon name="globe" className="w-4 h-4 shrink-0" />
                    <span className="truncate">{c.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-ink-100 flex items-center justify-end gap-1">
                <button onClick={() => openEdit(c)} className="p-2 rounded-lg text-ink-500 hover:text-brand-700 hover:bg-brand-50 transition" title="Modifier">
                  <Icon name="edit" className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(c)} className="p-2 rounded-lg text-ink-500 hover:text-red-600 hover:bg-red-50 transition" title="Supprimer">
                  <Icon name="trash" className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier l’entreprise' : 'Nouvelle entreprise'}
        subtitle="Coordonnées de l’entreprise partenaire"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button type="submit" form="company-form" loading={saving}>{editing ? 'Enregistrer' : 'Créer'}</Button>
          </>
        }
      >
        <form id="company-form" onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <Field label="Nom" required className="sm:col-span-2">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label="Secteur">
            <Input value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} placeholder="Informatique" />
          </Field>
          <Field label="ICE">
            <Input value={form.ice} onChange={(e) => setForm({ ...form, ice: e.target.value })} />
          </Field>
          <Field label="Site web" className="sm:col-span-2">
            <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" />
          </Field>
          <Field label="Adresse" className="sm:col-span-2">
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Field>
          <Field label="Ville">
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </Field>
          <Field label="Pays">
            <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </Field>
        </form>
      </Modal>
    </div>
  )
}
