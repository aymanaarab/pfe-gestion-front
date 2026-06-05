import { Navigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import { useAuth } from '../context/auth-context'
import { ROLE_HOME } from '../lib/nav'
import { Icon } from '../components/icons'

const HIGHLIGHTS = [
  { icon: 'briefcase', title: 'Suivi des stages', text: 'Du dépôt du sujet à la soutenance, en un seul espace.' },
  { icon: 'tasks', title: 'Tâches & jalons', text: 'Encadrants et étudiants avancent au même rythme.' },
  { icon: 'reports', title: 'Rapports automatisés', text: 'Générez les documents officiels en un clic.' },
]

export default function LoginPage() {
  const { isAuthenticated, user } = useAuth()
  if (isAuthenticated) {
    return <Navigate to={ROLE_HOME[user?.role] || '/'} replace />
  }

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-12 auth-bg text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-luminosity"
          style={{ backgroundImage: 'url(/semlalia-bg.jpg)' }}
        />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lift">
            <img src="/semlalia-logo-rbg.png" alt="Logo" className="h-8 w-auto" />
          </div>
          <div>
            <p className="font-display font-bold text-lg leading-tight">PFE Gestion</p>
            <p className="text-xs text-white/60">Faculté des Sciences Semlalia</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-white/80 ring-1 ring-white/15">
            <Icon name="sparkles" className="w-3.5 h-3.5" />
            Plateforme universitaire
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight mt-5">
            Pilotez les projets de fin d’études en toute simplicité.
          </h1>
          <p className="text-white/70 mt-4 leading-relaxed">
            Étudiants, encadrants et responsables de filière collaborent sur une plateforme unique,
            de l’affectation des stages jusqu’à la génération des rapports.
          </p>

          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map((h) => (
              <li key={h.title} className="flex items-start gap-3.5">
                <span className="w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center shrink-0">
                  <Icon name={h.icon} className="w-5 h-5 text-brand-200" />
                </span>
                <div>
                  <p className="font-semibold text-sm">{h.title}</p>
                  <p className="text-sm text-white/60">{h.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/40">
          © {new Date().getFullYear()} Université Cadi Ayyad · Marrakech
        </p>
      </div>

      <div className="flex items-center justify-center min-h-dvh p-6 sm:p-10 bg-ink-50">
        <div className="w-full max-w-sm animate-rise">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-2xl bg-white border border-ink-200 flex items-center justify-center shadow-soft">
              <img src="/semlalia-logo-rbg.png" alt="Logo" className="h-7 w-auto" />
            </div>
            <div>
              <p className="font-display font-bold text-ink-900 leading-tight">PFE Gestion</p>
              <p className="text-xs text-ink-500">FS Semlalia · Marrakech</p>
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold text-ink-900">Bienvenue</h2>
          <p className="text-sm text-ink-500 mt-1.5 mb-7">
            Connectez-vous pour accéder à votre espace de travail.
          </p>

          <LoginForm />

          <p className="text-xs text-center text-ink-400 mt-8">
            Un problème de connexion ? Contactez l’administration de la faculté.
          </p>
        </div>
      </div>
    </div>
  )
}
