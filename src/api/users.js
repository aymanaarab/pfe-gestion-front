import api from './axios'

export const getUsersByRole = (role) =>
  api.get('/users', { params: { role } })
