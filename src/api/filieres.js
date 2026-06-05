import api from './axios'

export const createFiliere = (data) => api.post('/filieres', data)
export const getFiliere = (id) => api.get(`/filieres/${id}`)
export const getFilieres = (params) => api.get('/filieres', { params })
export const searchFilieres = (params) => api.get('/filieres/search', { params })
export const updateFiliere = (id, data) => api.put(`/filieres/${id}`, data)
export const deleteFiliere = (id) => api.delete(`/filieres/${id}`)
export const assignResponsable = (filiereId, responsableId) =>
  api.put(`/filieres/${filiereId}/responsable/${responsableId}`)
