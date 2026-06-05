import api from './axios'

export const createAcademicSupervisor = (data) => api.post('/academic-supervisors', data)
export const getAcademicSupervisor = (id) => api.get(`/academic-supervisors/${id}`)
export const getAcademicSupervisors = (params) => api.get('/academic-supervisors', { params })
export const searchAcademicSupervisors = (params) =>
  api.get('/academic-supervisors/search', { params })
export const updateAcademicSupervisor = (id, data) =>
  api.put(`/academic-supervisors/${id}`, data)
export const deleteAcademicSupervisor = (id) =>
  api.delete(`/academic-supervisors/${id}`)
