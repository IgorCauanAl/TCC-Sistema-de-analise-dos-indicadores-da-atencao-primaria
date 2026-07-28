import { useState } from 'react'
import { Icons } from '../ui/Icons'
import { getDelayHistoryStatus } from '../ui/TemporalStatusBadge'

const indicatorLabels = {
  C4: {
    title: 'Cuidado da pessoa com diabetes',
    description: 'C4 — Cuidado da pessoa com diabetes',
  },
  C5: {
    title: 'Cuidado da pessoa com hipertensão',
    description: 'C5 — Cuidado da pessoa com hipertensão',
  },
}

const deadlineStatusConfig = {
  OVERDUE: {
    itemClass: 'border-[rgba(224,47,53,0.24)] bg-[rgba(224,47,53,0.08)] text-[var(--danger)]',
    Icon: Icons.Alert,
  },
  CRITICAL: {
    itemClass: 'border-[rgba(224,47,53,0.24)] bg-[rgba(224,47,53,0.08)] text-[var(--danger)]',
    Icon: Icons.Alert,
  },
  ATTENTION: {
    itemClass: 'border-[rgba(229,109,34,0.24)] bg-[rgba(229,109,34,0.09)] text-[var(--alert)]',
    Icon: Icons.Calendar,
  },
  PENDING: {
    itemClass: 'border-[rgba(240,132,0,0.24)] bg-[rgba(240,132,0,0.09)] text-[var(--warning)]',
    Icon: Icons.Activity,
  },
  UNAVAILABLE: {
    itemClass: 'border-[var(--border)] bg-[#f4f7fb] text-[var(--text-secondary)]',
    Icon: Icons.Alert,
  },
}

const delayHistoryPendingConfig = {
  moderado: {
    label: 'Risco Moderado',
    itemClass: 'border-[rgba(6,154,88,0.24)] bg-[rgba(6,154,88,0.08)] text-[var(--success)]',
    Icon: Icons.CheckCircle,
  },
  alto: {
    label: 'Risco Alto',
    itemClass: 'border-[rgba(240,132,0,0.28)] bg-[rgba(240,132,0,0.1)] text-[var(--warning)]',
    Icon: Icons.Calendar,
  },
  clinico: {
    label: 'Risco Clínico',
    itemClass: 'border-[rgba(224,47,53,0.3)] bg-[rgba(224,47,53,0.1)] text-[var(--danger)]',
    Icon: Icons.Alert,
  },
  absenteismo_recente: {
    label: 'Absenteísmo Recente',
    itemClass: 'border-[rgba(180,83,9,0.34)] bg-[rgba(180,83,9,0.14)] text-[#9a3412]',
    Icon: Icons.Alert,
  },
  absenteismo_cronico: {
    label: 'Absenteísmo Crônico',
    itemClass: 'border-[#0e1b33] bg-[#0e1b33] text-white',
    Icon: Icons.Alert,
  },
}

const orderByType = {
  consulta: 3,
  pressao: 4,
  hemoglobina: 5,
  pes: 6,
  peso_altura: 7,
  visita: 8,
  indisponivel: 9,
}

const orderByStatus = {
  OVERDUE: 1,
  CRITICAL: 2,
  ATTENTION: 3,
  PENDING: 3,
  UNAVAILABLE: 3,
}

const getPendingDelayHistory = (pending, indicator, delayHistoryRecord) => (
  getDelayHistoryStatus(delayHistoryRecord || {}, { pendingItems: [pending], indicator })
)

const getPendingDetailsText = (pending) => {
  if (pending.type === 'consulta') return 'O relatório não encontrou a consulta de acompanhamento necessária para este quadrimestre.'
  if (pending.type === 'pressao') return 'O relatório não encontrou o registro de aferição de pressão necessário para este quadrimestre.'
  if (pending.type === 'visita') {
    return pending.requiredAmount === 2
      ? 'Ainda são necessárias duas visitas domiciliares para atender ao acompanhamento previsto.'
      : 'Ainda é necessária uma visita domiciliar para atender ao acompanhamento previsto.'
  }
  if (pending.type === 'peso_altura') return 'O relatório não encontrou o registro de peso e altura necessário para este quadrimestre.'
  if (pending.type === 'hemoglobina') return 'O relatório não encontrou hemoglobina glicada solicitada ou avaliada neste quadrimestre.'
  if (pending.type === 'pes') return 'O relatório não encontrou a avaliação dos pés necessária para este quadrimestre.'
  return 'Os dados necessários não foram encontrados no relatório importado.'
}

const sortPendencies = (items) => (
  [...items].sort((a, b) => (
    (orderByStatus[a.status] || 20) - (orderByStatus[b.status] || 20)
    || (orderByType[a.type] || 20) - (orderByType[b.type] || 20)
  ))
)

