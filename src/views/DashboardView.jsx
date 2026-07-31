import { useEffect, useMemo } from 'react'
import { Icons } from '../components/ui/Icons'
import { ProgressBar } from '../components/ui/ProgressBar'
import { getDashboardQuadrimesters, getDashboardSituation } from '../services/dashboardService'
import { formatDateTime, formatNumber, formatPercentagePoints, formatPercent } from '../utils/formatters'
import { getDashboardTotals, getFilteredTeams, getTopTeams, RANKING_METRICS } from '../utils/dashboardAggregations'

const toneClasses = {
  info: 'border-[rgba(22,103,232,0.2)] bg-[rgba(22,103,232,0.08)] text-[var(--primary-dark)]',
  success: 'border-[rgba(6,154,88,0.22)] bg-[rgba(6,154,88,0.08)] text-[var(--success)]',
  warning: 'border-[rgba(240,132,0,0.24)] bg-[rgba(240,132,0,0.09)] text-[var(--warning)]',
  danger: 'border-[rgba(224,47,53,0.22)] bg-[rgba(224,47,53,0.08)] text-[var(--danger)]',
  alert: 'border-[rgba(229,109,34,0.24)] bg-[rgba(229,109,34,0.09)] text-[var(--alert)]',
}

const DASHBOARD_STATE_DEFAULTS = {
  quadrimester: null,
  selectedIndicatorId: 'c2',
  activeMetric: 'acompanhamentoParcial',
  teamQuery: '',
  quickFilter: 'all',
  refreshStamp: null,
  refreshStatus: 'idle',
  refreshMessage: '',
  isRankingExpanded: false,
  detailTeamId: null,
}

const QUICK_FILTERS = [
  { id: 'all', label: 'Todas', match: () => true },
  { id: 'critical', label: 'Críticas', match: (team) => team.situacao.toLowerCase() === 'cuidado programado fragilizado' },
  { id: 'almostRegularized', label: 'Quase regularizadas', match: (team) => team.quaseRegularizados > 0 },
  { id: 'withoutFollowUp', label: 'Absenteísmo', match: (team) => team.zerados > 0 },
]

const EXPLANATIONS = [
  {
    term: 'Acompanhamento parcial',
    description: 'Paciente com parte do cuidado registrado, mas ainda com pendências para fechar o acompanhamento do indicador.',
  },
  {
    term: 'Paciente zerado',
    description: 'Paciente sem registro válido para o indicador acompanhado no período analisado.',
  },
  {
    term: 'Quase regularizado',
    description: 'Paciente com poucas pendências restantes e maior chance de regularização no quadrimestre.',
  },
  {
    term: 'Absenteísmo',
    description: 'Pacientes sem acompanhamento efetivo, exigindo busca ativa ou reagendamento pela equipe.',
  },
]

const getRefreshTimeLabel = () => new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' }).format(new Date())

const isNumericValue = (value) => typeof value === 'number' && Number.isFinite(value)

const SummaryCard = ({ icon, label, value, helper, action, footerAction, tone = 'info', onClick }) => {
  const content = (
    <>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${toneClasses[tone]}`}>
          {icon}
        </div>
        {action && <span className="text-xs font-semibold text-[var(--primary-dark)]">{action}</span>}
      </div>
      <p className="text-lg font-semibold leading-6 text-[var(--text-primary)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold leading-none text-[var(--text-primary)]">{value}</p>
      {helper && <p className="mt-3 text-sm leading-5 text-[var(--text-muted)]">{helper}</p>}
      {footerAction && <p className="mt-4 text-sm font-semibold text-[var(--primary-dark)]">{footerAction}</p>}
    </>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="app-card p-5 text-left transition hover:border-[rgba(22,103,232,0.34)] hover:bg-[var(--surface-interactive)]">
        {content}
      </button>
    )
  }

  return <article className="app-card p-5">{content}</article>
}

const getIndicatorTone = (result, target) => {
  if (result >= target) return 'success'
  if (result >= target * 0.8) return 'warning'
  return 'danger'
}

const RankingTabs = ({ activeMetric, onChangeMetric }) => (
  <div className="flex flex-wrap gap-2" role="tablist" aria-label="Indicadores do ranking de equipes">
    {Object.entries(RANKING_METRICS).map(([metric, config]) => (
      <button
        key={metric}
        type="button"
        role="tab"
        aria-selected={activeMetric === metric}
        onClick={() => onChangeMetric(metric)}
        className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
          activeMetric === metric
            ? 'border-[rgba(22,103,232,0.26)] bg-[rgba(22,103,232,0.1)] text-[var(--primary-dark)]'
            : 'border-[var(--border)] bg-white text-[var(--text-secondary)] hover:bg-[var(--surface-interactive)]'
        }`}
      >
        {config.label}
      </button>
    ))}
  </div>
)

