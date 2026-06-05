import api from './axios'

export const createCompany = (data) => api.post('/companies', data)
export const getCompany = (id) => api.get(`/companies/${id}`)
export const getCompanies = (params) => api.get('/companies', { params })
export const searchCompanies = (params) => api.get('/companies/search', { params })
export const updateCompany = (id, data) => api.put(`/companies/${id}`, data)
export const deleteCompany = (id) => api.delete(`/companies/${id}`)
