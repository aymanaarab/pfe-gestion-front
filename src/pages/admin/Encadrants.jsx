import { useState, useEffect } from 'react'
import { getAcademicSupervisors, createAcademicSupervisor, deleteAcademicSupervisor } from '../../api/academicSupervisors'

export default function Encadrants() {
  const [supervisors, setSupervisors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', grade: '', researchTopic: '' })

  const fetchSupervisors = async () => {
    try {
      setLoading(true)
      const res = await getAcademicSupervisors()
      setSupervisors(res.data.data?.content || res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSupervisors() }, [])

  const openCreate = () => {
    setForm({ firstName: '', lastName: '', email: '', phone: '', grade: '', researchTopic: '' })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createAcademicSupervisor(form)
      setShowModal(false)
      fetchSupervisors()
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return
    try {
      await deleteAcademicSupervisor(id)
      fetchSupervisors()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Encadrants Académiques</h1>
          <p className="text-gray-500 text-sm mt-1">Gestion des encadrants</p>
        </div>
        <button onClick={openCreate} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium">+ Nouvel encadrant</button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}
      {supervisors.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Aucun encadrant trouvé</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-start px-4 py-3 font-medium">Nom</th>
                <th className="text-start px-4 py-3 font-medium">Prénom</th>
                <th className="text-start px-4 py-3 font-medium">Email</th>
                <th className="text-start px-4 py-3 font-medium">Grade</th>
                <th className="text-start px-4 py-3 font-medium">Thème de recherche</th>
                <th className="text-start px-4 py-3 font-medium">Stages</th>
                <th className="text-end px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {supervisors.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.user?.lastName}</td>
                  <td className="px-4 py-3 text-gray-700">{s.user?.firstName}</td>
                  <td className="px-4 py-3 text-gray-500">{s.user?.email}</td>
                  <td className="px-4 py-3 text-gray-500">{s.grade || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{s.researchTopic || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{s.internshipCount ?? '—'}</td>
                  <td className="px-4 py-3 text-end">
                    <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800 text-sm">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Nouvel encadrant</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                  <input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} placeholder="Professeur" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thème de recherche</label>
                  <input value={form.researchTopic} onChange={(e) => setForm({ ...form, researchTopic: e.target.value })} placeholder="Intelligence Artificielle" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
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
