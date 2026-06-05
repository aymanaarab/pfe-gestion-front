import api from './axios'

export const createTask = (data) => api.post('/tasks', data)
export const getTask = (id) => api.get(`/tasks/${id}`)
export const getTasksByInternship = (internshipId, params) =>
  api.get(`/tasks/internship/${internshipId}`, { params })
export const getTasksByInternshipAndStatus = (internshipId, status, params) =>
  api.get(`/tasks/internship/${internshipId}/status/${status}`, { params })
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data)
export const deleteTask = (id) => api.delete(`/tasks/${id}`)
export const updateTaskStatus = (id, status) =>
  api.patch(`/tasks/${id}/status`, null, { params: { status } })
