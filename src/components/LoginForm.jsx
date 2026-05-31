import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginForm() {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const route = await login(form.email, form.password)
      window.location.href = route
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <div className="relative">
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          className="block px-3 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white border border-gray-300 appearance-none focus:outline-none cursor-pointer focus:ring-green-500 focus:border-green-500 peer"
          placeholder=" "
        />
        <label
          htmlFor="email"
          className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
        >
          Email
        </label>
      </div>

      <div className="relative">
        <input
          id="password"
          name="password"
          type="password"
          required
          value={form.password}
          onChange={handleChange}
          className="block px-3 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white border border-gray-300 appearance-none focus:outline-none cursor-pointer focus:ring-green-500 focus:border-green-500 peer"
          placeholder=" "
        />
        <label
          htmlFor="password"
          className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
        >
          Mot de passe
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white font-medium py-3 px-4 border border-green-600 hover:bg-white hover:text-green-600 focus:outline-none cursor-pointer focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Connexion en cours…' : 'Se connecter'}
      </button>
    </form>
  )
}
