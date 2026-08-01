import { useEffect, useMemo, useRef, useState } from 'react'
import { Icons } from '../components/ui/Icons'
import { getDelayHistoryStatus } from '../utils/temporalStatus'
import { PATIENT_CLASSIFICATIONS, PATIENT_MODULE_DATA } from '../data/pacientesModuleData'

const stepLabels = [
  { id: 'team', label: 'Equipe' },
  { id: 'classification', label: 'Classificação' },
  { id: 'patients', label: 'Pacientes' },
]

const toneStyles = {
  success: 'border-[rgba(6,154,88,0.24)] bg-[rgba(6,154,88,0.08)] text-[var(--success)]',
  alert: 'border-[rgba(229,109,34,0.26)] bg-[rgba(229,109,34,0.08)] text-[var(--alert)]',
  danger: 'border-[rgba(224,47,53,0.24)] bg-[rgba(224,47,53,0.08)] text-[var(--danger)]',
  info: 'border-[rgba(22,103,232,0.2)] bg-[rgba(22,103,232,0.08)] text-[var(--primary-dark)]',
}

const filterColumns = [
  { id: 'all', label: 'Todas as colunas' },
  { id: 'name', label: 'Nome' },
  { id: 'cpf', label: 'CPF' },
  { id: 'pendencies', label: 'Pendências' },
]

const indicatorOptions = [
  { id: 'all', label: 'Todos os indicadores' },
  { id: 'C4', label: 'C4 — Diabetes' },
  { id: 'C5', label: 'C5 — Hipertensão' },
]

const hasSelectedIndicator = (patient, selectedIndicator) => (
  selectedIndicator === 'all' || patient.condition.some((condition) => condition.startsWith(selectedIndicator))
)

const getPatientPendenciesByIndicator = (patient, selectedIndicator) => {
  if (selectedIndicator === 'C4') return patient.c4Pendencies.filter((pendency) => pendency.pendente).map((pendency) => `C4 — ${pendency.codigo}: ${pendency.descricao}`)
  if (selectedIndicator === 'C5') return patient.c5Pendencies.filter((pendency) => pendency.pendente).map((pendency) => `C5 — ${pendency.codigo}: ${pendency.descricao}`)
  return patient.clinicalPendencies
}

const getPatientDelayHistory = (patient, selectedIndicator) => {
  const pendencies = selectedIndicator === 'C4'
    ? patient.c4Pendencies
    : selectedIndicator === 'C5'
      ? patient.c5Pendencies
      : [...patient.c4Pendencies, ...patient.c5Pendencies]

  return getDelayHistoryStatus(patient, { pendingItems: pendencies, indicator: selectedIndicator === 'all' ? null : selectedIndicator })
}

const getStep = (selectedTeam, selectedClassification) => {
  if (selectedTeam && selectedClassification) return 'patients'
  if (selectedClassification) return 'patients'
  if (selectedTeam) return 'classification'
  return 'team'
}

const getPatientSearchValue = (patient, column, selectedIndicator) => {
  const pendencies = getPatientPendenciesByIndicator(patient, selectedIndicator)

  if (column === 'pendencies') return pendencies.join(' ')
  if (column === 'all') return `${patient.name} ${patient.cpf} ${patient.indicador} ${patient.metasAtuais} ${pendencies.join(' ')}`
  return patient[column] || ''
}

const getTeams = (patients) => {
  const teams = new Map()

  patients.forEach((patient) => {
    if (!teams.has(patient.teamId)) {
      teams.set(patient.teamId, {
        id: patient.teamId,
        name: patient.ubs,
        ine: patient.ine,
        patients: 0,
      })
    }

    teams.get(patient.teamId).patients += 1
  })

  return [...teams.values()]
}

const IndicatorSelect = ({ value, onChange, compact = false }) => (
  <label className={compact ? 'block min-w-56' : 'block'}>
    <span className="text-sm font-semibold text-[var(--text-secondary)]">Indicador</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="form-control mt-2 w-full px-3 py-2 text-sm outline-none"
    >
      {indicatorOptions.map((indicator) => (
        <option key={indicator.id} value={indicator.id}>{indicator.label}</option>
      ))}
    </select>
  </label>
)

