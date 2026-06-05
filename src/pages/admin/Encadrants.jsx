import { useState, useEffect } from 'react'
import { getAcademicSupervisors, deleteAcademicSupervisor } from '../../api/academicSupervisors'

export default function Encadrants() {
  const [supervisors, setSupervisors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
      <h1 className="text-2xl font-bold text-gray-900">Encadrants Académiques</h1>
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
                <th className="text-start px-4 py-3 font-medium">Spécialité</th>
                <th className="text-end px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {supervisors.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.lastName}</td>
                  <td className="px-4 py-3 text-gray-700">{s.firstName}</td>
                  <td className="px-4 py-3 text-gray-500">{s.email}</td>
                  <td className="px-4 py-3 text-gray-500">{s.specialty || '—'}</td>
                  <td className="px-4 py-3 text-end">
                    <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800 text-sm">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
