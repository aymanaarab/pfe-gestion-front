import api from './axios'

export const createStudent = (data) => api.post('/students', data)
export const getStudent = (id) => api.get(`/students/${id}`)
export const getStudentByCne = (cne) => api.get(`/students/cne/${cne}`)
export const getStudents = (params) => api.get('/students', { params })
export const getStudentsByFiliere = (filiereId, params) =>
  api.get(`/students/filiere/${filiereId}`, { params })
export const searchStudents = (params) => api.get('/students/search', { params })
export const updateStudent = (id, data) => api.put(`/students/${id}`, data)
export const deleteStudent = (id) => api.delete(`/students/${id}`)
