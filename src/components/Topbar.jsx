import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { currentNavTitle } from '../lib/nav'
import { ROLE_META } from '../lib/format'
import { Icon } from './icons'
import Avatar from './ui/Avatar'

export default function Topbar({ onMenu }) {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const title = currentNavTitle(user?.role, pathname) || 'Tableau de bord'

  return (
    <header className="sticky top-0 z-30 h-[68px] bg-white/80 backdrop-blur-md border-b border-ink-200/70">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center gap-3">
        <button
          onClick={onMenu}
          className="lg:hidden text-ink-600 hover:bg-ink-100 rounded-lg p-2 -ml-1"
        >
          <Icon name="menu" className="w-6 h-6" />
        </button>

        <div className="min-w-0">
          <p className="text-[11px] text-ink-400 hidden sm:block">
            {ROLE_META[user?.role]?.label}
          </p>
          <h2 className="font-display font-semibold text-ink-900 text-lg leading-tight truncate">
            {title}
          </h2>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button className="relative text-ink-500 hover:text-ink-800 hover:bg-ink-100 rounded-xl p-2 transition">
            <Icon name="bell" className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white" />
          </button>

          <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-ink-200">
            <div className="text-right">
              <p className="text-sm font-medium text-ink-800 leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-ink-400">{ROLE_META[user?.role]?.label}</p>
            </div>
            <Avatar firstName={user?.firstName} lastName={user?.lastName} size="sm" />
          </div>
        </div>
      </div>
    </header>
  )
}
