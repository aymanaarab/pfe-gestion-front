import api from './axios'

export const getInternshipReport = (internshipId) =>
  api.get(`/reports/internships/${internshipId}`, { responseType: 'blob' })

export const getStudentReport = (studentId) =>
  api.get(`/reports/students/${studentId}`, { responseType: 'blob' })