export const PendingCountBadge = ({ count }) => (
  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
    count
      ? 'border-[rgba(240,132,0,0.24)] bg-[rgba(240,132,0,0.09)] text-[var(--warning)]'
      : 'border-[rgba(6,154,88,0.22)] bg-[rgba(6,154,88,0.08)] text-[var(--success)]'
  }`}>
    {count ? `${count} ${count === 1 ? 'pendência' : 'pendências'}` : 'Em dia'}
  </span>
)

export const CareDelayHistoryStatus = ({ pending, indicator, delayHistoryRecord }) => {
  const delayHistory = getPendingDelayHistory(pending, indicator, delayHistoryRecord)
  const config = delayHistoryPendingConfig[delayHistory.status]
  if (!config) return null

  return (
    <span className="mt-1 block text-xs font-semibold">
      {config.label}
    </span>
  )
}

export const PendingCareDetails = ({ pending, indicator, delayHistoryRecord }) => {
  const delayHistory = getPendingDelayHistory(pending, indicator, delayHistoryRecord)
  const config = delayHistoryPendingConfig[delayHistory.status] || delayHistoryPendingConfig.moderado

  return (
    <div className={`mt-3 rounded-lg border p-3 text-sm ${config.itemClass}`}>
      <p className="font-semibold">{pending.label}</p>
      <p className="mt-2 leading-5">{getPendingDetailsText(pending)}</p>
      <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium opacity-80">Histórico de atraso</dt>
          <dd className="font-semibold">{delayHistory.text}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium opacity-80">Indicador</dt>
          <dd className="font-semibold">{indicatorLabels[indicator].description}</dd>
        </div>
      </dl>
    </div>
  )
}

export const PendingCareItem = ({ pending, indicator, delayHistoryRecord }) => {
  const [isOpen, setIsOpen] = useState(false)
  const delayHistory = getPendingDelayHistory(pending, indicator, delayHistoryRecord)
  const config = delayHistoryPendingConfig[delayHistory.status] || delayHistoryPendingConfig.moderado
  const Icon = config.Icon

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className={`min-h-11 w-full rounded-lg border px-3 py-2 text-left text-sm font-semibold transition hover:bg-white ${config.itemClass}`}
        aria-expanded={isOpen}
      >
        <span className="flex items-start gap-2">
          <span className="mt-0.5" aria-hidden="true"><Icon /></span>
          <span>
            <span className="block">{pending.label}</span>
            <CareDelayHistoryStatus pending={pending} indicator={indicator} delayHistoryRecord={delayHistoryRecord} />
          </span>
        </span>
      </button>
      {isOpen && <PendingCareDetails pending={pending} indicator={indicator} delayHistoryRecord={delayHistoryRecord} />}
    </div>
  )
}

export const PendingCareBadge = ({ pending, delayHistoryRecord }) => {
  const delayHistory = getPendingDelayHistory(pending, pending.indicator, delayHistoryRecord)
  const config = delayHistoryPendingConfig[delayHistory.status] || delayHistoryPendingConfig.moderado
  const Icon = config.Icon

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.itemClass}`}>
      <Icon />
      {pending.label}
    </span>
  )
}

export const CareStatusEmptyState = ({ indicator }) => (
  <div className="rounded-lg border border-[rgba(6,154,88,0.22)] bg-[rgba(6,154,88,0.08)] p-3 text-sm text-[var(--success)]">
    <div className="flex items-start gap-2">
      <span className="mt-0.5" aria-hidden="true"><Icons.CheckCircle /></span>
      <div>
        <p className="font-semibold">{indicator} em dia</p>
        <p className="mt-1 leading-5">Nenhuma pendência identificada para o {indicator} neste quadrimestre.</p>
      </div>
    </div>
  </div>
)

export const PatientCarePendingSection = ({ indicator, pendencies, delayHistoryRecord }) => {
  const sortedPendencies = sortPendencies(pendencies)

  return (
    <section className="rounded-xl border border-[var(--border)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] bg-[#f7faff] p-4">
        <div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">{indicatorLabels[indicator].title}</h3>
          <p className="mt-1 text-sm font-semibold text-[var(--primary-dark)]">{indicator}</p>
        </div>
        <PendingCountBadge count={sortedPendencies.length} />
      </div>
      <div className="p-4">
        {sortedPendencies.length ? (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {sortedPendencies.map((pending) => (
                <PendingCareItem key={pending.id} pending={pending} indicator={indicator} delayHistoryRecord={delayHistoryRecord} />
              ))}
            </div>
          </>
        ) : (
          <CareStatusEmptyState indicator={indicator} />
        )}
      </div>
    </section>
  )
}

const getIndicatorPendencies = (patient, selectedIndicator = 'all') => {
  if (selectedIndicator === 'C4') return patient.c4Pendencies
  if (selectedIndicator === 'C5') return patient.c5Pendencies
  return [...patient.c4Pendencies, ...patient.c5Pendencies]
}

export const PatientPendingSummary = ({ patient, selectedIndicator = 'all' }) => {
  const pendencies = getIndicatorPendencies(patient, selectedIndicator)

  if (!pendencies.length) {
    const label = selectedIndicator === 'all' ? 'Em dia' : `${selectedIndicator} em dia`

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(6,154,88,0.22)] bg-[rgba(6,154,88,0.08)] px-2.5 py-1 text-xs font-semibold text-[var(--success)]">
        <Icons.CheckCircle />
        {label}
      </span>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {sortPendencies(pendencies).slice(0, 4).map((pending) => (
        <PendingCareBadge key={`${pending.indicator}-${pending.id}`} pending={pending} delayHistoryRecord={patient} />
      ))}
      {pendencies.length > 4 && (
        <span className="rounded-full border border-[var(--border-subtle)] bg-[#f4f7fb] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)]">
          +{pendencies.length - 4}
        </span>
      )}
    </div>
  )
}
