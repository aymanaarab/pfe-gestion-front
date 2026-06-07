export const NAV = {
  ADMIN: [
    { label: 'Tableau de bord', icon: 'dashboard', to: '/admin/dashboard' },
    { label: 'Filières', icon: 'filieres', to: '/admin/filieres' },
    { label: 'Responsables', icon: 'user', to: '/admin/responsables' },
    { label: 'Étudiants', icon: 'students', to: '/admin/students' },
    { label: 'Encadrants', icon: 'encadrants', to: '/admin/encadrants' },
    { label: 'Stages', icon: 'internships', to: '/admin/internships' },
    { label: 'Entreprises', icon: 'companies', to: '/admin/companies' },
    { label: 'Rapports', icon: 'reports', to: '/admin/reports' },
  ],
  RESPONSABLE_FILIERE: [
    { label: 'Tableau de bord', icon: 'dashboard', to: '/responsable/dashboard' },
    { label: 'Étudiants', icon: 'students', to: '/responsable/students' },
    { label: 'Stages', icon: 'internships', to: '/responsable/internships' },
  ],
  ENCADRANT_ACADEMIQUE: [
    { label: 'Tableau de bord', icon: 'dashboard', to: '/encadrant/dashboard' },
    { label: 'Mes stages', icon: 'internships', to: '/encadrant/internships' },
  ],
  ETUDIANT: [
    { label: 'Tableau de bord', icon: 'dashboard', to: '/etudiant/dashboard' },
    { label: 'Mon stage', icon: 'internships', to: '/etudiant/internship' },
    { label: 'Mes tâches', icon: 'tasks', to: '/etudiant/tasks' },
  ],
}

export const ROLE_HOME = {
  ADMIN: '/admin/dashboard',
  RESPONSABLE_FILIERE: '/responsable/dashboard',
  ENCADRANT_ACADEMIQUE: '/encadrant/dashboard',
  ETUDIANT: '/etudiant/dashboard',
}

export function navItems(role) {
  return NAV[role] || []
}

export function currentNavTitle(role, pathname) {
  const items = navItems(role)
  const match = items
    .filter((i) => pathname.startsWith(i.to))
    .sort((a, b) => b.to.length - a.to.length)[0]
  return match?.label || ''
}
