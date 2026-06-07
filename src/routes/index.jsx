import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import ProtectedRoute from '../components/ProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import { useAuth } from '../context/auth-context'
import { ROLE_HOME } from '../lib/nav'

import AdminDashboard from '../pages/admin/Dashboard'
import AdminFilieres from '../pages/admin/Filieres'
import AdminResponsables from '../pages/admin/Responsables'
import AdminStudents from '../pages/admin/Students'
import AdminEncadrants from '../pages/admin/Encadrants'
import AdminInternships from '../pages/admin/Internships'
import AdminCompanies from '../pages/admin/Companies'
import AdminReports from '../pages/admin/Reports'

import ResponsableDashboard from '../pages/responsable/Dashboard'
import ResponsableStudents from '../pages/responsable/Students'
import ResponsableInternships from '../pages/responsable/Internships'

import EncadrantDashboard from '../pages/encadrant/Dashboard'
import EncadrantInternships from '../pages/encadrant/Internships'
import EncadrantInternshipDetail from '../pages/encadrant/InternshipDetail'

import EtudiantDashboard from '../pages/etudiant/Dashboard'
import EtudiantInternship from '../pages/etudiant/Internship'
import EtudiantTasks from '../pages/etudiant/Tasks'

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
        path="/admin"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="filieres" element={<AdminFilieres />} />
        <Route path="responsables" element={<AdminResponsables />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="encadrants" element={<AdminEncadrants />} />
        <Route path="internships" element={<AdminInternships />} />
        <Route path="companies" element={<AdminCompanies />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route
        path="/responsable"
        element={
          <ProtectedRoute roles={['RESPONSABLE_FILIERE']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ResponsableDashboard />} />
        <Route path="students" element={<ResponsableStudents />} />
        <Route path="internships" element={<ResponsableInternships />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route
        path="/encadrant"
        element={
          <ProtectedRoute roles={['ENCADRANT_ACADEMIQUE']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<EncadrantDashboard />} />
        <Route path="internships" element={<EncadrantInternships />} />
        <Route path="internships/:id" element={<EncadrantInternshipDetail />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route
        path="/etudiant"
        element={
          <ProtectedRoute roles={['ETUDIANT']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<EtudiantDashboard />} />
        <Route path="internship" element={<EtudiantInternship />} />
        <Route path="tasks" element={<EtudiantTasks />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  )
}
