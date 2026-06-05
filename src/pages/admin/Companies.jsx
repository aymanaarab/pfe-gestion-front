import { useState, useEffect } from 'react'
import { getCompanies, deleteCompany } from '../../api/companies'

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const res = await getCompanies()
      setCompanies(res.data.data?.content || res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCompanies() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return
    try {
      await deleteCompany(id)
      fetchCompanies()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Entreprises</h1>
      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}
      {companies.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Aucune entreprise trouvée</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => (
            <div key={c.id} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900">{c.name}</h3>
              {c.email && <p className="text-sm text-gray-500 mt-1">{c.email}</p>}
              {c.phone && <p className="text-sm text-gray-500">{c.phone}</p>}
              {c.address && <p className="text-sm text-gray-400 mt-2">{c.address}</p>}
              <div className="mt-3 pt-3 border-t border-gray-100 text-end">
                <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800 text-sm">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
