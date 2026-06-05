import { useAuth } from '../../context/AuthContext'

export default function EtudiantInternship() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenue, {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-gray-600 mt-1">Espace Étudiant</p>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <StatCard
          title="Mon Stage"
          value="—"
          color="bg-emerald-500"
          badge="Disponible"
          badgeColor="bg-green-50 text-green-700 border-green-200"
        />
        <StatCard
          title="Mes Tâches"
          value="—"
          color="bg-orange-500"
          badge="Disponible"
          badgeColor="bg-orange-50 text-orange-700 border-orange-200"
        />
        <StatCard
          title="Nouvelles Fonctionnalités"
          value="—"
          color="bg-gray-400"
          badge="Bientôt disponible"
          badgeColor="bg-gray-50 text-gray-600 border-gray-200"
          disabled
        />
      </div>
    </div>
  )
}

function StatCard({ title, value, color, badge, badgeColor, disabled }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group ${disabled ? 'opacity-75' : ''}`}>
      <div className={`${color} ${disabled ? '' : 'group-hover:brightness-110'} rounded-t-lg h-32 flex items-center justify-center transition-all duration-300`}>
        <svg className="w-16 h-16 text-white transition-transform duration-300 group-hover:scale-125 group-hover:rotate-[30deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={disabled
            ? 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
            : 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
          } />
        </svg>
      </div>
      <div className="p-6 text-center">
        {badge && (
          <span className={`inline-flex items-center border text-xs font-medium px-2 py-1 rounded-sm ${badgeColor}`}>
            <svg className="w-3 h-3 me-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={badge === 'Bientôt disponible' ? 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'} />
            </svg>
            {badge}
          </span>
        )}
        <h5 className="mt-3 mb-6 text-2xl font-semibold tracking-tight text-gray-900">{title}</h5>
        {disabled ? (
          <button disabled className="inline-flex items-center text-gray-400 bg-gray-200 border border-transparent shadow-sm font-medium rounded-lg text-sm px-4 py-2.5 cursor-not-allowed">
            Bientôt disponible
            <svg className="w-4 h-4 ms-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </button>
        ) : (
          <a href="#" className="group inline-flex items-center text-white bg-green-600 border border-transparent hover:bg-green-700 focus:ring-4 focus:ring-green-300 shadow-sm font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none transition-colors">
            Consulter
            <svg className="w-4 h-4 ms-1.5 rtl:rotate-180 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-[30deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}
