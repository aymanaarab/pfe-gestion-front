import { useState, useCallback, useMemo, useEffect } from 'react'
import { login as loginApi, getMe } from '../api/auth'
import { ROLE_HOME } from '../lib/nav'
import { AuthContext } from './auth-context'

function readStoredUser() {
  const stored = localStorage.getItem('user')
  return stored ? JSON.parse(stored) : null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [loading, setLoading] = useState(false)

  const persist = useCallback((data) => {
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token || !readStoredUser()) return
    getMe()
      .then((res) => {
        if (res.data?.data) {
          persist({ ...readStoredUser(), ...res.data.data })
        }
      })
      .catch(() => {})
  }, [persist])

  const login = useCallback(
    async (email, password) => {
      setLoading(true)
      try {
        const { data } = await loginApi(email, password)
        if (!data.success) {
          throw new Error(data.message || 'Email ou mot de passe incorrect')
        }

        const { accessToken, refreshToken, ...userData } = data.data
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        persist(userData)

        const me = await getMe().catch(() => null)
        if (me?.data?.data) {
          persist({ ...userData, ...me.data.data })
        }

        return ROLE_HOME[userData.role] || '/'
      } catch (err) {
        throw new Error(
          err.response?.data?.message || err.message || 'Erreur de connexion au serveur',
          { cause: err },
        )
      } finally {
        setLoading(false)
      }
    },
    [persist],
  )

  const logout = useCallback(() => {
    localStorage.clear()
    setUser(null)
    window.location.href = '/login'
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, logout, isAuthenticated: !!user }),
    [user, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
