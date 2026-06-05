import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { navItems } from '../lib/nav'
import { ROLE_META } from '../lib/format'
import { Icon } from './icons'
import Avatar from './ui/Avatar'
import { cn } from '../lib/cn'

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth()
  const items = navItems(user?.role)
  const space = ROLE_META[user?.role]?.space || 'Espace'

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-ink-950/50 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 lg:z-10 h-dvh w-72 shrink-0',
          'bg-gradient-to-b from-brand-800 via-brand-900 to-ink-950 text-white',
          'flex flex-col transition-transform duration-300 ease-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex items-center gap-3 px-5 h-[68px] border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-white/95 flex items-center justify-center shadow-soft shrink-0">
            <img src="/semlalia-logo-rbg.png" alt="Logo" className="h-7 w-auto" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-[15px] leading-tight tracking-tight">PFE Gestion</p>
            <p className="text-[11px] text-white/55 truncate">FS Semlalia · Marrakech</p>
          </div>
          <button onClick={onClose} className="lg:hidden ml-auto text-white/70 hover:text-white">
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 pt-5 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">{space}</p>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto scroll-slim pb-4">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-white text-brand-800 shadow-soft'
                    : 'text-white/70 hover:text-white hover:bg-white/10',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={item.icon} className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2 : 1.8} />
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/5">
            <Avatar firstName={user?.firstName} lastName={user?.lastName} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-white/50 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              title="Déconnexion"
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg p-2 transition"
            >
              <Icon name="logout" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
