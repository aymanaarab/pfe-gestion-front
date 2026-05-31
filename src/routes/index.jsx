import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import ProtectedRoute from '../components/ProtectedRoute'
import AdminDashboard from '../pages/admin/Dashboard'
import ResponsableDashboard from '../pages/responsable/Dashboard'
import EncadrantInternships from '../pages/encadrant/Internships'
import EtudiantInternship from '../pages/etudiant/Internship'

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
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