const RankingList = ({ teams, metric, activeMetric, onSelectMetric, isExpanded, onToggleExpanded, onDetailTeam }) => {
  const config = RANKING_METRICS[metric]
  const maxValue = Math.max(...teams.map((team) => team[metric]), 1)

  return (
    <section className="app-card p-5 lg:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Principais resultados por equipe</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{config.description}</p>
        </div>
        <RankingTabs activeMetric={activeMetric} onChangeMetric={onSelectMetric} />
      </div>

      <div className="mt-5 space-y-4">
        {teams.map((team, index) => (
          <article key={team.id} className="grid grid-cols-[2rem_minmax(8.5rem,12rem)_minmax(18rem,1fr)_auto] items-center gap-3 text-sm">
            <span className="text-right font-semibold text-[var(--text-muted)]">{index + 1}</span>
            <span className="truncate font-semibold text-[var(--text-primary)]">{team.name}</span>
            <div className="h-2.5 rounded-full bg-[#edf2f8]">
              <div className={`h-2.5 rounded-full ${config.barClass}`} style={{ width: `${(team[metric] / maxValue) * 100}%` }} />
            </div>
            <div className="flex min-w-32 items-center justify-end gap-3">
              <span className="font-semibold text-[var(--text-primary)]">{formatNumber(team[metric])} pac.</span>
              <button type="button" onClick={() => onDetailTeam(team)} className="text-xs font-semibold text-[var(--primary-dark)] hover:underline">
                Detalhar
              </button>
            </div>
          </article>
        ))}
      </div>
      <button type="button" onClick={onToggleExpanded} className="btn-secondary mt-5 px-4 py-2 text-sm font-semibold">
        {isExpanded ? 'Ver apenas principais equipes' : 'Ver ranking completo'}
      </button>
    </section>
  )
}