const StepIndicator = ({ currentStep }) => {
  const currentIndex = stepLabels.findIndex((step) => step.id === currentStep)

  return (
    <ol className="flex flex-wrap items-center gap-2" aria-label="Etapas do módulo Pacientes">
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
  <div className="space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Pacientes</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Seleção por equipe, classificação de acompanhamento e pendências individuais</p>
      </div>
      <StepIndicator currentStep={currentStep} />
    </header>
    {children}
  </div>
)

const TeamCard = ({ team, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(team)}
    className="app-card flex min-h-28 items-center justify-between gap-4 p-5 text-left transition hover:border-[rgba(22,103,232,0.34)] hover:bg-[var(--surface-interactive)]"
    aria-label={`Selecionar equipe ${team.name}, INE ${team.ine}`}
  >
    <span>
      <span className="block font-semibold text-[var(--text-primary)]">{team.name}</span>
      <span className="mt-3 block text-xs text-[var(--text-muted)]">INE {team.ine}</span>
    </span>
    <span className="flex items-center gap-4">
      <span className="soft-pill px-3 py-1 text-xs font-semibold">
        {team.patients} {team.patients === 1 ? 'paciente' : 'pacientes'}
      </span>
      <span className="text-xl text-[var(--text-muted)]" aria-hidden="true">›</span>
    </span>
  </button>
)

const ClassificationCard = ({ category, total, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(category.id)}
    className={`app-card flex min-h-36 flex-col justify-between border-l-4 p-5 text-left transition hover:bg-[var(--surface-interactive)] ${toneStyles[category.tone]}`}
    aria-label={`Selecionar classificação ${category.label}, ${total} pacientes`}
  >
    <div className="flex items-center justify-between gap-3">
      <span className="font-semibold">{category.label}</span>
      <span className="text-xl" aria-hidden="true">›</span>
    </div>
    <div>
      <p className="text-3xl font-semibold text-[var(--text-primary)]">
        {total} <span className="text-sm font-normal text-[var(--text-secondary)]">{total === 1 ? 'paciente' : 'pacientes'}</span>
      </p>
      <p className="mt-3 text-sm leading-5 text-[var(--text-muted)]">{category.helper}</p>
    </div>
  </button>
)

const EmptyState = () => (
  <div className="app-card px-6 py-10 text-center text-sm text-[var(--text-muted)]">
    Nenhum paciente nesta seleção.
  </div>
)

const riskIconStyles = {
  moderado: 'bg-[var(--success)]',
  alto: 'bg-[var(--warning)]',
  clinico: 'bg-[var(--danger)]',
  absenteismo_recente: 'bg-[#9a3412]',
  absenteismo_cronico: 'bg-[#0e1b33]',
}

const riskTextStyles = {
  moderado: 'text-[var(--success)]',
  alto: 'text-[var(--warning)]',
  clinico: 'text-[var(--danger)]',
  absenteismo_recente: 'text-[#9a3412]',
  absenteismo_cronico: 'text-[#0e1b33]',
}

const riskShortLabels = {
  moderado: 'Risco Moderado',
  alto: 'Risco Alto',
  clinico: 'Risco Clínico',
  absenteismo_recente: 'Absenteísmo Recente',
  absenteismo_cronico: 'Absenteísmo Crônico',
}

const riskBadgeStyles = {
  moderado: 'bg-green-100 text-green-800',
  alto: 'bg-yellow-100 text-yellow-800',
  clinico: 'bg-red-100 text-red-800',
  absenteismo_recente: 'bg-orange-200 text-orange-900',
  absenteismo_cronico: 'bg-gray-900 text-white',
}

const riskPanelStyles = {
  moderado: 'border-[rgba(6,154,88,0.24)] bg-[rgba(6,154,88,0.08)] text-[var(--success)]',
  alto: 'border-[rgba(240,132,0,0.28)] bg-[rgba(240,132,0,0.1)] text-[var(--warning)]',
  clinico: 'border-[rgba(224,47,53,0.3)] bg-[rgba(224,47,53,0.1)] text-[var(--danger)]',
  absenteismo_recente: 'border-[rgba(180,83,9,0.34)] bg-[rgba(180,83,9,0.14)] text-[#9a3412]',
  absenteismo_cronico: 'border-[#0e1b33] bg-[#0e1b33] text-white',
}

const riskClassificationSummaries = [
  {
    id: 'moderado',
    label: 'Risco Moderado',
    description: 'Atraso só no quadrimestre atual; paciente estava em dia no ciclo anterior.',
  },
  {
    id: 'alto',
    label: 'Risco Alto',
    description: 'Atraso há 1 quadrimestre com pendência procedimental de baixo risco imediato, como peso/altura.',
  },
  {
    id: 'clinico',
    label: 'Risco Clínico',
    description: 'Atraso há 1 quadrimestre com pendência crítica: C4 consulta/pé diabético ou C5 consulta/pressão.',
  },
  {
    id: 'absenteismo_recente',
    label: 'Absenteísmo Recente',
    description: 'Zerado há 1 quadrimestre; todas as variáveis aparecem como NÃO*.',
  },
  {
    id: 'absenteismo_cronico',
    label: 'Absenteísmo Crônico',
    description: 'Inativo há mais de 8 meses, com perda total de vínculo ou variável sem registro prolongado.',
  },
]

const currentQuarterStatusClass = 'border-[rgba(6,154,88,0.24)] bg-[rgba(6,154,88,0.08)] text-[var(--success)]'

const getCurrentQuarterStatusLabel = (status = 'Em andamento') => status.replace(' (Verde)', '')

const RiskHistoryIcon = ({ patient, selectedIndicator }) => {
  const delayHistory = getPatientDelayHistory(patient, selectedIndicator)
  const label = patient.detalhesHistorico?.classificacao || riskShortLabels[delayHistory.status] || delayHistory.text

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${riskBadgeStyles[delayHistory.status] || riskBadgeStyles.moderado}`}
      title={delayHistory.text}
      aria-label={delayHistory.text}
    >
      {label}
    </span>
  )
}

const CurrentQuarterStatus = ({ patient }) => (
  <div className="min-w-44">
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${currentQuarterStatusClass}`}>
      {getCurrentQuarterStatusLabel(patient.statusQuadrimestreAtual)}
    </span>
  </div>
)

