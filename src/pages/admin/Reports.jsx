import { useState } from 'react'
import { getInternshipReport, getStudentReport } from '../../api/reports'

export default function Reports() {
  const [internshipId, setInternshipId] = useState('')
  const [studentId, setStudentId] = useState('')
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(null)

  const downloadReport = async (type, id, endpoint) => {
    if (!id.trim()) return
    setLoading(type)
    setError(null)
    try {
      const res = await endpoint(id.trim())
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      URL.revokeObjectURL(url)
    } catch {
      setError(`Impossible de générer le rapport pour ${type === 'internship' ? 'le stage' : 'l\'étudiant'}`)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Rapport de stage</h2>
          <p className="text-sm text-gray-500 mb-4">Générer le rapport PDF d'un stage par son ID</p>
          <div className="flex gap-2">
            <input value={internshipId} onChange={(e) => setInternshipId(e.target.value)} placeholder="ID du stage" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
            <button onClick={() => downloadReport('internship', internshipId, getInternshipReport)} disabled={loading === 'internship'} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-60">
              {loading === 'internship' ? '...' : 'Générer'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Rapport étudiant</h2>
          <p className="text-sm text-gray-500 mb-4">Générer le rapport PDF d'un étudiant par son ID</p>
          <div className="flex gap-2">
            <input value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="ID de l'étudiant" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
            <button onClick={() => downloadReport('student', studentId, getStudentReport)} disabled={loading === 'student'} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-60">
              {loading === 'student' ? '...' : 'Générer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
