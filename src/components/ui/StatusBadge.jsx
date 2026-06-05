import Badge from './Badge'
import { INTERNSHIP_STATUS, TASK_STATUS } from '../../lib/format'

export function InternshipStatusBadge({ status }) {
  const meta = INTERNSHIP_STATUS[status] || { label: status, tone: 'gray' }
  return (
    <Badge tone={meta.tone} dot>
      {meta.label}
    </Badge>
  )
}

export function TaskStatusBadge({ status }) {
  const meta = TASK_STATUS[status] || { label: status, tone: 'gray' }
  return (
    <Badge tone={meta.tone} dot>
      {meta.label}
    </Badge>
  )
}
