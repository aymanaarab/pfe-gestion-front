import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import ProtectedRoute from '../components/ProtectedRoute'
import { useAuth } from '../context/AuthContext'
import AdminDashboard from '../pages/admin/Dashboard'
import ResponsableDashboard from '../pages/responsable/Dashboard'
import EncadrantInternships from '../pages/encadrant/Internships'
import EtudiantInternship from '../pages/etudiant/Internship'

const ROLE_HOME = {
  ADMIN: '/admin/dashboard',
  RESPONSABLE_FILIERE: '/responsable/dashboard',
  ENCADRANT_ACADEMIQUE: '/encadrant/internships',
  ETUDIANT: '/etudiant/internship',
}

function HomeRedirect() {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Navigate to={ROLE_HOME[user?.role] || '/login'} replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/responsable/dashboard"
        element={
          <ProtectedRoute roles={['RESPONSABLE_FILIERE']}>
            <ResponsableDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/encadrant/internships"
        element={
          <ProtectedRoute roles={['ENCADRANT_ACADEMIQUE']}>
            <EncadrantInternships />
          </ProtectedRoute>
        }
      />
      <Route
        path="/etudiant/internship"
        element={
          <ProtectedRoute roles={['ETUDIANT']}>
            <EtudiantInternship />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  )
}
