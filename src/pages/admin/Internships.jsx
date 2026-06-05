import { useState, useEffect } from 'react'
import { getInternships, createInternship, deleteInternship } from '../../api/internships'
import { getStudents } from '../../api/students'
import { getCompanies } from '../../api/companies'

const STATUS_LABELS = { PENDING: 'En attente', APPROVED: 'Approuvé', REJECTED: 'Rejeté', IN_PROGRESS: 'En cours', COMPLETED: 'Terminé' }
const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800', APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800', IN_PROGRESS: 'bg-blue-100 text-blue-800', COMPLETED: 'bg-gray-100 text-gray-800',
}

export default function Internships() {
  const [internships, setInternships] = useState([])
  const [students, setStudents] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ subject: '', description: '', objectives: '', methodology: '', technologies: '', startDate: '', endDate: '', studentId: '', companyId: '' })

  const fetchData = async () => {
    try {
      setLoading(true)
      const [iRes, sRes, cRes] = await Promise.all([getInternships(), getStudents(), getCompanies()])
      setInternships(iRes.data.data?.content || iRes.data.data || [])
      setStudents(sRes.data.data?.content || sRes.data.data || [])
      setCompanies(cRes.data.data?.content || cRes.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => {
    setForm({ subject: '', description: '', objectives: '', methodology: '', technologies: '', startDate: '', endDate: '', studentId: '', companyId: '' })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createInternship({
        ...form,
        studentId: parseInt(form.studentId),
        companyId: parseInt(form.companyId),
      })
      setShowModal(false)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return
    try {
      await deleteInternship(id)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stages</h1>
          <p className="text-gray-500 text-sm mt-1">Gestion des stages</p>
        </div>
        <button onClick={openCreate} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium">+ Nouveau stage</button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}
      {internships.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Aucun stage trouvé</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-start px-4 py-3 font-medium">Étudiant</th>
                <th className="text-start px-4 py-3 font-medium">Sujet</th>
                <th className="text-start px-4 py-3 font-medium">Entreprise</th>
                <th className="text-start px-4 py-3 font-medium">Encadrant</th>
                <th className="text-start px-4 py-3 font-medium">Statut</th>
                <th className="text-end px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {internships.map((i) => (
                <tr key={i.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {i.student ? `${i.student.firstName} ${i.student.lastName}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{i.subject || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{i.company?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {i.academicSupervisor ? `${i.academicSupervisor.firstName} ${i.academicSupervisor.lastName}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[i.status] || 'bg-gray-100 text-gray-800'}`}>
                      {STATUS_LABELS[i.status] || i.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <button onClick={() => handleDelete(i.id)} className="text-red-600 hover:text-red-800 text-sm">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Nouveau stage</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                  <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Méthodologie</label>
                  <input value={form.methodology} onChange={(e) => setForm({ ...form, methodology: e.target.value })} placeholder="Agile" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Objectifs</label>
                  <textarea value={form.objectives} onChange={(e) => setForm({ ...form, objectives: e.target.value })} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
                  <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="Spring Boot, Angular" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
                  <input required type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
                  <input required type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Étudiant</label>
                  <select required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                    <option value="">Sélectionner...</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.user?.firstName} {s.user?.lastName} ({s.cne})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                  <select required value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                    <option value="">Sélectionner...</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} - {c.city}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Annuler</button>
                <button type="submit" className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
