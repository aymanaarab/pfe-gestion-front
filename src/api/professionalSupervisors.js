import api from './axios'

export const createProfessionalSupervisor = (data) =>
  api.post('/professional-supervisors', data)
export const getProfessionalSupervisor = (id) =>
  api.get(`/professional-supervisors/${id}`)
export const getProfessionalSupervisors = (params) =>
  api.get('/professional-supervisors', { params })
export const searchProfessionalSupervisors = (params) =>
  api.get('/professional-supervisors/search', { params })
export const updateProfessionalSupervisor = (id, data) =>
  api.put(`/professional-supervisors/${id}`, data)
export const deleteProfessionalSupervisor = (id) =>
  api.delete(`/professional-supervisors/${id}`)
