import { INTERNSHIP_STATUS, INTERNSHIP_STATUS_ORDER, STATUS_HEX } from './format'

export function internshipDonutData(breakdown = []) {
  const map = Object.fromEntries((breakdown || []).map((b) => [b.status, b.count]))
  return INTERNSHIP_STATUS_ORDER.map((code) => {
    const meta = INTERNSHIP_STATUS[code] || { label: code, tone: 'gray' }
    return {
      code,
      label: meta.label,
      value: map[code] || 0,
      color: STATUS_HEX[meta.tone] || STATUS_HEX.gray,
    }
  }).filter((d) => d.value > 0)
}

export function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bonjour'
  if (h < 18) return 'Bon après-midi'
  return 'Bonsoir'
}

export function todayLabel() {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