const RiskClassificationGuide = () => (
  <details className="app-card group p-5">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[var(--primary-dark)]">Classificação</p>
        <h2 id="patient-risk-guide-title" className="mt-1 text-lg font-semibold text-[var(--text-primary)]">Critérios resumidos de risco temporal</h2>
      </div>
      <span className="btn-secondary inline-flex min-h-9 items-center px-3 py-1 text-sm font-semibold">
        <span className="group-open:hidden">Mostrar</span>
        <span className="hidden group-open:inline">Ocultar</span>
      </span>
    </summary>
    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
      {riskClassificationSummaries.map((item) => (
        <article key={item.id} className={`rounded-xl border p-4 ${riskPanelStyles[item.id]}`}>
          <h3 className="text-sm font-semibold">{item.label}</h3>
          <p className="mt-2 text-xs leading-5 opacity-90">{item.description}</p>
        </article>
      ))}
    </div>
  </details>
)

const getDelayHistoryDetails = (patient, selectedIndicator) => {
  const delayHistory = getPatientDelayHistory(patient, selectedIndicator)
  const details = patient.detalhesHistorico || {}

  return {
    status: delayHistory.status,
    label: details.classificacao ? `${details.classificacao}${delayHistory.status === 'clinico' ? ' - Vermelho' : delayHistory.status === 'alto' ? ' - Amarelo' : ''}` : delayHistory.text,
    quadrimestreAtraso: details.quadrimestreAtraso || 'Quadrimestre atual',
    diasAtraso: details.diasAtraso ?? 0,
    procedimentoPendente: details.procedimentoPendente || patient.clinicalPendencies[0] || 'Pendência não especificada',
    inteligencia: details.inteligencia || 'Meta atual em andamento; histórico usado para priorização do acompanhamento.',
  }
}

