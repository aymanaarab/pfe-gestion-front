import { useState, useEffect, useCallback } from 'react'
import {
  getTasksByInternship,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from '../../api/tasks'
import { apiError, pagedContent, formatDate, TASK_STATUS, TASK_STATUS_ORDER, STATUS_HEX } from '../../lib/format'
import { Icon } from '../icons'
import {
  Button,
  Modal,
  Field,
  Input,
  Textarea,
  Select,
  EmptyState,
  Spinner,
  useToast,
  useConfirm,
} from '../ui'

const EMPTY = { title: '', description: '', status: 'TODO', dueDate: '' }

export default function TaskBoard({ internshipId, canManage = false }) {
  const toast = useToast()
  const confirm = useConfirm()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(() => !!internshipId)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const reload = useCallback(
    () =>
      getTasksByInternship(internshipId, { size: 500 })
        .then((res) => setTasks(pagedContent(res).items))
        .catch((err) => toast.error(apiError(err))),
    [internshipId, toast],
  )

  useEffect(() => {
    if (!internshipId) return
    reload().finally(() => setLoading(false))
  }, [internshipId, reload])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  const openEdit = (t) => {
    setEditing(t)
    setForm({ title: t.title, description: t.description || '', status: t.status, dueDate: t.dueDate || '' })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, internshipId, dueDate: form.dueDate || null }
      if (editing) {
        await updateTask(editing.id, payload)
        toast.success('Tâche mise à jour')
      } else {
        await createTask(payload)
        toast.success('Tâche créée')
      }
      setModalOpen(false)
      reload()
    } catch (err) {
      toast.error(apiError(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (t) => {
    const ok = await confirm({
      title: 'Supprimer la tâche',
      message: `« ${t.title} » sera supprimée.`,
      confirmLabel: 'Supprimer',
    })
    if (!ok) return
    try {
      await deleteTask(t.id)
      toast.success('Tâche supprimée')
      reload()
    } catch (err) {
      toast.error(apiError(err))
    }
  }

  const changeStatus = async (t, status) => {
    setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, status } : x)))
    try {
      await updateTaskStatus(t.id, status)
    } catch (err) {
      toast.error(apiError(err))
      reload()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  if (!internshipId) {
    return <EmptyState icon="tasks" title="Aucun stage associé" description="Les tâches apparaîtront une fois le stage défini." />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-500">{tasks.length} tâche(s)</p>
        {canManage && <Button icon="plus" size="sm" onClick={openCreate}>Nouvelle tâche</Button>}
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon="tasks"
          title="Aucune tâche"
          description={canManage ? 'Créez la première tâche du stage.' : 'Aucune tâche ne vous a encore été assignée.'}
          action={canManage && <Button icon="plus" onClick={openCreate}>Nouvelle tâche</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {TASK_STATUS_ORDER.map((code) => {
            const meta = TASK_STATUS[code]
            const items = tasks.filter((t) => t.status === code)
            return (
              <div key={code} className="bg-ink-100/50 rounded-2xl p-3 min-h-[8rem]">
                <div className="flex items-center gap-2 px-1 pb-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_HEX[meta.tone] }} />
                  <span className="text-sm font-semibold text-ink-700">{meta.label}</span>
                  <span className="ml-auto text-xs font-medium text-ink-400 bg-white rounded-full px-2 py-0.5">{items.length}</span>
                </div>
                <div className="space-y-2.5">
                  {items.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      canManage={canManage}
                      onStatus={changeStatus}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier la tâche' : 'Nouvelle tâche'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button type="submit" form="task-form" loading={saving}>{editing ? 'Enregistrer' : 'Créer'}</Button>
          </>
        }
      >
        <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
          <Field label="Titre" required>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </Field>
          <Field label="Description">
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Statut">
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {TASK_STATUS_ORDER.map((s) => <option key={s} value={s}>{TASK_STATUS[s].label}</option>)}
              </Select>
            </Field>
            <Field label="Échéance">
              <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </Field>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function TaskCard({ task, canManage, onStatus, onEdit, onDelete }) {
  const overdue =
    task.dueDate && task.status !== 'COMPLETED' && new Date(task.dueDate) < new Date(new Date().toDateString())

  return (
    <div className="bg-white rounded-xl border border-ink-200/70 shadow-soft p-3 group">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-ink-900 leading-snug">{task.title}</p>
        {canManage && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition shrink-0">
            <button onClick={() => onEdit(task)} className="p-1 rounded text-ink-400 hover:text-brand-700" title="Modifier">
              <Icon name="edit" className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDelete(task)} className="p-1 rounded text-ink-400 hover:text-red-600" title="Supprimer">
              <Icon name="trash" className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
      {task.description && <p className="text-xs text-ink-500 mt-1 line-clamp-2">{task.description}</p>}
      {task.dueDate && (
        <p className={`text-xs mt-2 flex items-center gap-1 ${overdue ? 'text-red-600 font-medium' : 'text-ink-400'}`}>
          <Icon name="calendar" className="w-3.5 h-3.5" />
          {formatDate(task.dueDate)}
          {overdue && ' · en retard'}
        </p>
      )}
      <select
        value={task.status}
        onChange={(e) => onStatus(task, e.target.value)}
        className="mt-2.5 w-full text-xs rounded-lg border border-ink-200 bg-ink-50 px-2 py-1.5 text-ink-700 outline-none cursor-pointer focus:border-brand-500"
      >
        {TASK_STATUS_ORDER.map((s) => <option key={s} value={s}>{TASK_STATUS[s].label}</option>)}
      </select>
    </div>
  )
}
