import { useEffect, useMemo, useRef, useState } from 'react'
import { PatientCarePendingSection } from '../components/pacientes/PatientCarePendingSection'
import { Icons } from '../components/ui/Icons'
import { getDelayHistoryStatus } from '../utils/temporalStatus'
import { getAcsDisplayName } from '../utils/acsLabels'
import { OPPORTUNITY_RECORDS } from '../data/opportunityWindowData'

const delayHistoryRank = {
  absenteismo_cronico: 0,
  absenteismo_recente: 1,
  clinico: 2,
  alto: 3,
  moderado: 4,
}

const pluralize = (count, singular, plural = `${singular}s`) => `${count} ${count === 1 ? singular : plural}`
const quarterDeadline = '2026-08-31'

const pendingConfig = {
  Consulta: { type: 'consulta', label: 'Registrar consulta' },
  'Aferição de pressão arterial': { type: 'pressao', label: 'Aferir pressão' },
  'Visita domiciliar': { type: 'visita', label: 'Registrar 1 visita', requiredAmount: 1 },
  'Peso e altura': { type: 'peso_altura', label: 'Registrar peso e altura' },
  'Hemoglobina glicada': { type: 'hemoglobina', label: 'Solicitar ou avaliar hemoglobina glicada' },
  'Avaliação do pé diabético': { type: 'pes', label: 'Realizar avaliação dos pés' },
}

const getDeadlineStatus = (daysRemaining) => {
  if (daysRemaining <= 0) return 'OVERDUE'
  if (daysRemaining <= 10) return 'CRITICAL'
  if (daysRemaining <= 30) return 'ATTENTION'
  return 'PENDING'
}

const normalizeOpportunityPendencies = (items, indicator, deadlineDays) => items.map((item, index) => {
  const config = pendingConfig[item] || { type: 'indisponivel', label: 'Dados não encontrados no relatório' }

  return {
    id: `${indicator}-${config.type}-${index}`,
    indicator,
    type: config.type,
    label: config.label,
    requiredAmount: config.requiredAmount,
    deadline: quarterDeadline,
    daysRemaining: deadlineDays,
    status: getDeadlineStatus(deadlineDays),
  }
})

const getOpportunityPendingItems = (record) => [
  ...record.c4Pending.map((name) => ({ indicator: 'C4', name })),
  ...record.c5Pending.map((name) => ({ indicator: 'C5', name })),
]

const getOpportunityDelayHistoryRecord = (record) => (
  {
    ...record,
    previousPendingItems: record.noRecentFollowUp
      ? [{ label: 'Acompanhamento pendente', quarter: '1º quadrimestre de 2026' }]
      : [],
  }
)

const getOpportunityDelayHistory = (record) => (
  getDelayHistoryStatus(getOpportunityDelayHistoryRecord(record), { pendingItems: getOpportunityPendingItems(record) })
)

const getTeams = () => {
  const teams = new Map()

  OPPORTUNITY_RECORDS.forEach((record) => {
    if (!teams.has(record.ine)) {
      teams.set(record.ine, {
        id: record.ine,
        name: record.team,
        ine: record.ine,
        eligible: 0,
        immediate: 0,
        minDeadline: record.deadlineDays,
      })
    }

    const team = teams.get(record.ine)
    team.eligible += 1
    if (['clinico', 'absenteismo_cronico'].includes(getOpportunityDelayHistory(record).status)) team.immediate += 1
    team.minDeadline = Math.min(team.minDeadline, record.deadlineDays)
  })

  return [...teams.values()]
}

const getSearchValue = (record) => [
  record.patientInitials,
  record.cpf,
  record.team,
  record.ine,
  ...record.c4Pending,
  ...record.c5Pending,
  record.recommendedAction,
].join(' ')

const sortOpportunities = (records) => [...records].sort((first, second) => {
  const firstStatus = getOpportunityDelayHistory(first).status
  const secondStatus = getOpportunityDelayHistory(second).status

  return delayHistoryRank[firstStatus] - delayHistoryRank[secondStatus] || first.deadlineDays - second.deadlineDays
})

