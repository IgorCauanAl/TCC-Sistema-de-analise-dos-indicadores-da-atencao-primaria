import { Icons } from '../ui/Icons'
import { IMPORT_RESULT_STATUS, IMPORT_VALIDATION_STATUS } from '../../data/importReportsData'

const toneClasses = {
  info: 'border-[rgba(22,103,232,0.2)] bg-[rgba(22,103,232,0.08)] text-[var(--primary-dark)]',
  success: 'border-[rgba(6,154,88,0.22)] bg-[rgba(6,154,88,0.08)] text-[var(--success)]',
  warning: 'border-[rgba(240,132,0,0.24)] bg-[rgba(240,132,0,0.09)] text-[var(--warning)]',
  alert: 'border-[rgba(229,109,34,0.24)] bg-[rgba(229,109,34,0.09)] text-[var(--alert)]',
  danger: 'border-[rgba(224,47,53,0.22)] bg-[rgba(224,47,53,0.08)] text-[var(--danger)]',
}

export const ImportValidationBadge = ({ status, type = 'validation' }) => {
  const config = type === 'result' ? IMPORT_RESULT_STATUS[status] : IMPORT_VALIDATION_STATUS[status]
  const Icon = Icons[config?.icon] || Icons.CheckCircle

  if (!config) return null

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses[config.tone]}`}>
      {type === 'validation' && <Icon />}
      {config.label}
    </span>
  )
}
