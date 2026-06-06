import api from './axios'

export const getUsersByRole = (role, params) =>
  api.get('/users/search', { params: { role, ...params } })
