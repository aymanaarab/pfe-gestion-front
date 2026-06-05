import { useState, useEffect } from 'react'
import { getStudents, createStudent, deleteStudent } from '../../api/students'
import { getFilieres } from '../../api/filieres'

const LEVELS = ['1ère année', '2ème année', '3ème année']

export default function Students() {
  const [students, setStudents] = useState([])
  const [filieres, setFilieres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ cne: '', level: '2ème année', email: '', firstName: '', lastName: '', phone: '', filiereId: '' })

  const fetchData = async () => {
    try {
      setLoading(true)
      const [sRes, fRes] = await Promise.all([getStudents(), getFilieres()])
      setStudents(sRes.data.data?.content || sRes.data.data || [])
      setFilieres(fRes.data.data?.content || fRes.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => {
    setForm({ cne: '', level: '2ème année', email: '', firstName: '', lastName: '', phone: '', filiereId: '' })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createStudent({ ...form, filiereId: parseInt(form.filiereId) })
      setShowModal(false)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return
    try {
      await deleteStudent(id)
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
          <h1 className="text-2xl font-bold text-gray-900">Étudiants</h1>
          <p className="text-gray-500 text-sm mt-1">Gestion des étudiants</p>
        </div>
        <button onClick={openCreate} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium">+ Nouvel étudiant</button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

      {students.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Aucun étudiant trouvé</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-start px-4 py-3 font-medium">CNE</th>
                <th className="text-start px-4 py-3 font-medium">Nom</th>
                <th className="text-start px-4 py-3 font-medium">Prénom</th>
                <th className="text-start px-4 py-3 font-medium">Email</th>
                <th className="text-start px-4 py-3 font-medium">Niveau</th>
                <th className="text-start px-4 py-3 font-medium">Filière</th>
                <th className="text-end px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm text-gray-900">{s.cne}</td>
                  <td className="px-4 py-3 text-gray-700">{s.user?.lastName}</td>
                  <td className="px-4 py-3 text-gray-700">{s.user?.firstName}</td>
                  <td className="px-4 py-3 text-gray-500">{s.user?.email}</td>
                  <td className="px-4 py-3 text-gray-500">{s.level || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{s.filiere?.name || '—'}</td>
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
            <h2 className="text-lg font-bold text-gray-900 mb-4">Nouvel étudiant</h2>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNE</label>
                  <input required value={form.cne} onChange={(e) => setForm({ ...form, cne: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                  <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
                  <select required value={form.filiereId} onChange={(e) => setForm({ ...form, filiereId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                    <option value="">Sélectionner...</option>
                    {filieres.map((f) => <option key={f.id} value={f.id}>{f.code} - {f.name}</option>)}
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
