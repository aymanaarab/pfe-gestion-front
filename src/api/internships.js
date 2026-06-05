import api from './axios'

export const createInternship = (data) => api.post('/internships', data)
export const getInternship = (id) => api.get(`/internships/${id}`)
export const getInternshipByStudent = (studentId) =>
  api.get(`/internships/student/${studentId}`)
export const getInternships = (params) => api.get('/internships', { params })
export const getInternshipsByStatus = (status, params) =>
  api.get(`/internships/status/${status}`, { params })
export const searchInternships = (params) =>
  api.get('/internships/search', { params })
export const updateInternship = (id, data) => api.put(`/internships/${id}`, data)
export const deleteInternship = (id) => api.delete(`/internships/${id}`)
export const assignAcademicSupervisor = (internshipId, supervisorId) =>
  api.put(`/internships/${internshipId}/academic-supervisor/${supervisorId}`)
export const assignCompany = (internshipId, companyId) =>
  api.put(`/internships/${internshipId}/company/${companyId}`)
export const assignProfessionalSupervisor = (internshipId, supervisorId) =>
  api.put(`/internships/${internshipId}/professional-supervisor/${supervisorId}`)
export const updateInternshipStatus = (id, status) =>
  api.patch(`/internships/${id}/status`, null, { params: { status } })
