import { useEffect, useMemo, useRef, useState } from 'react'
import { PendingCareItem } from '../components/pacientes/PatientCarePendingSection'
import { Icons } from '../components/ui/Icons'
import { DelayHistoryBadge, getDelayHistoryStatus } from '../components/ui/TemporalStatusBadge'
import { ACTIVE_SEARCH_METADATA, ACTIVE_SEARCH_PRIORITIES, ACTIVE_SEARCH_RECORDS, ACTIVE_SEARCH_TEAMS } from '../data/buscaAtivaData'

const stepLabels = [
  { id: 'team', label: 'Equipe' },
  { id: 'priority', label: 'Prioridade' },
  { id: 'list', label: 'Lista territorial' },
]

const tableFilterColumns = [
  { id: 'all', label: 'Todas as colunas' },
  { id: 'patient', label: 'Paciente' },
  { id: 'acs', label: 'ACS responsável' },
  { id: 'pending', label: 'Pendência' },
]

const priorityCardStyles = {
  absenteismo: {
    border: 'border-l-[var(--danger)]',
    icon: 'bg-[rgba(224,47,53,0.08)] text-[var(--danger)]',
    text: 'text-[var(--danger)]',
  },
  parcial: {
    border: 'border-l-[var(--alert)]',
    icon: 'bg-[rgba(229,109,34,0.08)] text-[var(--alert)]',
    text: 'text-[var(--alert)]',
  },
}

const pluralize = (count, singular, plural = `${singular}s`) => `${count} ${count === 1 ? singular : plural}`

const quarterDeadline = '2026-08-31'

const pendingNameConfig = {
  Consulta: { type: 'consulta', label: 'Registrar consulta' },
  'Aferição de pressão': { type: 'pressao', label: 'Aferir pressão' },
  'Visita domiciliar': { type: 'visita', label: 'Registrar 1 visita', requiredAmount: 1 },
  'Peso e altura': { type: 'peso_altura', label: 'Registrar peso e altura' },
  'Hemoglobina glicada': { type: 'hemoglobina', label: 'Solicitar ou avaliar hemoglobina glicada' },
  'Avaliação do pé diabético': { type: 'pes', label: 'Realizar avaliação dos pés' },
}

const getDaysFromDueText = (due) => {
  const [value] = due.match(/\d+/) || ['30']
  return Number(value)
}

const getRecordDelayHistory = (record) => getDelayHistoryStatus(record, { pendingItems: record.pendingItems })

const isAbsenteeismQueueRecord = (record) => (
  record.classification === 'absenteismo' ||
  ['absenteismo_recente', 'absenteismo_cronico'].includes(getRecordDelayHistory(record).status)
)

const getDeadlineStatus = (daysRemaining) => {
  if (daysRemaining <= 0) return 'OVERDUE'
  if (daysRemaining <= 10) return 'CRITICAL'
  if (daysRemaining <= 30) return 'ATTENTION'
  return 'PENDING'
}

const getMotivatingPendingItems = (record) => {
  const hasHomeVisit = record.pendingItems.some((item) => item.name === 'Visita domiciliar')

  if (hasHomeVisit) return record.pendingItems

  return [
    ...record.pendingItems,
    {
      id: `${record.id}-visita-domiciliar`,
      indicator: record.clinicalConditions.some((condition) => condition.startsWith('C4')) ? 'C4' : 'C5',
      name: 'Visita domiciliar',
      due: record.pendingItems[0]?.due || '10 dias',
    },
  ]
}

const normalizePendingItem = (item) => {
  const config = pendingNameConfig[item.name] || {
    type: 'indisponivel',
    label: 'Dados não encontrados no relatório',
  }
  const daysRemaining = getDaysFromDueText(item.due)

  return {
    id: item.id,
    indicator: item.indicator,
    type: config.type,
    label: config.label,
    requiredAmount: config.requiredAmount,
    deadline: quarterDeadline,
    daysRemaining,
    status: getDeadlineStatus(daysRemaining),
  }
}

