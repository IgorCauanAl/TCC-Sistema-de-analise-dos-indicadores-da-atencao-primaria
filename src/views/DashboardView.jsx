import { useMemo, useState } from 'react'
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

export const DashboardView = ({ onOpenC1, onOpenPatients }) => {
  const quadrimesters = useMemo(() => getDashboardQuadrimesters(), [])
  const dashboard = useMemo(() => getDashboardSituation(), [])
  const selectableIndicators = useMemo(() => dashboard.indicators.filter((indicator) => indicator.id !== 'c1'), [dashboard.indicators])
  const totals = useMemo(() => getDashboardTotals(dashboard.teams, dashboard.situationConfig), [dashboard.situationConfig, dashboard.teams])
  const [quadrimester, setQuadrimester] = useState(quadrimesters[0].id)
  const [selectedIndicatorId, setSelectedIndicatorId] = useState('c2')
  const [activeMetric, setActiveMetric] = useState('acompanhamentoParcial')
  const [teamQuery, setTeamQuery] = useState('')
  const [refreshStamp, setRefreshStamp] = useState(null)
  const [isRankingExpanded, setIsRankingExpanded] = useState(false)

  const selectedIndicator = useMemo(
    () => selectableIndicators.find((indicator) => indicator.id === selectedIndicatorId) || selectableIndicators[0],
    [selectableIndicators, selectedIndicatorId],
  )
  const filteredTeams = useMemo(() => getFilteredTeams(dashboard.teams, teamQuery), [dashboard.teams, teamQuery])
  const rankingTeams = useMemo(() => getTopTeams(dashboard.teams, activeMetric, isRankingExpanded ? dashboard.teams.length : 6), [activeMetric, dashboard.teams, isRankingExpanded])
  const lastUpdated = refreshStamp || formatDateTime(dashboard.context.lastUpdated)

  const handleRefresh = () => {
    setRefreshStamp(`hoje, às ${new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' }).format(new Date())}`)
  }

  const handleSelectIndicator = (indicatorId) => {
    setSelectedIndicatorId(indicatorId)
  }

  const handleSelectMetric = (metric) => {
    setActiveMetric(metric)
    setIsRankingExpanded(false)
  }

  const handleDetailTeam = (team) => {
    setTeamQuery(team.name)
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
            onChange={(event) => setQuadrimester(event.target.value)}
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
          <button type="button" onClick={handleRefresh} className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold">
            <Icons.Activity />
            Atualizar painel
          </button>
        </div>
      </header>

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

      <div>
        <RankingList
          teams={rankingTeams}
          metric={activeMetric}
          activeMetric={activeMetric}
          onSelectMetric={handleSelectMetric}
          isExpanded={isRankingExpanded}
          onToggleExpanded={() => setIsRankingExpanded((value) => !value)}
          onDetailTeam={handleDetailTeam}
        />
      </div>

      <section className="app-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Situação por equipe</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{formatNumber(filteredTeams.length)} de {formatNumber(dashboard.teams.length)} equipes exibidas</p>
          </div>
          <label className="min-w-0 flex-1 md:max-w-xs">
            <span className="sr-only">Pesquisar equipe</span>
            <div className="form-shell flex items-center px-3 py-2">
              <span className="mr-2 text-[var(--text-muted)]"><Icons.Search /></span>
              <input
                type="search"
                value={teamQuery}
                onChange={(event) => setTeamQuery(event.target.value)}
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
                    <div className="flex items-center gap-3">
                      <span className="w-10 font-semibold text-[var(--text-primary)]">{team[selectedIndicator.id]}%</span>
                      <div className="w-24">
                        <ProgressBar percent={team[selectedIndicator.id]} />
                      </div>
                    </div>
                  </td>
                  <td>{formatNumber(team.quaseRegularizados)} pacientes</td>
                  <td className="min-w-60">
                    <div className="font-medium text-[var(--text-primary)]">{team.principaisPendencias}</div>
                  </td>
                  <td>{formatNumber(team.quantidadePacientes)} pacientes</td>
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
                    Nenhuma equipe encontrada para a pesquisa informada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
