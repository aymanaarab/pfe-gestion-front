import { useState, useEffect } from 'react'
import { getInternships, deleteInternship } from '../../api/internships'

const STATUS_LABELS = { PENDING: 'En attente', APPROVED: 'Approuvé', REJECTED: 'Rejeté', IN_PROGRESS: 'En cours', COMPLETED: 'Terminé' }
const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800', APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800', IN_PROGRESS: 'bg-blue-100 text-blue-800', COMPLETED: 'bg-gray-100 text-gray-800',
}

export default function Internships() {
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchInternships = async () => {
    try {
      setLoading(true)
      const res = await getInternships()
      setInternships(res.data.data?.content || res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchInternships() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return
    try {
      await deleteInternship(id)
      fetchInternships()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Stages</h1>
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
                <th className="text-start px-4 py-3 font-medium">Statut</th>
                <th className="text-end px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {internships.map((i) => (
                <tr key={i.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{i.studentName || '—'}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{i.subject || i.title || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{i.companyName || '—'}</td>
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
    </div>
  )
}