const normalizeRecordPendencies = (record) => getMotivatingPendingItems(record).map(normalizePendingItem)

const getCurrentStep = (selectedTeam, selectedPriority) => {
  if (selectedTeam && selectedPriority) return 'list'
  if (selectedTeam) return 'priority'
  return 'team'
}

const getTeamRecords = (teamId) => ACTIVE_SEARCH_RECORDS.filter((record) => record.teamId === teamId)

const getTeamSummary = () => ACTIVE_SEARCH_TEAMS.map((team) => {
  const records = getTeamRecords(team.id)

  return {
    ...team,
    totalPatients: records.length,
    criticalVisits: records.filter((record) => record.priority === 'Crítica').length,
  }
})

const getPriorityConfig = (priorityId) => ACTIVE_SEARCH_PRIORITIES.find((priority) => priority.id === priorityId)

const getRecordSearchValue = (record, column) => {
  const pendingText = getMotivatingPendingItems(record).map((item) => `${item.indicator} ${item.name}`).join(' ')

  if (column === 'all') {
    return `${record.patientInitials} ${record.cpf} ${record.acsInitials} ${record.contactStatus} ${pendingText}`
  }

  if (column === 'patient') return `${record.patientInitials} ${record.cpf}`
  if (column === 'acs') return record.acsInitials
  if (column === 'pending') return pendingText
  return ''
}