const ActionChips = ({ items, indicator }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((item) => (
      <span
        key={`${indicator}-${item}`}
        className={`rounded-full border px-3 py-1 text-xs font-medium ${
          indicator === 'C4'
            ? 'border-[rgba(126,87,194,0.18)] bg-[rgba(126,87,194,0.1)] text-[#5f43a8]'
            : 'border-[rgba(53,167,184,0.2)] bg-[rgba(53,167,184,0.1)] text-[#116b7a]'
        }`}
      >
        {indicator}: {item}
      </span>
    ))}
  </div>
)

const OpportunitySkeleton = () => (
  <div className="space-y-4" aria-label="Carregando oportunidades">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="app-card animate-pulse p-5">
          <div className="h-4 w-32 rounded bg-[#e6edf7]" />
          <div className="mt-4 h-8 w-16 rounded bg-[#e6edf7]" />
          <div className="mt-3 h-3 w-40 rounded bg-[#e6edf7]" />
        </div>
      ))}
    </div>
    <div className="app-card h-64 animate-pulse bg-[#f7faff]" />
  </div>
)

const OpportunityEmptyState = ({ title, description, onAction, actionLabel }) => (
  <section className="app-card px-6 py-12 text-center">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(22,103,232,0.18)] bg-[rgba(22,103,232,0.08)] text-[var(--primary)]" aria-hidden="true">
      <Icons.Search />
    </div>
    <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
    <p className="mt-2 text-sm text-[var(--text-muted)]">{description}</p>
    {onAction && (
      <button type="button" onClick={onAction} className="btn-secondary mt-5 px-4 py-2 text-sm font-semibold">
        {actionLabel}
      </button>
    )}
  </section>
)

const OpportunityTeamSelector = ({ teams, selectedTeam, onSelectTeam }) => (
  <section className="space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Selecione o agente comunitário</h2>
      <p className="text-sm text-[var(--text-muted)]">A tabela será exibida após a seleção do ACS e da microárea.</p>
    </div>
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {teams.map((team) => (
        <button
          key={team.id}
          type="button"
          onClick={() => onSelectTeam(team.id)}
          aria-pressed={selectedTeam === team.id}
          className={`app-card p-4 text-left transition hover:border-[rgba(22,103,232,0.34)] hover:bg-[var(--surface-interactive)] ${
            selectedTeam === team.id ? 'border-[var(--primary)] ring-2 ring-[rgba(22,103,232,0.12)]' : ''
          }`}
        >
          <span className="block truncate font-semibold text-[var(--text-primary)]">{getAcsDisplayName(team)}</span>
          <span className="mt-2 block text-xs text-[var(--text-muted)]">{team.name} · INE {team.ine}</span>
        </button>
      ))}
    </div>
  </section>
)

const OpportunityFilters = ({ query, resultCount, hasActiveFilters, onQueryChange, onClearFilters }) => (
  <section className="app-card p-5">
    <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
      <label className="form-shell flex items-center px-3 py-2">
        <span className="mr-2 text-[var(--text-muted)]" aria-hidden="true"><Icons.Search /></span>
        <span className="sr-only">Buscar por iniciais, CPF, equipe ou pendência</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar por iniciais, CPF, equipe ou pendência"
          className="app-input w-full border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none"
        />
      </label>
      {hasActiveFilters && (
        <button type="button" onClick={onClearFilters} className="btn-secondary px-4 py-2 text-sm font-semibold">
          Limpar filtros
        </button>
      )}
    </div>
    <p className="mt-4 text-sm text-[var(--text-muted)]">{pluralize(resultCount, 'resultado exibido', 'resultados exibidos')}</p>
  </section>
)

