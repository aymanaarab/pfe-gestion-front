import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getStudents } from '../../api/students'
import { getAcademicSupervisors } from '../../api/academicSupervisors'
import { getInternships } from '../../api/internships'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ students: '—', supervisors: '—', internships: '—' })

  useEffect(() => {
    Promise.all([getStudents(), getAcademicSupervisors(), getInternships()])
      .then(([sRes, supRes, iRes]) => {
        const students = sRes.data.data?.totalElements ?? sRes.data.data?.length ?? '—'
        const supervisors = supRes.data.data?.totalElements ?? supRes.data.data?.length ?? '—'
        const internships = iRes.data.data?.totalElements ?? iRes.data.data?.length ?? '—'
        setStats({ students, supervisors, internships })
      })
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenue, {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-gray-600 mt-1">Panneau d'administration</p>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <StatCard title="Étudiants" value={stats.students} color="bg-blue-500"
          icon="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        <StatCard title="Encadrants" value={stats.supervisors} color="bg-indigo-500"
          icon="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
        <StatCard title="Stages" value={stats.internships} color="bg-emerald-500"
          icon="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </div>
    </div>
  )
}

function StatCard({ title, value, color, icon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group">
      <div className={`${color} group-hover:brightness-110 rounded-t-lg h-32 flex items-center justify-center transition-all duration-300`}>
        <svg className="w-16 h-16 text-white transition-transform duration-300 group-hover:scale-125 group-hover:rotate-[30deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
        </svg>
      </div>
      <div className="p-6 text-center">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
      </div>
    </div>
  )
}