const QuickFilters = ({ activeFilter, onChangeFilter }) => (
  <div className="flex flex-wrap gap-2" aria-label="Filtros rápidos">
    {QUICK_FILTERS.map((filter) => (
      <button
        key={filter.id}
        type="button"
        onClick={() => onChangeFilter(filter.id)}
        className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
          activeFilter === filter.id
            ? 'border-[rgba(22,103,232,0.26)] bg-[rgba(22,103,232,0.1)] text-[var(--primary-dark)]'
            : 'border-[var(--border)] bg-white text-[var(--text-secondary)] hover:bg-[var(--surface-interactive)]'
        }`}
      >
        {filter.label}
      </button>
    ))}
  </div>
)

const AppliedFiltersSummary = ({ quadrimesterLabel, indicatorLabel, detailTeamName }) => {
  const items = [
    ['Quadrimestre', quadrimesterLabel],
    ['Indicador', indicatorLabel],
  ]

  if (detailTeamName) items.push(['Equipe', detailTeamName])

  return (
    <section className="app-card px-4 py-4 text-sm lg:px-5" aria-label="Resumo dos filtros aplicados">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 font-semibold text-[var(--text-primary)]">Filtros aplicados:</span>
        {items.map(([label, value]) => (
          <span key={label} className="soft-pill inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold">
            <span className="text-[var(--text-secondary)]">{label}:</span>
            <span>{value}</span>
          </span>
        ))}
      </div>
    </section>
  )
}

const ExplanationPanel = () => (
  <section className="app-card p-5" aria-labelledby="dashboard-explanations-title">
    <h2 id="dashboard-explanations-title" className="text-base font-semibold text-[var(--text-primary)]">Explicações dos termos</h2>
    <dl className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {EXPLANATIONS.map((item) => (
        <div key={item.term} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4">
          <dt className="font-semibold text-[var(--primary-dark)]">{item.term}</dt>
          <dd className="mt-2 text-sm leading-5 text-[var(--text-secondary)]">{item.description}</dd>
        </div>
      ))}
    </dl>
  </section>
)

const DataStateBadge = ({ tone, children }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses[tone]}`}>
    {children}
  </span>
)

const PatientCountCell = ({ value, hasLoadingFailure }) => {
  if (hasLoadingFailure) {
    return (
      <div className="space-y-2">
        <DataStateBadge tone="danger">Falha de carregamento</DataStateBadge>
        <p className="text-xs text-[var(--text-muted)]">Não foi possível confirmar a quantidade.</p>
      </div>
    )
  }

  if (!isNumericValue(value)) {
    return <DataStateBadge tone="alert">Dados indisponíveis</DataStateBadge>
  }

  if (value === 0) {
    return <DataStateBadge tone="info">Zero pacientes</DataStateBadge>
  }

  return (
    <span>{formatNumber(value)} pacientes</span>
  )
}

const DetailDrawer = ({ team, indicator, quadrimesterLabel, lastUpdated, onClose, onOpenPatients }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!team) return null

  const rows = [
    ['Equipe', team.name],
    ['Indicador', indicator.label],
    ['Quadrimestre', quadrimesterLabel],
    ['Resultado', `${team[indicator.id]}%`],
    ['Quantidade de pacientes', `${formatNumber(team.quantidadePacientes)} pacientes`],
    ['Pendências', team.principaisPendencias],
    ['Última atualização', lastUpdated],
  ]

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-[rgba(14,27,51,0.28)]" role="dialog" aria-modal="true" aria-labelledby="dashboard-detail-title">
      <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-[var(--border)] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--primary-dark)]">Detalhamento da equipe</p>
            <h2 id="dashboard-detail-title" className="mt-2 text-xl font-semibold text-[var(--text-primary)]">{team.name}</h2>
          </div>
          <button type="button" onClick={onClose} className="btn-secondary px-4 py-2 text-sm font-semibold">
            Fechar
          </button>
        </div>

        <dl className="mt-6 divide-y divide-[var(--border-subtle)] rounded-xl border border-[var(--border)]">
          {rows.map(([label, value]) => (
            <div key={label} className="grid gap-1 px-4 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
              <dt className="text-sm font-semibold text-[var(--text-secondary)]">{label}</dt>
              <dd className="text-sm text-[var(--text-primary)]">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
          <h3 className="font-semibold text-[var(--text-primary)]">Ações relacionadas</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => onOpenPatients('parcial')} className="btn-secondary px-4 py-2 text-sm font-semibold">
              Ver acompanhamento parcial
            </button>
            <button type="button" onClick={() => onOpenPatients('absenteismo')} className="btn-secondary px-4 py-2 text-sm font-semibold">
              Ver Absenteísmo
            </button>
            <button type="button" onClick={() => onOpenPatients('quase_regularizado')} className="btn-secondary px-4 py-2 text-sm font-semibold">
              Ver quase regularizados
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}

export const DashboardView = ({ onOpenC1, onOpenPatients, dashboardState, onDashboardStateChange }) => {
  const quadrimesters = useMemo(() => getDashboardQuadrimesters(), [])
  const dashboard = useMemo(() => getDashboardSituation(), [])
  const selectableIndicators = useMemo(() => dashboard.indicators.filter((indicator) => indicator.id !== 'c1'), [dashboard.indicators])
  const totals = useMemo(() => getDashboardTotals(dashboard.teams, dashboard.situationConfig), [dashboard.situationConfig, dashboard.teams])
  const state = {
    ...DASHBOARD_STATE_DEFAULTS,
    quadrimester: quadrimesters[0].id,
    ...dashboardState,
  }
  const {
    quadrimester,
    selectedIndicatorId,
    activeMetric,
    teamQuery,
    quickFilter,
    refreshStamp,
    refreshStatus,
    refreshMessage,
    isRankingExpanded,
    detailTeamId,
  } = state

  const updateDashboardState = (nextState) => {
    onDashboardStateChange((currentState = {}) => {
      const baseState = {
        ...DASHBOARD_STATE_DEFAULTS,
        quadrimester: quadrimesters[0].id,
        ...currentState,
      }

      if (typeof nextState === 'function') return nextState(baseState)

      return {
        ...baseState,
        ...nextState,
      }
    })
  }

  const selectedIndicator = useMemo(
    () => selectableIndicators.find((indicator) => indicator.id === selectedIndicatorId) || selectableIndicators[0],
    [selectableIndicators, selectedIndicatorId],
  )
  const selectedQuadrimester = useMemo(
    () => quadrimesters.find((item) => item.id === quadrimester) || quadrimesters[0],
    [quadrimester, quadrimesters],
  )
  const selectedQuickFilter = useMemo(
    () => QUICK_FILTERS.find((filter) => filter.id === quickFilter) || QUICK_FILTERS[0],
    [quickFilter],
  )
  const filteredTeams = useMemo(() => {
    const searchFilteredTeams = getFilteredTeams(dashboard.teams, teamQuery)

    return searchFilteredTeams.filter((team) => selectedQuickFilter.match(team))
  }, [dashboard.teams, selectedQuickFilter, teamQuery])
  const rankingTeams = useMemo(() => getTopTeams(dashboard.teams, activeMetric, isRankingExpanded ? dashboard.teams.length : 6), [activeMetric, dashboard.teams, isRankingExpanded])
  const detailTeam = useMemo(
    () => dashboard.teams.find((team) => team.id === detailTeamId) || null,
    [dashboard.teams, detailTeamId],
  )
  const lastUpdated = refreshStamp || formatDateTime(dashboard.context.lastUpdated)

  const handleRefresh = () => {
    if (refreshStatus === 'loading') return

    updateDashboardState({
      refreshStatus: 'loading',
      refreshMessage: '',
    })

    window.setTimeout(() => {
      try {
        const updateTime = getRefreshTimeLabel()

        updateDashboardState({
          refreshStatus: 'success',
          refreshStamp: `hoje, às ${updateTime}`,
          refreshMessage: `Painel atualizado às ${updateTime}.`,
        })
      } catch {
        updateDashboardState({
          refreshStatus: 'error',
          refreshMessage: 'Não foi possível atualizar o painel. Verifique a conexão e tente novamente.',
        })
      }
    }, 600)
  }

  const handleSelectIndicator = (indicatorId) => {
    updateDashboardState({ selectedIndicatorId: indicatorId })
  }

  const handleSelectMetric = (metric) => {
    updateDashboardState({
      activeMetric: metric,
      isRankingExpanded: false,
    })
  }

  const handleDetailTeam = (team) => {
    updateDashboardState({ detailTeamId: team.id })
  }

  const handleClearFilters = () => {
    updateDashboardState({
      quadrimester: quadrimesters[0].id,
      selectedIndicatorId: DASHBOARD_STATE_DEFAULTS.selectedIndicatorId,
      activeMetric: DASHBOARD_STATE_DEFAULTS.activeMetric,
      teamQuery: '',
      quickFilter: DASHBOARD_STATE_DEFAULTS.quickFilter,
      isRankingExpanded: false,
      detailTeamId: null,
    })
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--primary-dark)]">Sala de Situação / Gestão municipal</p>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">Visão geral da Atenção Primária</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="dashboard-quadrimester">Quadrimestre</label>
          <select
            id="dashboard-quadrimester"
            value={quadrimester}
            onChange={(event) => updateDashboardState({ quadrimester: event.target.value })}
            className="form-control px-3 py-2 text-sm outline-none"
          >
            {quadrimesters.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="dashboard-indicator">Indicador</label>
          <select
            id="dashboard-indicator"
            value={selectedIndicatorId}
            onChange={(event) => handleSelectIndicator(event.target.value)}
            className="form-control px-3 py-2 text-sm outline-none"
          >
            {selectableIndicators.map((indicator) => (
              <option key={indicator.id} value={indicator.id}>{indicator.label}</option>
            ))}
          </select>
          <button type="button" onClick={handleClearFilters} className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold">
            Limpar filtros
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshStatus === 'loading'}
            className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Icons.Activity />
            {refreshStatus === 'loading' ? 'Atualizando...' : 'Atualizar painel'}
          </button>
        </div>
      </header>

      {refreshMessage && (
        <section
          className={`app-card flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm ${
            refreshStatus === 'error' ? 'border-[rgba(224,47,53,0.22)] bg-[rgba(224,47,53,0.08)]' : 'border-[rgba(6,154,88,0.22)] bg-[rgba(6,154,88,0.08)]'
          }`}
          role={refreshStatus === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          <span className={refreshStatus === 'error' ? 'font-semibold text-[var(--danger)]' : 'font-semibold text-[var(--success)]'}>
            {refreshMessage}
          </span>
          {refreshStatus === 'error' && (
            <button type="button" onClick={handleRefresh} className="btn-secondary px-4 py-2 text-sm font-semibold">
              Tentar novamente
            </button>
          )}
        </section>
      )}

      <AppliedFiltersSummary
        quadrimesterLabel={selectedQuadrimester.label}
        indicatorLabel={selectedIndicator.label}
        detailTeamName={detailTeam?.name || ''}
      />

      <section className="app-card flex flex-col gap-4 px-4 py-4 text-sm lg:flex-row lg:items-center lg:justify-between lg:px-5" aria-label="Contexto dos dados">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-2 font-semibold text-[var(--text-primary)]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(6,154,88,0.12)]" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--success)]" />
            </span>
            {dashboard.context.status}
          </span>
          <span className="text-sm text-[var(--text-secondary)]">Atualizados {lastUpdated}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-[var(--border)] pt-3 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <span className="text-sm text-[var(--text-secondary)]">
            <strong className="mr-1 text-base text-[var(--text-primary)]">{formatNumber(totals.teamsCount)}</strong>
            equipes analisadas
          </span>
          <span className="text-sm text-[var(--text-secondary)]">
            <strong className="mr-1 text-base text-[var(--text-primary)]">{formatNumber(totals.prioritizedPatients)}</strong>
            {dashboard.context.prioritizedLabel}
          </span>
          <span className="text-sm text-[var(--text-secondary)]">
            <strong className="mr-1 text-base text-[var(--text-primary)]">{dashboard.context.daysUntilClose} dias</strong>
            até o fechamento
          </span>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Resumo municipal">
        <SummaryCard
          icon={<Icons.Calculator />}
          label={`${selectedIndicator.shortLabel} municipal - resultado preliminar`}
          value={`${formatPercent(selectedIndicator.result)} - ${selectedIndicator.classification}`}
          helper={(
            <>
              <span className="block font-medium text-[var(--success)]">↑ {formatPercentagePoints(selectedIndicator.evolution).replace('+', '')} em relação ao quadrimestre anterior</span>
            </>
          )}
          footerAction={selectedIndicator.id === 'c1' ? 'Ver cálculo e resultados por equipe' : null}
          tone={getIndicatorTone(selectedIndicator.result, selectedIndicator.target)}
          onClick={selectedIndicator.id === 'c1' ? onOpenC1 : undefined}
        />
        <SummaryCard
          icon={<Icons.Alert />}
          label="Acompanhamento Parcial"
          value={`${formatNumber(totals.acompanhamentoParcial)} pacientes`}
          footerAction="Ver pacientes"
          tone="warning"
          onClick={() => onOpenPatients('parcial')}
        />
        <SummaryCard
          icon={<Icons.Alert />}
          label="Absenteísmo"
          value={`${formatNumber(totals.zerados)} pacientes`}
          footerAction="Ver pacientes"
          tone="danger"
          onClick={() => onOpenPatients('absenteismo')}
        />
        <SummaryCard
          icon={<Icons.CheckCircle />}
          label="Quase Regularizados"
          value={`${formatNumber(totals.quaseRegularizados)} pacientes`}
          footerAction="Ver pacientes"
          tone="success"
          onClick={() => onOpenPatients('quase_regularizado')}
        />
      </section>

      <ExplanationPanel />

      <div>
        <RankingList
          teams={rankingTeams}
          metric={activeMetric}
          activeMetric={activeMetric}
          onSelectMetric={handleSelectMetric}
          isExpanded={isRankingExpanded}
          onToggleExpanded={() => updateDashboardState((currentState) => ({ ...currentState, isRankingExpanded: !currentState.isRankingExpanded }))}
          onDetailTeam={handleDetailTeam}
        />
      </div>

      <section className="app-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Situação por equipe</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{formatNumber(filteredTeams.length)} de {formatNumber(dashboard.teams.length)} equipes exibidas</p>
          </div>
          <QuickFilters activeFilter={quickFilter} onChangeFilter={(filterId) => updateDashboardState({ quickFilter: filterId })} />
          <label className="min-w-0 flex-1 md:max-w-xs">
            <span className="sr-only">Pesquisar equipe</span>
            <div className="form-shell flex items-center px-3 py-2">
              <span className="mr-2 text-[var(--text-muted)]"><Icons.Search /></span>
              <input
                type="search"
                value={teamQuery}
                onChange={(event) => updateDashboardState({ teamQuery: event.target.value })}
                placeholder="Pesquisar equipe"
                className="app-input w-full border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none"
              />
            </div>
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                {['Equipe', `Resultado ${selectedIndicator.shortLabel}`, 'Quase regularizados', 'Principais Pendências', 'Quantidade de Pacientes', 'Ação'].map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team) => (
                <tr key={team.id}>
                  <td className="whitespace-nowrap">{team.name}</td>
                  <td className="min-w-36">
                    {isNumericValue(team[selectedIndicator.id]) ? (
                      <div className="flex items-center gap-3">
                        <span className="w-10 font-semibold text-[var(--text-primary)]">{team[selectedIndicator.id]}%</span>
                        <div className="w-24">
                          <ProgressBar percent={team[selectedIndicator.id]} />
                        </div>
                      </div>
                    ) : (
                      <DataStateBadge tone="alert">Dados indisponíveis</DataStateBadge>
                    )}
                  </td>
                  <td>{formatNumber(team.quaseRegularizados)} pacientes</td>
                  <td className="min-w-60">
                    <div className="font-medium text-[var(--text-primary)]">{team.principaisPendencias}</div>
                  </td>
                  <td>
                    <PatientCountCell value={team.quantidadePacientes} hasLoadingFailure={refreshStatus === 'error'} />
                  </td>
                  <td>
                    <button type="button" onClick={() => handleDetailTeam(team)} className="text-sm font-semibold text-[var(--primary-dark)] hover:underline">
                      Detalhar
                    </button>
                  </td>
                </tr>
              ))}
              {!filteredTeams.length && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-sm text-[var(--text-muted)]">
                    <div className="flex flex-col items-center gap-3">
                      <span>Nenhuma equipe encontrada para a pesquisa informada.</span>
                      {teamQuery.trim() && (
                        <button type="button" onClick={() => updateDashboardState({ teamQuery: '' })} className="btn-secondary px-4 py-2 text-sm font-semibold">
                          Limpar pesquisa
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {detailTeam && (
        <DetailDrawer
          team={detailTeam}
          indicator={selectedIndicator}
          quadrimesterLabel={selectedQuadrimester.label}
          lastUpdated={lastUpdated}
          onClose={() => updateDashboardState({ detailTeamId: null })}
          onOpenPatients={onOpenPatients}
        />
      )}
    </div>
  )
}