const OpportunityTable = ({ records, onOpenPlan }) => (
  <div className="app-card overflow-x-auto">
    <table className="data-table hidden min-w-[1180px] md:table">
      <thead>
        <tr>
          {['Paciente', 'Equipe/INE', 'CPF', 'Ações C4', 'Ações C5', 'Plano sugerido', 'Ação'].map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <tr key={record.id}>
            <td className="whitespace-nowrap">{record.patientInitials}</td>
            <td className="whitespace-nowrap">
              <span className="block">{record.team}</span>
              <span className="mt-1 block text-xs font-normal text-[var(--text-muted)]">INE {record.ine}</span>
            </td>
            <td className="whitespace-nowrap">{record.cpf}</td>
            <td className="min-w-56"><ActionChips items={record.c4Pending} indicator="C4" /></td>
            <td className="min-w-56"><ActionChips items={record.c5Pending} indicator="C5" /></td>
            <td className="min-w-72">{record.recommendedAction}</td>
            <td>
              <button
                type="button"
                onClick={(event) => onOpenPlan(record, event)}
                className="text-sm font-semibold text-[var(--primary-dark)] hover:underline"
                aria-label={`Ver plano de ${record.patientInitials}`}
              >
                Ver plano
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="space-y-3 p-4 md:hidden">
      {records.map((record) => (
        <article key={record.id} className="rounded-xl border border-[var(--border-subtle)] bg-[#f7faff] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">{record.patientInitials}</h3>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{record.team} · INE {record.ine}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">CPF {record.cpf}</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <ActionChips items={record.c4Pending} indicator="C4" />
            <ActionChips items={record.c5Pending} indicator="C5" />
          </div>
          <p className="mt-4 text-sm text-[var(--text-secondary)]">{record.recommendedAction}</p>
          <button
            type="button"
            onClick={(event) => onOpenPlan(record, event)}
            className="btn-secondary mt-4 w-full px-4 py-2 text-sm font-semibold"
          >
            Ver plano
          </button>
        </article>
      ))}
    </div>
  </div>
)

const DetailField = ({ label, value }) => (
  <div className="rounded-xl border border-[var(--border-subtle)] bg-[#f7faff] p-3">
    <dt className="text-xs font-medium uppercase text-[var(--text-muted)]">{label}</dt>
    <dd className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{value}</dd>
  </div>
)

const OpportunityDetailsDrawer = ({ record, onClose, triggerRef }) => {
  const closeButtonRef = useRef(null)
  const c4Pendencies = normalizeOpportunityPendencies(record.c4Pending, 'C4', record.deadlineDays)
  const c5Pendencies = normalizeOpportunityPendencies(record.c5Pending, 'C5', record.deadlineDays)
  const delayHistoryRecord = getOpportunityDelayHistoryRecord(record)

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
        aria-labelledby="opportunity-drawer-title"
        className="h-full w-full max-w-3xl overflow-y-auto bg-white p-6 shadow-[-20px_0_44px_rgba(25,55,95,0.18)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary-dark)]">Plano de oportunidade assistencial</p>
            <h2 id="opportunity-drawer-title" className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">{record.patientInitials}</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{record.team} · INE {record.ine}</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)] text-xl font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-interactive)]"
            aria-label="Fechar plano"
          >
            ×
          </button>
        </div>

        <section className="mt-6 rounded-xl border border-[rgba(22,103,232,0.2)] bg-[rgba(22,103,232,0.07)] p-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Dados mínimos para organização da consulta</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            A ação sugerida apoia o planejamento e não representa diagnóstico ou decisão clínica automática.
          </p>
        </section>

        <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailField label="CPF" value={record.cpf} />
          <DetailField label="CNS" value={record.cns} />
        </dl>

        <section className="mt-5 grid grid-cols-1 gap-4">
          <PatientCarePendingSection indicator="C4" pendencies={c4Pendencies} deadline={quarterDeadline} delayHistoryRecord={delayHistoryRecord} />
          <PatientCarePendingSection indicator="C5" pendencies={c5Pendencies} deadline={quarterDeadline} delayHistoryRecord={delayHistoryRecord} />
        </section>

        <section className="mt-5 rounded-xl border border-[var(--border)] p-4">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">Plano combinado para a consulta</h3>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{record.combinedPlan}</p>
          <p className="mt-3 text-sm font-semibold text-[var(--primary-dark)]">{record.recommendedAction}</p>
        </section>

        <div className="mt-6">
          <button type="button" onClick={onClose} className="btn-primary px-4 py-2 text-sm font-semibold">
            Fechar
          </button>
        </div>
      </aside>
    </div>
  )
}

