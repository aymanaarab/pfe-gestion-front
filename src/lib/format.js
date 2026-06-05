export const ROLE_META = {
  ADMIN: { label: 'Administrateur', space: 'Administration' },
  RESPONSABLE_FILIERE: { label: 'Responsable Filière', space: 'Responsable Filière' },
  ENCADRANT_ACADEMIQUE: { label: 'Encadrant Académique', space: 'Encadrement' },
  ETUDIANT: { label: 'Étudiant', space: 'Espace Étudiant' },
}

export const INTERNSHIP_STATUS = {
  PENDING: { label: 'En attente', tone: 'amber' },
  APPROVED: { label: 'Approuvé', tone: 'green' },
  IN_PROGRESS: { label: 'En cours', tone: 'blue' },
  COMPLETED: { label: 'Terminé', tone: 'violet' },
  REJECTED: { label: 'Rejeté', tone: 'red' },
  CANCELLED: { label: 'Annulé', tone: 'gray' },
}

export const INTERNSHIP_STATUS_ORDER = [
  'PENDING',
  'APPROVED',
  'IN_PROGRESS',
  'COMPLETED',
  'REJECTED',
  'CANCELLED',
]

export const TASK_STATUS = {
  TODO: { label: 'À faire', tone: 'gray' },
  IN_PROGRESS: { label: 'En cours', tone: 'blue' },
  COMPLETED: { label: 'Terminé', tone: 'green' },
  BLOCKED: { label: 'Bloqué', tone: 'red' },
}

export const TASK_STATUS_ORDER = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']

export const STATUS_HEX = {
  amber: '#f59e0b',
  green: '#12914b',
  blue: '#2563eb',
  violet: '#7c3aed',
  red: '#dc2626',
  gray: '#94a3b8',
}

export function statusLabel(map, value) {
  return map[value]?.label || value || '—'
}

export function statusTone(map, value) {
  return map[value]?.tone || 'gray'
}

export function roleLabel(role) {
  return ROLE_META[role]?.label || role || '—'
}

export function initials(firstName, lastName) {
  const a = (firstName || '').trim()[0] || ''
  const b = (lastName || '').trim()[0] || ''
  return (a + b).toUpperCase() || '?'
}

export function fullName(person) {
  if (!person) return '—'
  const first = person.firstName || person.user?.firstName || ''
  const last = person.lastName || person.user?.lastName || ''
  const name = `${first} ${last}`.trim()
  return name || '—'
}

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function daysBetween(start, end) {
  if (!start || !end) return null
  const a = new Date(start)
  const b = new Date(end)
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

export function durationLabel(start, end) {
  const days = daysBetween(start, end)
  if (days == null) return '—'
  if (days < 31) return `${days} jour${days > 1 ? 's' : ''}`
  const months = Math.round(days / 30)
  return `${months} mois`
}

export function pagedContent(res) {
  const data = res?.data?.data
  if (!data) return { items: [], totalPages: 1, totalElements: 0, page: 0 }
  if (Array.isArray(data)) {
    return { items: data, totalPages: 1, totalElements: data.length, page: 0 }
  }
  return {
    items: data.content || [],
    totalPages: data.totalPages ?? 1,
    totalElements: data.totalElements ?? data.content?.length ?? 0,
    page: data.page ?? 0,
  }
}

export function apiError(err, fallback = 'Une erreur est survenue') {
  return err?.response?.data?.message || err?.message || fallback
}
