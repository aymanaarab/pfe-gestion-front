import { useAuth } from '../../context/auth-context'
import { greeting, todayLabel } from '../../lib/charts'
import { ROLE_META } from '../../lib/format'
import { Icon } from '../icons'

export default function WelcomeBanner({ subtitle, children }) {
  const { user } = useAuth()
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 via-brand-800 to-ink-950 text-white p-6 sm:p-7 shadow-lift">
      <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-20 right-24 w-48 h-48 rounded-full bg-brand-400/20 blur-2xl" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-white/60 capitalize">{todayLabel()}</p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mt-1">
            {greeting()}, {user?.firstName}
          </h1>
          <p className="text-white/70 mt-1.5 text-sm">
            {subtitle || ROLE_META[user?.role]?.label}
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}

export function BannerStat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/10 ring-1 ring-white/15 px-4 py-3">
      <span className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
        <Icon name={icon} className="w-5 h-5" />
      </span>
      <div>
        <p className="font-display text-xl font-bold leading-none">{value}</p>
        <p className="text-[11px] text-white/60 mt-1">{label}</p>
      </div>
    </div>
  )
}