export const JanelaOportunidadeView = () => {
  const [loadState, setLoadState] = useState('loading')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [query, setQuery] = useState('')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const drawerTriggerRef = useRef(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoadState('ready'), 250)
    return () => window.clearTimeout(timer)
  }, [])

  const teams = useMemo(() => getTeams(), [])
  const hasActiveFilters = query.trim()

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const filtered = OPPORTUNITY_RECORDS.filter((record) => {
      const matchesTeam = record.ine === selectedTeam
      const matchesQuery = !normalizedQuery || getSearchValue(record).toLowerCase().includes(normalizedQuery)

      return matchesTeam && matchesQuery
    })

    return sortOpportunities(filtered)
  }, [query, selectedTeam])

  const handleClearFilters = () => {
    setQuery('')
  }

  const handleBackToTeams = () => {
    setSelectedTeam(null)
    setQuery('')
    setSelectedRecord(null)
  }

  const handleOpenPlan = (record, event) => {
    drawerTriggerRef.current = event.currentTarget
    setSelectedRecord(record)
  }

  const handleRetry = () => {
    setLoadState('loading')
    window.setTimeout(() => setLoadState('ready'), 250)
  }

  // A futura API deve fornecer elegibilidade, prioridade e autorização por equipe; o frontend não deve ser a camada definitiva.
  return (
    <div className="max-w-full space-y-6 overflow-x-hidden">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary-dark)]">Coordenação do cuidado · C4 e C5</p>
          <h1 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">Janela de Oportunidade</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
            Pacientes que podem resolver pendências dos indicadores C4 e C5 em uma mesma consulta.
          </p>
        </div>
      </header>

      {loadState === 'loading' && <OpportunitySkeleton />}

      {loadState === 'error' && (
        <OpportunityEmptyState
          title="Erro ao carregar oportunidades"
          description="Não foi possível preparar a análise demonstrativa neste momento."
          onAction={handleRetry}
          actionLabel="Tentar novamente"
        />
      )}

      {loadState === 'ready' && !OPPORTUNITY_RECORDS.length && (
        <OpportunityEmptyState
          title="Nenhuma oportunidade elegível"
          description="Não há pacientes com pendências simultâneas C4 e C5 nos dados importados."
        />
      )}

      {loadState === 'ready' && OPPORTUNITY_RECORDS.length > 0 && (
        <>
          {!selectedTeam && (
            <OpportunityTeamSelector teams={teams} selectedTeam={selectedTeam} onSelectTeam={setSelectedTeam} />
          )}

          {selectedTeam && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[var(--text-muted)]">Agente comunitário selecionado</p>
                  <h2 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">
                    {teams.find((team) => team.id === selectedTeam)?.name}
                  </h2>
                </div>
                <button type="button" onClick={handleBackToTeams} className="btn-secondary px-4 py-2 text-sm font-semibold">
                  Voltar para selecionar equipe
                </button>
              </div>

              <OpportunityFilters
                query={query}
                resultCount={filteredRecords.length}
                hasActiveFilters={Boolean(hasActiveFilters)}
                onQueryChange={setQuery}
                onClearFilters={handleClearFilters}
              />

              {filteredRecords.length ? (
                <OpportunityTable records={filteredRecords} onOpenPlan={handleOpenPlan} />
              ) : (
                <OpportunityEmptyState
                  title="Nenhum resultado para os filtros"
                  description="Revise o termo pesquisado."
                  onAction={handleClearFilters}
                  actionLabel="Limpar filtros"
                />
              )}
            </>
          )}
        </>
      )}

      {selectedRecord && (
        <OpportunityDetailsDrawer
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          triggerRef={drawerTriggerRef}
        />
      )}
    </div>
  )
}
