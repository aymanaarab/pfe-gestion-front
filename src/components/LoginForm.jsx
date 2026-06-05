import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { Icon } from './icons'
import Button from './ui/Button'

export default function LoginForm() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const route = await login(form.email, form.password)
      navigate(route, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 px-3.5 py-3 rounded-xl text-sm animate-rise">
          <Icon name="alert" className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-[13px] font-medium text-ink-700">
          Adresse email
        </label>
        <div className="relative">
          <Icon name="mail" className="text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px]" />
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="prenom.nom@univ.ma"
            className="w-full h-11 pl-11 pr-3 rounded-xl border border-ink-200 bg-white text-sm text-ink-800 placeholder:text-ink-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-[13px] font-medium text-ink-700">
          Mot de passe
        </label>
        <div className="relative">
          <Icon name="shield" className="text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px]" />
          <input
            id="password"
            name="password"
            type={showPwd ? 'text' : 'password'}
            required
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full h-11 pl-11 pr-11 rounded-xl border border-ink-200 bg-white text-sm text-ink-800 placeholder:text-ink-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 text-xs font-medium"
          >
            {showPwd ? 'Masquer' : 'Afficher'}
          </button>
        </div>
      </div>

      <Button type="submit" size="lg" loading={loading} className="w-full" iconRight="arrow-right">
        {loading ? 'Connexion…' : 'Se connecter'}
      </Button>
    </form>
  )
}
