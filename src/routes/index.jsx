import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import ProtectedRoute from '../components/ProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import AdminDashboard from '../pages/admin/Dashboard'
import Filieres from '../pages/admin/Filieres'
import Students from '../pages/admin/Students'
import Encadrants from '../pages/admin/Encadrants'
import Internships from '../pages/admin/Internships'
import Companies from '../pages/admin/Companies'
import Reports from '../pages/admin/Reports'
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

      <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="filieres" element={<Filieres />} />
        <Route path="students" element={<Students />} />
        <Route path="encadrants" element={<Encadrants />} />
        <Route path="internships" element={<Internships />} />
        <Route path="companies" element={<Companies />} />
        <Route path="reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="/responsable" element={<ProtectedRoute roles={['RESPONSABLE_FILIERE']}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ResponsableDashboard />} />
        <Route path="students" element={<ResponsableDashboard />} />
        <Route path="internships" element={<ResponsableDashboard />} />
        <Route path="companies" element={<ResponsableDashboard />} />
        <Route path="reports" element={<ResponsableDashboard />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="/encadrant" element={<ProtectedRoute roles={['ENCADRANT_ACADEMIQUE']}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="internships" replace />} />
        <Route path="dashboard" element={<EncadrantInternships />} />
        <Route path="my-internships" element={<EncadrantInternships />} />
        <Route path="tasks" element={<EncadrantInternships />} />
        <Route path="reports" element={<EncadrantInternships />} />
        <Route path="*" element={<Navigate to="internships" replace />} />
      </Route>

      <Route path="/etudiant" element={<ProtectedRoute roles={['ETUDIANT']}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="internship" replace />} />
        <Route path="dashboard" element={<EtudiantInternship />} />
        <Route path="internship" element={<EtudiantInternship />} />
        <Route path="my-tasks" element={<EtudiantInternship />} />
        <Route path="*" element={<Navigate to="internship" replace />} />
      </Route>

      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  )
}