const StepIndicator = ({ currentStep }) => {
  const currentIndex = stepLabels.findIndex((step) => step.id === currentStep)

  return (
    <ol className="flex flex-wrap items-center gap-2" aria-label="Etapas da Busca Ativa">
      {stepLabels.map((step, index) => {
        const isCurrent = step.id === currentStep
        const isDone = index < currentIndex

        return (
          <li key={step.id} className="flex items-center gap-2">
            <span className={`grid h-7 w-7 place-items-center rounded-full border text-xs font-semibold ${
              isCurrent
                ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                : isDone
                  ? 'border-[rgba(6,154,88,0.28)] bg-[rgba(6,154,88,0.08)] text-[var(--success)]'
                  : 'border-[var(--border)] bg-white text-[var(--text-muted)]'
            }`}>
              {index + 1}
            </span>
            <span className={`text-xs font-semibold ${isCurrent ? 'text-[var(--primary-dark)]' : isDone ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
              {step.label}
            </span>
            {index < stepLabels.length - 1 && <span className="h-px w-10 bg-[var(--border)]" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}

const PageShell = ({ currentStep, children }) => (
  <div className="max-w-full space-y-6 overflow-x-hidden">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary-dark)]">Território / Organização do cuidado</p>
        <h1 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">Busca Ativa (ACS)</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
          Selecione a equipe, defina a prioridade e organize a lista territorial de pacientes.
        </p>
      </div>
      <StepIndicator currentStep={currentStep} />
    </header>
    {children}
  </div>
)

const SummaryCard = ({ label, value, description, tone }) => {
  const toneClass = tone === 'danger'
    ? 'bg-[rgba(224,47,53,0.08)] text-[var(--danger)]'
    : tone === 'alert'
      ? 'bg-[rgba(229,109,34,0.08)] text-[var(--alert)]'
      : 'bg-[rgba(22,103,232,0.08)] text-[var(--primary-dark)]'

  return (
    <article className="app-card flex items-center gap-4 p-5">
      <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-lg font-semibold ${toneClass}`} aria-hidden="true">!</div>
      <div>
        <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">{value}</p>
        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{description}</p>
      </div>
    </article>
  )
}

const InfoNotice = ({ title, text, tone = 'info' }) => (
  <section className={`rounded-xl border p-5 ${
    tone === 'danger'
      ? 'border-[rgba(224,47,53,0.18)] bg-[rgba(224,47,53,0.07)]'
      : tone === 'alert'
        ? 'border-[rgba(229,109,34,0.22)] bg-[rgba(229,109,34,0.08)]'
        : 'border-[rgba(22,103,232,0.2)] bg-[rgba(22,103,232,0.07)]'
  }`}>
    <div className="flex gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[rgba(22,103,232,0.08)] text-[var(--primary)]" aria-hidden="true">
        <Icons.Activity />
      </span>
      <div>
        <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{text}</p>
      </div>
    </div>
  </section>
)

const TeamCard = ({ team, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(team)}
    className="app-card flex min-h-32 items-center justify-between gap-4 p-5 text-left transition hover:border-[rgba(22,103,232,0.34)] hover:bg-[var(--surface-interactive)]"
    aria-label={`Selecionar ${team.name}, INE ${team.ine}`}
  >
    <span className="min-w-0">
      <span className="block truncate font-semibold text-[var(--text-primary)]">{team.name}</span>
      <span className="mt-3 block text-xs text-[var(--text-muted)]">INE {team.ine}</span>
      <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        team.criticalVisits
          ? 'border border-[rgba(224,47,53,0.2)] bg-[rgba(224,47,53,0.08)] text-[var(--danger)]'
          : 'border border-[var(--border-subtle)] bg-[#f4f7fb] text-[var(--text-muted)]'
      }`}>
        {team.criticalVisits ? pluralize(team.criticalVisits, 'visita crítica', 'visitas críticas') : 'Sem visita crítica'}
      </span>
    </span>
    <span className="flex shrink-0 items-center gap-4">
      <span className="soft-pill px-3 py-1 text-xs font-semibold">
        {pluralize(team.totalPatients, 'paciente')}
      </span>
      <span className="text-xl text-[var(--text-muted)]" aria-hidden="true">›</span>
    </span>
  </button>
)

const EmptyState = ({ title = 'Nenhum registro encontrado', description = 'Revise os termos utilizados na busca.', onClear }) => (
  <div className="app-card px-6 py-10 text-center">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(22,103,232,0.18)] bg-[rgba(22,103,232,0.08)] text-[var(--primary)]" aria-hidden="true">
      <Icons.Search />
    </div>
    <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
    <p className="mt-2 text-sm text-[var(--text-muted)]">{description}</p>
    {onClear && (
      <button type="button" onClick={onClear} className="btn-secondary mt-5 px-4 py-2 text-sm font-semibold">
        Limpar busca
      </button>
    )}
  </div>
)

const PriorityCard = ({ priority, total, criticalCount, onSelect }) => {
  const style = priorityCardStyles[priority.id]

  return (
    <button
      type="button"
      onClick={() => onSelect(priority.id)}
      className={`app-card flex min-h-56 flex-col justify-between border-l-4 p-6 text-left transition hover:border-[var(--primary)] hover:bg-[var(--surface-interactive)] ${style.border}`}
      aria-label={`Selecionar ${priority.label}, ${total} pacientes`}
    >
      <div className="flex items-start gap-4">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-lg font-semibold ${style.icon}`} aria-hidden="true">!</span>
        <span>
          <span className={`block text-lg font-semibold ${style.text}`}>{priority.label}</span>
          <span className="mt-2 block text-sm leading-6 text-[var(--text-secondary)]">{priority.description}</span>
        </span>
      </div>
      <div className="mt-6 flex items-end justify-between gap-4">
        <span>
          <span className="block text-3xl font-semibold text-[var(--text-primary)]">
            {total} <span className="text-sm font-normal text-[var(--text-secondary)]">{total === 1 ? 'paciente' : 'pacientes'}</span>
          </span>
          <span className="mt-3 block text-xs text-[var(--text-muted)]">
            {priority.id === 'absenteismo'
              ? `${pluralize(criticalCount, 'em prioridade crítica', 'em prioridade crítica')}`
              : 'Contato orientado para conclusão do cuidado.'}
          </span>
        </span>
        <span className={`text-2xl ${style.text}`} aria-hidden="true">›</span>
      </div>
    </button>
  )
}

const ConditionBadges = ({ conditions }) => (
  <div className="flex flex-wrap gap-2">
    {conditions.map((condition) => {
      const isC4 = condition.startsWith('C4')

      return (
        <span
          key={condition}
          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
            isC4
              ? 'border-[rgba(126,87,194,0.18)] bg-[rgba(126,87,194,0.1)] text-[#5f43a8]'
              : 'border-[rgba(53,167,184,0.2)] bg-[rgba(53,167,184,0.1)] text-[#116b7a]'
          }`}
        >
          {condition}
        </span>
      )
    })}
  </div>
)

const ActiveSearchDelayHistoryBadge = ({ record }) => {
  const delayHistory = getRecordDelayHistory(record)

  return <DelayHistoryBadge status={delayHistory.status} text={delayHistory.text} />
}

const SearchToolbar = ({ filterColumn, query, onChangeColumn, onChangeQuery }) => (
  <div className="app-card p-5">
    <div className="grid grid-cols-1 gap-3 md:grid-cols-[14rem_1fr]">
      <label className="sr-only" htmlFor="active-search-filter-column">Coluna da pesquisa</label>
      <select
        id="active-search-filter-column"
        value={filterColumn}
        onChange={(event) => onChangeColumn(event.target.value)}
        className="form-control px-3 py-2 text-sm outline-none"
        aria-label="Selecionar coluna da pesquisa"
      >
        {tableFilterColumns.map((column) => (
          <option key={column.id} value={column.id}>{column.label}</option>
        ))}
      </select>
      <label className="form-shell flex items-center px-3 py-2">
        <span className="mr-2 text-[var(--text-muted)]" aria-hidden="true"><Icons.Search /></span>
        <span className="sr-only">Buscar por paciente, ACS ou pendência</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onChangeQuery(event.target.value)}
          placeholder="Buscar por paciente, ACS ou pendência"
          className="app-input w-full border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none"
        />
      </label>
    </div>
  </div>
)

const TerritorialTable = ({ records, team, onPlan }) => (
  <div className="app-card overflow-x-auto">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-5 py-4">
      <div>
        <h3 className="font-semibold text-[var(--text-primary)]">Fila territorial</h3>
        <p className="mt-1 text-xs text-[var(--text-muted)]">{pluralize(records.length, 'registro demonstrativo')}</p>
      </div>
    </div>
    <table className="data-table min-w-[760px]">
      <thead>
        <tr>
          {['Paciente', 'Condição', 'Equipe / ACS', 'Histórico de atraso', 'Ação'].map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <tr key={record.id}>
            <td className="whitespace-nowrap">
              <button
                type="button"
                onClick={(event) => onPlan(record, event)}
                className="font-semibold text-[var(--text-primary)] hover:text-[var(--primary-dark)] hover:underline"
                aria-label={`Planejar busca ativa de ${record.patientInitials}`}
              >
                {record.patientInitials}
              </button>
              <span className="mt-1 block text-xs font-normal text-[var(--text-muted)]">CPF {record.cpf}</span>
            </td>
            <td><ConditionBadges conditions={record.clinicalConditions} /></td>
            <td>
              <span className="block font-semibold text-[var(--text-primary)]">{team.name}</span>
              <span className="mt-1 block text-xs text-[var(--text-muted)]">ACS {record.acsInitials}</span>
            </td>
            <td><ActiveSearchDelayHistoryBadge record={record} /></td>
            <td>
              <button
                type="button"
                onClick={(event) => onPlan(record, event)}
                className="text-sm font-semibold text-[var(--primary-dark)] hover:underline"
                aria-label={`Planejar busca ativa para ${record.patientInitials}`}
              >
                Planejar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const DetailField = ({ label, value }) => (
  <div className="rounded-xl border border-[var(--border-subtle)] bg-[#f7faff] p-3">
    <dt className="text-xs font-medium uppercase text-[var(--text-muted)]">{label}</dt>
    <dd className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{value}</dd>
  </div>
)

const AbsenteeismPendingNotice = ({ previousPendingItems }) => (
  <div className="mb-4 grid grid-cols-1 gap-3">
    <div className="rounded-lg border border-[rgba(229,109,34,0.22)] bg-[rgba(229,109,34,0.08)] p-3 text-sm text-[var(--alert)]">
      <div className="flex gap-2">
        <span className="mt-0.5" aria-hidden="true"><Icons.Alert /></span>
        <p className="font-semibold">Nenhum outro procedimento foi registrado neste quadrimestre; a visita domiciliar está próxima do fechamento do quadrimestre.</p>
      </div>
    </div>
    <div className="rounded-lg border border-[rgba(224,47,53,0.18)] bg-[rgba(224,47,53,0.07)] p-3 text-sm text-[var(--danger)]">
      <div className="flex gap-2">
        <span className="mt-0.5" aria-hidden="true"><Icons.Calendar /></span>
        <div>
          <p className="font-semibold">Há pendências desde o quadrimestre anterior ou mais antigo.</p>
          <ul className="mt-2 space-y-1 text-xs font-semibold leading-5">
            {previousPendingItems.map((item) => (
              <li key={`${item.label}-${item.quarter}`}>{item.label}: não atendida no {item.quarter}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
)

const PlanningDrawer = ({ record, team, onClose, triggerRef }) => {
  const closeButtonRef = useRef(null)
  const [feedback, setFeedback] = useState('')
  const normalizedPendencies = normalizeRecordPendencies(record)

  useEffect(() => {
    const opener = triggerRef.current
    closeButtonRef.current?.focus()
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      opener?.focus()
    }
  }, [onClose, triggerRef])

  const handleDemoAction = (message) => {
    setFeedback(message)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(14,27,51,0.36)]" onMouseDown={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="active-search-planning-title"
        className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-[-20px_0_44px_rgba(25,55,95,0.18)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary-dark)]">Planejamento de busca ativa</p>
            <h2 id="active-search-planning-title" className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">{record.patientInitials}</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{team.name}</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)] text-xl font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-interactive)]"
            aria-label="Fechar planejamento"
          >
            ×
          </button>
        </div>

        <section className="mt-5 rounded-xl border border-[var(--border)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[rgba(22,103,232,0.08)] text-lg font-semibold text-[var(--primary-dark)]" aria-hidden="true">
                {record.patientInitials.split('.')[0]}.
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{record.patientInitials}</h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">CPF {record.cpf}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">CNS {record.cns}</p>
              </div>
            </div>
            <ActiveSearchDelayHistoryBadge record={record} />
          </div>
        </section>

        <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailField label="Equipe responsável" value={team.name} />
          <DetailField label="ACS responsável" value={record.acsInitials} />
        </dl>

        <section className="mt-5 rounded-xl border border-[var(--border)]">
          <div className="border-b border-[var(--border-subtle)] bg-[#f7faff] p-4">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Pendências que motivam o contato</h3>
          </div>
          <div className="p-4">
            {record.classification === 'absenteismo' && (
              <AbsenteeismPendingNotice previousPendingItems={record.previousPendingItems || []} />
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {normalizedPendencies.map((pending) => (
                <PendingCareItem key={`${pending.indicator}-${pending.id}`} pending={pending} indicator={pending.indicator} delayHistoryRecord={record} />
              ))}
            </div>
          </div>
        </section>

        <dl className="mt-5 rounded-xl border border-[var(--border)]">
          {[
            ['Origem dos dados', ACTIVE_SEARCH_METADATA.origin],
            ['Competência', ACTIVE_SEARCH_METADATA.competence],
            ['Escopo clínico', ACTIVE_SEARCH_METADATA.clinicalScope],
          ].map(([label, value], index) => (
            <div key={label} className={`flex justify-between gap-4 px-4 py-3 ${index ? 'border-t border-[var(--border-subtle)]' : ''}`}>
              <dt className="text-xs text-[var(--text-muted)]">{label}</dt>
              <dd className="text-right text-sm font-semibold text-[var(--text-primary)]">{value}</dd>
            </div>
          ))}
        </dl>

        {feedback && (
          <p className="mt-4 rounded-xl border border-[rgba(6,154,88,0.2)] bg-[rgba(6,154,88,0.08)] px-4 py-3 text-sm font-semibold text-[var(--success)]">
            {feedback}
          </p>
        )}

        <div className="mt-6">
          <button
            type="button"
            onClick={() => handleDemoAction('Ação demonstrativa: planejamento registrado no protótipo.')}
            className="btn-primary w-full px-4 py-2 text-sm font-semibold sm:w-auto"
          >
            Concluir planejamento
          </button>
        </div>
      </aside>
    </div>
  )
}

export const BuscaAtivaView = () => {
  const [teamQuery, setTeamQuery] = useState('')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [selectedPriority, setSelectedPriority] = useState(null)
  const [patientQuery, setPatientQuery] = useState('')
  const [filterColumn, setFilterColumn] = useState('all')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const planningTriggerRef = useRef(null)

  const teams = useMemo(() => getTeamSummary(), [])
  const currentStep = getCurrentStep(selectedTeam, selectedPriority)

  const summary = useMemo(() => ({
    critical: ACTIVE_SEARCH_RECORDS.filter((record) => record.priority === 'Crítica').length,
    absenteeism: ACTIVE_SEARCH_RECORDS.filter(isAbsenteeismQueueRecord).length,
    partial: ACTIVE_SEARCH_RECORDS.filter((record) => record.classification === 'parcial' && !isAbsenteeismQueueRecord(record)).length,
  }), [])

  const filteredTeams = useMemo(() => {
    const normalizedQuery = teamQuery.trim().toLowerCase()
    if (!normalizedQuery) return teams

    return teams.filter((team) => (
      team.name.toLowerCase().includes(normalizedQuery) || team.ine.includes(normalizedQuery)
    ))
  }, [teamQuery, teams])

  const selectedTeamRecords = useMemo(() => (
    selectedTeam ? ACTIVE_SEARCH_RECORDS.filter((record) => record.teamId === selectedTeam.id) : []
  ), [selectedTeam])

  const priorityRecords = useMemo(() => {
    if (!selectedPriority) return []
    if (selectedPriority === 'absenteismo') return selectedTeamRecords.filter(isAbsenteeismQueueRecord)

    return selectedTeamRecords.filter((record) => record.classification === selectedPriority && !isAbsenteeismQueueRecord(record))
  }, [selectedPriority, selectedTeamRecords])

  const filteredRecords = useMemo(() => {
    const normalizedQuery = patientQuery.trim().toLowerCase()
    if (!normalizedQuery) return priorityRecords

    return priorityRecords.filter((record) => (
      getRecordSearchValue(record, filterColumn).toLowerCase().includes(normalizedQuery)
    ))
  }, [filterColumn, patientQuery, priorityRecords])

  const selectedPriorityConfig = selectedPriority ? getPriorityConfig(selectedPriority) : null

  const handleSelectTeam = (team) => {
    setSelectedTeam(team)
    setSelectedPriority(null)
    setPatientQuery('')
    setSelectedRecord(null)
  }

  const handleBackToTeams = () => {
    setSelectedTeam(null)
    setSelectedPriority(null)
    setPatientQuery('')
    setSelectedRecord(null)
  }

  const handleBackToPriorities = () => {
    setSelectedPriority(null)
    setPatientQuery('')
    setSelectedRecord(null)
  }

  const handleOpenPlanning = (record, event) => {
    planningTriggerRef.current = event.currentTarget
    setSelectedRecord(record)
  }

  // A futura API deve validar no servidor se a gestora pode acessar a equipe solicitada.
  return (
    <PageShell currentStep={currentStep}>
      {!selectedTeam && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SummaryCard label="Absenteísmo" value={summary.absenteeism} description="pacientes sem retorno ao cuidado" tone="alert" />
            <SummaryCard label="Acompanhamento parcial" value={summary.partial} description="pacientes com cuidado incompleto" tone="info" />
          </div>

          <InfoNotice
            title="Busca ativa por visita domiciliar pendente"
            text="Nesta fila entram pacientes que possuem pendência de visita domiciliar nos relatórios importados do quadrimestre."
          />

          <div className="app-card p-5">
            <label className="text-sm font-semibold text-[var(--text-secondary)]" htmlFor="active-team-search">Buscar equipe ou INE</label>
            <div className="form-shell mt-2 flex items-center px-3 py-2">
              <span className="mr-2 text-[var(--text-muted)]" aria-hidden="true"><Icons.Search /></span>
              <input
                id="active-team-search"
                type="search"
                value={teamQuery}
                onChange={(event) => setTeamQuery(event.target.value)}
                placeholder="Digite o nome da equipe ou o INE"
                className="app-input w-full border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none"
              />
            </div>
          </div>

          {filteredTeams.length ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredTeams.map((team) => (
                <TeamCard key={team.id} team={team} onSelect={handleSelectTeam} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhuma equipe encontrada"
              description="Revise o nome da equipe ou o número INE informado."
              onClear={() => setTeamQuery('')}
            />
          )}
        </section>
      )}

      {selectedTeam && !selectedPriority && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">Equipe selecionada</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">{selectedTeam.name}</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">INE {selectedTeam.ine} · {pluralize(selectedTeamRecords.length, 'paciente')} na fila territorial</p>
            </div>
            <button type="button" onClick={handleBackToTeams} className="btn-secondary px-4 py-2 text-sm font-semibold">
              Voltar para equipes
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {ACTIVE_SEARCH_PRIORITIES.map((priority) => {
              const records = priority.id === 'absenteismo'
                ? selectedTeamRecords.filter(isAbsenteeismQueueRecord)
                : selectedTeamRecords.filter((record) => record.classification === priority.id && !isAbsenteeismQueueRecord(record))
              const criticalCount = records.filter((record) => record.priority === 'Crítica').length

              return (
                <PriorityCard
                  key={priority.id}
                  priority={priority}
                  total={records.length}
                  criticalCount={criticalCount}
                  onSelect={setSelectedPriority}
                />
              )
            })}
          </div>
        </section>
      )}

      {selectedTeam && selectedPriority && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">{selectedTeam.name} · INE {selectedTeam.ine}</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">{selectedPriorityConfig.shortLabel}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Lista territorial segmentada para apoiar o planejamento do ACS.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleBackToPriorities} className="btn-secondary px-4 py-2 text-sm font-semibold">
                Prioridades
              </button>
              <button type="button" onClick={handleBackToTeams} className="btn-secondary px-4 py-2 text-sm font-semibold">
                Equipes
              </button>
            </div>
          </div>

          <SearchToolbar
            filterColumn={filterColumn}
            query={patientQuery}
            onChangeColumn={setFilterColumn}
            onChangeQuery={setPatientQuery}
          />

          {filteredRecords.length ? (
            <TerritorialTable records={filteredRecords} team={selectedTeam} onPlan={handleOpenPlanning} />
          ) : (
            <EmptyState
              title="Nenhum paciente nesta seleção"
              description="Não há pacientes para a equipe, prioridade e pesquisa informadas."
              onClear={() => setPatientQuery('')}
            />
          )}
        </section>
      )}

      {selectedRecord && selectedTeam && selectedPriorityConfig && (
        <PlanningDrawer
          record={selectedRecord}
          team={selectedTeam}
          onClose={() => setSelectedRecord(null)}
          triggerRef={planningTriggerRef}
        />
      )}
    </PageShell>
  )
}
