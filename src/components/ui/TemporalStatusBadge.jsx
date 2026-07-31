import { temporalStatusFallbackText } from '../../utils/temporalStatus'

const delayHistoryStyles = {
  moderado: 'border-[rgba(6,154,88,0.24)] bg-[rgba(6,154,88,0.08)] text-[var(--success)] before:bg-[var(--success)]',
  alto: 'border-[rgba(240,132,0,0.28)] bg-[rgba(240,132,0,0.1)] text-[var(--warning)] before:bg-[var(--warning)]',
  clinico: 'border-[rgba(224,47,53,0.3)] bg-[rgba(224,47,53,0.1)] text-[var(--danger)] before:bg-[var(--danger)]',
  absenteismo_recente: 'border-[rgba(180,83,9,0.34)] bg-[rgba(180,83,9,0.14)] text-[#9a3412] before:bg-[#9a3412]',
  absenteismo_cronico: 'border-[#0e1b33] bg-[#0e1b33] text-white before:bg-white',
}

export const DelayHistoryBadge = ({ status = 'moderado', text }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold leading-none before:h-1.5 before:w-1.5 before:rounded-full ${delayHistoryStyles[status] || delayHistoryStyles.moderado}`}>
    {text || temporalStatusFallbackText[status] || temporalStatusFallbackText.moderado}
  </span>
)

export const TemporalStatusBadge = ({ status = 'moderado', text }) => {
  return (
    <DelayHistoryBadge status={status} text={text} />
  )
}
