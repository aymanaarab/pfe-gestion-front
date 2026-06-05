import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MENUS = {
  ADMIN: ['Dashboard', 'Filieres', 'Students', 'Encadrants', 'Internships', 'Companies', 'Reports'],
  RESPONSABLE_FILIERE: ['Dashboard', 'Students', 'Internships', 'Companies', 'Reports'],
  ENCADRANT_ACADEMIQUE: ['Dashboard', 'My Internships', 'Tasks', 'Reports'],
  ETUDIANT: ['Dashboard', 'My Internship', 'My Tasks'],
}

const ICONS = {
  Dashboard: 'M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
  Filieres: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
  Students: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
  Encadrants: 'M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z',
  Internships: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  Companies: 'M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z',
  Reports: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  'My Internship': 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  'My Internships': 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  Tasks: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'My Tasks': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
}

const MENU_LINKS = {
  Dashboard: 'dashboard',
  Filieres: 'filieres',
  Students: 'students',
  Encadrants: 'encadrants',
  Internships: 'internships',
  Companies: 'companies',
  Reports: 'reports',
  'My Internships': 'my-internships',
  Tasks: 'tasks',
  'My Tasks': 'my-tasks',
  'My Internship': 'my-internship',
}

const ROLE_PREFIX = {
  ADMIN: '/admin',
  RESPONSABLE_FILIERE: '/responsable',
  ENCADRANT_ACADEMIQUE: '/encadrant',
  ETUDIANT: '/etudiant',
}

const ROLE_HOME = {
  ADMIN: '/admin/dashboard',
  RESPONSABLE_FILIERE: '/responsable/dashboard',
  ENCADRANT_ACADEMIQUE: '/encadrant/internships',
  ETUDIANT: '/etudiant/internship',
}

export default function Sidebar({ mobileOpen, onToggle }) {
  const { user, logout } = useAuth()
  const items = MENUS[user?.role] || []

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-30 lg:z-1
          h-full min-h-dvh w-64 bg-green-700
          flex flex-col gap-4 p-4
          transition-transform duration-200
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between lg:justify-start gap-2">
          <img src="/semlalia-logo-rbg.png" alt="Logo" className="h-10 w-auto" />
          <span className="text-white font-semibold text-sm">PFE GESTION</span>
          <button onClick={onToggle} className="lg:hidden text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="text-xs text-zinc-300 px-1">
          {user?.role === 'ADMIN' ? 'Administration' :
           user?.role === 'RESPONSABLE_FILIERE' ? 'Responsable Filière' :
           user?.role === 'ENCADRANT_ACADEMIQUE' ? 'Encadrant Académique' :
           'Espace Étudiant'}
        </div>

        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {items.map((label) => {
            const to = label === 'Dashboard'
              ? ROLE_HOME[user?.role] || '/'
              : `${ROLE_PREFIX[user?.role] || ''}/${MENU_LINKS[label] || label.toLowerCase().replace(/\s+/g, '-')}`
            return (
              <NavLink
                key={label}
                to={to}
                end
                onClick={onToggle}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-100 ${
                    isActive
                      ? 'bg-white text-green-800 border border-zinc-200'
                      : 'text-zinc-100/75 hover:text-white hover:bg-zinc-200/25 border border-transparent'
                  }`
                }
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={ICONS[label]} />
                </svg>
                <span>{label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="flex items-center gap-3 px-2 py-2 border-t border-zinc-600">
          <div className="w-8 h-8 rounded-lg bg-zinc-200 text-green-700 flex items-center justify-center text-sm font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-zinc-300 truncate">{user?.email}</p>
          </div>
          <button onClick={logout} className="text-zinc-300 hover:text-white" title="Déconnexion">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  )
}
