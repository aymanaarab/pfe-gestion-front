import { Card, CardHeader, CardBody } from '../ui/Card'
import { ProgressRing } from '../ui/Progress'
import { TASK_STATUS, TASK_STATUS_ORDER, STATUS_HEX } from '../../lib/format'

export default function TaskProgressCard({ progress }) {
  const p = progress || { todo: 0, inProgress: 0, completed: 0, blocked: 0, total: 0, completionRate: 0 }
  const byKey = {
    TODO: p.todo,
    IN_PROGRESS: p.inProgress,
    COMPLETED: p.completed,
    BLOCKED: p.blocked,
  }

  return (
    <Card className="h-full">
      <CardHeader title="Progression des tâches" subtitle={`${p.total} tâche(s) au total`} />
      <CardBody className="flex flex-col sm:flex-row items-center gap-6">
        <ProgressRing value={p.completionRate} sublabel="achevées" />
        <ul className="flex-1 w-full space-y-2.5">
          {TASK_STATUS_ORDER.map((code) => {
            const meta = TASK_STATUS[code]
            return (
              <li key={code} className="flex items-center gap-2.5 text-sm">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: STATUS_HEX[meta.tone] }}
                />
                <span className="text-ink-600 flex-1">{meta.label}</span>
                <span className="font-semibold text-ink-900 tabular-nums">{byKey[code]}</span>
              </li>
            )
          })}
        </ul>
      </CardBody>
    </Card>
  )
}
