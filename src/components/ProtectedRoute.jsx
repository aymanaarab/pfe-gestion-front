import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/login" replace />
  }

  return children
}
