import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { login as loginApi } from '../api/auth'

const AuthContext = createContext(null)

const ROLE_ROUTES = {
  ADMIN: '/admin/dashboard',
  RESPONSABLE_FILIERE: '/responsable/dashboard',
  ENCADRANT_ACADEMIQUE: '/encadrant/internships',
  ETUDIANT: '/etudiant/internship',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const { data } = await loginApi(email, password)

      if (!data.success) {
        throw new Error(data.message || 'Email ou mot de passe incorrect')
      }

      const { accessToken, refreshToken, ...userData } = data.data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(userData))

      setUser(userData)
      return ROLE_ROUTES[userData.role] || '/'
    } catch (err) {
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          'Erreur de connexion au serveur',
      )
    } finally {
      setLoading(false)
    }
  }, [])

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

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
