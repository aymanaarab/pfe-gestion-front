import { useState, useEffect } from 'react'
import { getInternshipReport, getStudentReport } from '../../api/reports'
import { getInternships } from '../../api/internships'
import { getStudents } from '../../api/students'
import { apiError, pagedContent, fullName } from '../../lib/format'
import { Icon } from '../../components/icons'
import {
  PageHeader,
  Card,
  CardBody,
  Button,
  Field,
  Select,
  useToast,
} from '../../components/ui'

export default function Reports() {
  const toast = useToast()
  const [internships, setInternships] = useState([])
  const [students, setStudents] = useState([])
  const [internshipId, setInternshipId] = useState('')
  const [studentId, setStudentId] = useState('')
  const [busy, setBusy] = useState(null)

  useEffect(() => {
    Promise.all([getInternships({ size: 500 }), getStudents({ size: 500 })])
      .then(([iRes, sRes]) => {
        setInternships(pagedContent(iRes).items)
        setStudents(pagedContent(sRes).items)
      })
      .catch((err) => toast.error(apiError(err)))
  }, [])

  const openPdf = async (key, id, endpoint) => {
    if (!id) return
    setBusy(key)
    try {
      const res = await endpoint(id)
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      setTimeout(() => URL.revokeObjectURL(url), 60000)
      toast.success('Rapport généré')
    } catch {
      toast.error('Impossible de générer le rapport')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Rapports" description="Générez les documents PDF officiels" />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
                <Icon name="internships" className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-ink-900">Rapport de stage</h2>
                <p className="text-sm text-ink-500">Fiche complète d’un stage PFE</p>
              </div>
            </div>
            <Field label="Stage">
              <Select value={internshipId} onChange={(e) => setInternshipId(e.target.value)}>
                <option value="">Sélectionner un stage…</option>
                {internships.map((it) => (
                  <option key={it.id} value={it.id}>{fullName(it.student)} — {it.subject}</option>
                ))}
              </Select>
            </Field>
            <Button
              icon="download"
              className="w-full"
              disabled={!internshipId}
              loading={busy === 'internship'}
              onClick={() => openPdf('internship', internshipId, getInternshipReport)}
            >
              Générer le rapport
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Icon name="students" className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-ink-900">Rapport étudiant</h2>
                <p className="text-sm text-ink-500">Dossier individuel d’un étudiant</p>
              </div>
            </div>
            <Field label="Étudiant">
              <Select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                <option value="">Sélectionner un étudiant…</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.user?.firstName} {s.user?.lastName} ({s.cne})</option>
                ))}
              </Select>
            </Field>
            <Button
              icon="download"
              variant="secondary"
              className="w-full"
              disabled={!studentId}
              loading={busy === 'student'}
              onClick={() => openPdf('student', studentId, getStudentReport)}
            >
              Générer le rapport
            </Button>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody className="flex items-start gap-3">
          <Icon name="info" className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
          <p className="text-sm text-ink-600">
            Les rapports sont générés au format PDF et s’ouvrent dans un nouvel onglet. Assurez-vous
            d’autoriser les fenêtres contextuelles pour ce site.
          </p>
        </CardBody>
      </Card>
    </div>
  )
}