const VariableStatusBadge = ({ variable }) => (
  <span className={`rounded-full border px-2 py-0.5 text-[0.68rem] font-semibold ${
    variable.pendente
      ? 'border-[rgba(224,47,53,0.24)] bg-[rgba(224,47,53,0.08)] text-[var(--danger)]'
      : 'border-[rgba(6,154,88,0.22)] bg-[rgba(6,154,88,0.08)] text-[var(--success)]'
  }`}>
    {variable.status}
  </span>
)

const IndicatorVariablesPanel = ({ variables, emptyText, riskStatus }) => {
  if (!variables.length) {
    return (
      <div className="rounded-xl border border-[rgba(6,154,88,0.22)] bg-[rgba(6,154,88,0.08)] p-4 text-sm font-semibold text-[var(--success)]">
        {emptyText}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {variables.map((variable) => (
        <div key={`${variable.codigo}-${variable.descricao}`} className={`rounded-xl border p-3 ${riskPanelStyles[riskStatus] || riskPanelStyles.moderado}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{variable.codigo}: {variable.descricao}</p>
            </div>
            <VariableStatusBadge variable={variable} />
          </div>
        </div>
      ))}
    </div>
  )
}

const getAvailableDetailIndicators = (patient, selectedIndicator) => {
  const available = ['C4', 'C5'].filter((indicator) => patient.variaveisIndicador[indicator])

  if (selectedIndicator !== 'all' && available.includes(selectedIndicator)) return [selectedIndicator]
  return available
}

const hasAuditHistoryPendency = (patient) => (
  patient.previousPendingItems?.some((item) => item.pendente)
)

const getAuditHistoryQuarter = (patient) => {
  const quarter = patient.detalhesHistorico?.quadrimestreAtraso?.match(/Q[1-3]-\d{4}/)?.[0]

  if (['Q1-2025', 'Q2-2025', 'Q1-2026', 'Q2-2026'].includes(quarter)) return quarter
  if (quarter?.endsWith('2025')) return 'Q2-2025'
  return 'Q1-2026'
}

const AuditEligibilityAction = ({ patient, selectedIndicator, onOpenAuditHistory, compact = false }) => {
  if (!hasAuditHistoryPendency(patient)) return null

  const delayHistory = getPatientDelayHistory(patient, selectedIndicator)
  const label = patient.detalhesHistorico?.classificacao || riskShortLabels[delayHistory.status] || delayHistory.text
  const explanation = `Paciente elegível para histórico de auditoria porque possui pendência fechada em quadrimestre anterior: ${label}.`

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${compact ? '' : 'rounded-xl border border-[var(--border)] bg-[#f7faff] p-3'}`}
      title={explanation}
    >
      <button
        type="button"
        onClick={() => onOpenAuditHistory?.({
          quarter: getAuditHistoryQuarter(patient),
          patientName: patient.name,
        })}
        className="btn-primary inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold"
      >
        Ir para Histórico de Auditoria
        <Icons.ChevronRight />
      </button>
      {!compact && (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${riskBadgeStyles[delayHistory.status] || riskBadgeStyles.moderado}`}>
          {label}
        </span>
      )}
      {!compact && (
        <p className="basis-full text-xs leading-5 text-[var(--text-secondary)]">
          {explanation}
        </p>
      )}
    </div>
  )
}

const PatientDetailDrawer = ({ patient, classification, selectedIndicator, onClose, onOpenAuditHistory, triggerRef }) => {
  const closeButtonRef = useRef(null)
  const availableDetailIndicators = getAvailableDetailIndicators(patient, selectedIndicator)
  const [detailIndicator, setDetailIndicator] = useState(availableDetailIndicators[0] || 'C4')
  const displayedConditions = patient.condition.filter((condition) => selectedIndicator === 'all' || condition.startsWith(selectedIndicator))
  const delayHistory = getDelayHistoryDetails(patient, selectedIndicator)
  const delayHistoryTextClass = riskTextStyles[delayHistory.status] || riskTextStyles.moderado
  const activeVariables = patient.variaveisIndicador[detailIndicator]?.atual || []

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

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(14,27,51,0.36)]" onMouseDown={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="patient-detail-title"
        className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-[-20px_0_44px_rgba(25,55,95,0.18)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary-dark)]">Detalhamento do acompanhamento</p>
            <h2 id="patient-detail-title" className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">{patient.name}</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{patient.ubs} · {patient.dataPeriod}</p>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} className="btn-secondary h-10 px-3 text-sm font-semibold" aria-label="Fechar detalhamento">
            Fechar
          </button>
        </div>

        <section className="mt-6 rounded-xl border border-[rgba(22,103,232,0.22)] bg-[rgba(22,103,232,0.06)] p-4">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Identificação protegida</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">CPF {patient.cpf}</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">CNS {patient.cns}</p>
        </section>

        <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            ['Equipe', patient.ubs],
            ['Classificação', classification.label],
            ['Condição acompanhada', displayedConditions.join(' + ')],
            ['Status do quadrimestre atual', getCurrentQuarterStatusLabel(patient.statusQuadrimestreAtual)],
            ['Origem dos dados', patient.dataOrigin],
            ['Período dos dados', patient.dataPeriod],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-[var(--border-subtle)] bg-[#f7faff] p-3">
              <dt className="text-xs font-medium text-[var(--text-muted)]">{label}</dt>
              <dd className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{value}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-5 rounded-xl border border-[var(--border)] p-4">
          <div className="flex items-start gap-3">
            <span className={`mt-1 h-3.5 w-3.5 shrink-0 rounded-full ${riskIconStyles[delayHistory.status] || riskIconStyles.moderado}`} aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Detalhes Temporais Clínicos</h3>
              <p className={`mt-2 text-base font-semibold ${delayHistoryTextClass}`}>{delayHistory.label}</p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                Atrasado desde o {delayHistory.quadrimestreAtraso} (aprox. {delayHistory.diasAtraso} dias) — Procedimento pendente: {delayHistory.procedimentoPendente}.
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{delayHistory.inteligencia}</p>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-xl border border-[var(--border)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Quadrimestre atual do indicador</h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Resumo atual por variável recebida do relatório: A, B, C, D, E e F.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {availableDetailIndicators.length > 1 && (
                <label className="sr-only" htmlFor="patient-detail-indicator">Indicador</label>
              )}
              {availableDetailIndicators.length > 1 && (
                <select
                  id="patient-detail-indicator"
                  value={detailIndicator}
                  onChange={(event) => setDetailIndicator(event.target.value)}
                  className="form-control px-3 py-2 text-xs font-semibold outline-none"
                  aria-label="Selecionar indicador das pendências"
                >
                  {availableDetailIndicators.map((indicator) => (
                    <option key={indicator} value={indicator}>{indicator}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="mt-4">
            <IndicatorVariablesPanel
              variables={activeVariables}
              emptyText="Nenhuma pendência atual informada para este indicador."
              riskStatus={delayHistory.status}
            />
          </div>
        </section>

        <div className="mt-5">
          <AuditEligibilityAction
            patient={patient}
            selectedIndicator={selectedIndicator}
            onOpenAuditHistory={(context) => {
              onClose()
              onOpenAuditHistory?.(context)
            }}
          />
        </div>

      </aside>
    </div>
  )
}

export const PacientesView = ({ initialClassification = null, onOpenAuditHistory }) => {
  const [selectedIndicator, setSelectedIndicator] = useState('all')
  const [teamQuery, setTeamQuery] = useState('')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [selectedClassification, setSelectedClassification] = useState(initialClassification)
  const [patientQuery, setPatientQuery] = useState('')
  const [filterColumn, setFilterColumn] = useState('all')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const detailTriggerRef = useRef(null)

  const indicatorPatients = useMemo(() => (
    PATIENT_MODULE_DATA.filter((patient) => hasSelectedIndicator(patient, selectedIndicator))
  ), [selectedIndicator])
  const teams = useMemo(() => getTeams(indicatorPatients), [indicatorPatients])
  const filteredTeams = useMemo(() => {
    const normalizedQuery = teamQuery.trim().toLowerCase()

    if (!normalizedQuery) return teams

    return teams.filter((team) => (
      team.name.toLowerCase().includes(normalizedQuery) || team.ine.includes(normalizedQuery)
    ))
  }, [teamQuery, teams])

  const teamPatients = useMemo(() => (
    selectedTeam ? indicatorPatients.filter((patient) => patient.teamId === selectedTeam.id) : indicatorPatients
  ), [indicatorPatients, selectedTeam])

  const listedPatients = useMemo(() => {
    const normalizedQuery = patientQuery.trim().toLowerCase()
    const classificationPatients = teamPatients.filter((patient) => patient.classification === selectedClassification)

    if (!normalizedQuery) return classificationPatients

    return classificationPatients.filter((patient) => (
      getPatientSearchValue(patient, filterColumn, selectedIndicator).toLowerCase().includes(normalizedQuery)
    ))
  }, [filterColumn, patientQuery, selectedClassification, selectedIndicator, teamPatients])

  const currentStep = getStep(selectedTeam, selectedClassification)
  const currentClassification = PATIENT_CLASSIFICATIONS.find((classification) => classification.id === selectedClassification)

  const handleSelectTeam = (team) => {
    setSelectedTeam(team)
    setSelectedClassification(null)
    setPatientQuery('')
  }

  const handleBackToTeams = () => {
    setSelectedTeam(null)
    setSelectedClassification(null)
    setPatientQuery('')
    setSelectedPatient(null)
  }

  const handleBackToClassifications = () => {
    setSelectedClassification(null)
    setPatientQuery('')
    setSelectedPatient(null)
  }

  const handleOpenPatient = (patient, event) => {
    detailTriggerRef.current = event.currentTarget
    setSelectedPatient(patient)
  }

  const handleSelectIndicator = (indicator) => {
    setSelectedIndicator(indicator)
    setSelectedTeam(null)
    setSelectedClassification(null)
    setPatientQuery('')
    setTeamQuery('')
    setSelectedPatient(null)
  }

  return (
    <PageShell currentStep={currentStep}>
      <RiskClassificationGuide />

      {!selectedTeam && !selectedClassification && (
        <section className="space-y-4">
          <div className="app-card p-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[16rem_1fr]">
              <IndicatorSelect value={selectedIndicator} onChange={handleSelectIndicator} />
              <label className="block" htmlFor="patient-team-search">
                <span className="text-sm font-semibold text-[var(--text-secondary)]">Buscar equipe ou INE</span>
                <div className="form-shell mt-2 flex items-center px-3 py-2">
                  <span className="mr-2 text-[var(--text-muted)]"><Icons.Search /></span>
                  <input
                    id="patient-team-search"
                    type="search"
                    value={teamQuery}
                    onChange={(event) => setTeamQuery(event.target.value)}
                    placeholder="Digite o nome da equipe ou o INE"
                    className="app-input w-full border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none"
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredTeams.map((team) => (
              <TeamCard key={team.id} team={team} onSelect={handleSelectTeam} />
            ))}
          </div>
        </section>
      )}

      {selectedTeam && !selectedClassification && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">Equipe selecionada</p>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{selectedTeam.name}</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">INE {selectedTeam.ine}</p>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <IndicatorSelect value={selectedIndicator} onChange={handleSelectIndicator} compact />
              <button type="button" onClick={handleBackToTeams} className="btn-secondary px-4 py-2 text-sm font-semibold">
                Voltar para equipes
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {PATIENT_CLASSIFICATIONS.map((category) => {
              const total = teamPatients.filter((patient) => patient.classification === category.id).length

              return (
                <ClassificationCard
                  key={category.id}
                  category={category}
                  total={total}
                  onSelect={setSelectedClassification}
                />
              )
            })}
          </div>
        </section>
      )}

      {selectedClassification && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">
                {selectedTeam ? `${selectedTeam.name} · INE ${selectedTeam.ine}` : 'Todas as equipes'}
              </p>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{currentClassification.label}</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {selectedTeam ? 'Pacientes da equipe com esta classificação de acompanhamento.' : 'Pacientes com esta classificação de acompanhamento.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedTeam && (
                <button type="button" onClick={handleBackToClassifications} className="btn-secondary px-4 py-2 text-sm font-semibold">
                  Classificações
                </button>
              )}
              <button type="button" onClick={handleBackToTeams} className="btn-secondary px-4 py-2 text-sm font-semibold">
                Equipes
              </button>
            </div>
          </div>

          <div className="app-card p-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[16rem_12rem_1fr]">
              <IndicatorSelect value={selectedIndicator} onChange={handleSelectIndicator} />
              <label className="block" htmlFor="patient-filter-column">
                <span className="text-sm font-semibold text-[var(--text-secondary)]">Buscar em</span>
                <select
                  id="patient-filter-column"
                  value={filterColumn}
                  onChange={(event) => setFilterColumn(event.target.value)}
                  className="form-control mt-2 w-full px-3 py-2 text-sm outline-none"
                >
                  {filterColumns.map((column) => (
                    <option key={column.id} value={column.id}>{column.label}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-[var(--text-secondary)]">Buscar paciente</span>
                <span className="form-shell mt-2 flex items-center px-3 py-2">
                  <span className="mr-2 text-[var(--text-muted)]"><Icons.Search /></span>
                  <span className="sr-only">Buscar na lista de pacientes</span>
                  <input
                    type="search"
                    value={patientQuery}
                    onChange={(event) => setPatientQuery(event.target.value)}
                    placeholder="Buscar na lista de pacientes"
                    className="app-input w-full border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none"
                  />
                </span>
              </label>
            </div>
          </div>

          {listedPatients.length ? (
            <div className="app-card overflow-x-auto">
              <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] px-5 py-4">
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Pacientes encontrados</h3>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">{listedPatients.length} {listedPatients.length === 1 ? 'registro demonstrativo' : 'registros demonstrativos'}</p>
                </div>
                <p className="text-xs font-medium text-[var(--text-muted)]">Identificadores parcialmente ocultos</p>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    {['Paciente', 'CPF', 'Indicador', 'Status do Quadrimestre Atual', 'Histórico de Atraso', 'Detalhes'].map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {listedPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="whitespace-nowrap">{patient.name}</td>
                      <td className="whitespace-nowrap">{patient.cpf}</td>
                      <td>
                        <span className="rounded-full border border-[rgba(22,103,232,0.2)] bg-[rgba(22,103,232,0.08)] px-2.5 py-1 text-xs font-semibold text-[var(--primary-dark)]">
                          {patient.indicador}
                        </span>
                      </td>
                      <td><CurrentQuarterStatus patient={patient} /></td>
                      <td>
                        <RiskHistoryIcon patient={patient} selectedIndicator={selectedIndicator} />
                      </td>
                      <td>
                        <div className="flex min-w-72 flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={(event) => handleOpenPatient(patient, event)}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary-dark)] hover:underline"
                            aria-label={`Detalhar acompanhamento de ${patient.name}`}
                          >
                            Detalhar
                            <Icons.Eye />
                          </button>
                          <AuditEligibilityAction
                            patient={patient}
                            selectedIndicator={selectedIndicator}
                            onOpenAuditHistory={onOpenAuditHistory}
                            compact
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState />
          )}
        </section>
      )}

      {selectedPatient && (
        <PatientDetailDrawer
          patient={selectedPatient}
          classification={currentClassification}
          selectedIndicator={selectedIndicator}
          onClose={() => setSelectedPatient(null)}
          onOpenAuditHistory={onOpenAuditHistory}
          triggerRef={detailTriggerRef}
        />
      )}
    </PageShell>
  )
}
