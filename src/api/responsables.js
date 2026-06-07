import api from './axios'

export const createResponsable = (data) => api.post('/admin/responsables', data)
export const updateResponsable = (id, data) => api.put(`/admin/responsables/${id}`, data)
export const deleteResponsable = (id) => api.delete(`/admin/responsables/${id}`)
