import { useAuth } from '../../context/AuthContext'

export default function EncadrantInternships() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenue, {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-gray-600 mt-1">Encadrant Académique</p>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <StatCard title="Stages Encadrés" value="—" color="bg-emerald-500" />
        <StatCard title="Tâches" value="—" color="bg-orange-500" />
        <StatCard title="Rapports" value="—" color="bg-blue-500" />
      </div>
    </div>
  )
}

function StatCard({ title, value, color }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group">
      <div className={`${color} group-hover:brightness-110 rounded-t-lg h-32 flex items-center justify-center transition-all duration-300`}>
        <svg className="w-16 h-16 text-white transition-transform duration-300 group-hover:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <div className="p-6 text-center">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
      </div>
    </div>
  )
}
