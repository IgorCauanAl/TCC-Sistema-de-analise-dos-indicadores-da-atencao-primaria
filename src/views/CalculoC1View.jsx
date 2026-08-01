import { useEffect, useMemo, useRef, useState } from 'react'
import { Icons } from '../components/ui/Icons'
import { ProgressBar } from '../components/ui/ProgressBar'
import { getEvolution, getMunicipalSummary, getTeamResult, getTotalConsidered } from '../utils/c1Calculations'
import { formatDateTime, formatDetailedPercent, formatNumber, formatPercentagePoints, formatPercent } from '../utils/formatters'
import { getC1Dataset, getC1Quadrimesters, getC1Situations } from '../services/c1Service'

const toneStyles = {
  success: 'border-[rgba(6,154,88,0.22)] bg-[rgba(6,154,88,0.08)] text-[var(--success)]',
  warning: 'border-[rgba(240,132,0,0.24)] bg-[rgba(240,132,0,0.09)] text-[var(--warning)]',
  danger: 'border-[rgba(224,47,53,0.22)] bg-[rgba(224,47,53,0.08)] text-[var(--danger)]',
  info: 'border-[rgba(22,103,232,0.2)] bg-[rgba(22,103,232,0.08)] text-[var(--primary-dark)]',
}

const monthOptions = [
  { id: '01', label: 'Janeiro' },
  { id: '02', label: 'Fevereiro' },
  { id: '03', label: 'Março' },
  { id: '04', label: 'Abril' },
  { id: '05', label: 'Maio' },
  { id: '06', label: 'Junho' },
  { id: '07', label: 'Julho' },
  { id: '08', label: 'Agosto' },
  { id: '09', label: 'Setembro' },
  { id: '10', label: 'Outubro' },
  { id: '11', label: 'Novembro' },
  { id: '12', label: 'Dezembro' },
]

const evolutionTone = (value) => {
  if (value > 0) return 'text-[var(--success)]'
  if (value < 0) return 'text-[var(--danger)]'
  return 'text-[var(--text-muted)]'
}

const SummaryCard = ({ icon, label, value, helper, comparison, tone = 'info' }) => (
  <article className="app-card p-5">
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${toneStyles[tone]}`}>
        {icon}
      </div>
      {comparison && (
        <span className={`text-xs font-semibold ${evolutionTone(comparison.value)}`}>
          {formatPercentagePoints(comparison.value)}
        </span>
      )}
    </div>
    <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
    <p className="mt-2 text-3xl font-semibold leading-none text-[var(--text-primary)]">{value}</p>
    <p className="mt-3 text-sm leading-5 text-[var(--text-muted)]">{helper}</p>
  </article>
)

const SituationBadge = ({ situation }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${toneStyles[situation.tone]}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
    {situation.label}
  </span>
)

const DetailItem = ({ label, value }) => (
  <div className="rounded-xl border border-[var(--border-subtle)] bg-[#f7faff] p-3">
    <dt className="text-xs font-medium text-[var(--text-muted)]">{label}</dt>
    <dd className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{value}</dd>
  </div>
)

const CalculationDrawer = ({ team, quadrimester, monthLabel, situation, onClose, triggerRef }) => {
  const closeButtonRef = useRef(null)
  const currentResult = getTeamResult(team)
  const totalConsidered = getTotalConsidered(team)
  const evolution = getEvolution(currentResult, team.previousResult)

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

  const handleExport = () => {
    const rows = [
      `Equipe: ${team.name}`,
      `Quadrimestre: ${quadrimester.label}`,
      `Mes de competencia: ${monthLabel}`,
      `Resultado atual: ${formatDetailedPercent(currentResult)}`,
      `Resultado anterior: ${formatDetailedPercent(team.previousResult)}`,
      `Evolucao: ${formatPercentagePoints(evolution)}`,
      `Demanda programada: ${formatNumber(team.programmedDemand)}`,
      `Demanda espontanea: ${formatNumber(team.spontaneousDemand)}`,
      `Total considerado: ${formatNumber(totalConsidered)}`,
      `Formula: ${formatNumber(team.programmedDemand)} / ${formatNumber(totalConsidered)} x 100 = ${formatDetailedPercent(currentResult)}`,
      `Registros recebidos: ${formatNumber(team.receivedRecords)}`,
      `Registros considerados: ${formatNumber(team.consideredRecords)}`,
      `Registros desconsiderados: ${formatNumber(team.excludedRecords)}`,
      `Fonte dos dados: ${quadrimester.dataSource}`,
      `Versao da regra: ${quadrimester.methodologyVersion}`,
      `Processamento: ${formatDateTime(quadrimester.processingDate)}`,
    ]
    const blob = new Blob([rows.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `memoria-c1-${team.id}-${quadrimester.id}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(14,27,51,0.36)]" onMouseDown={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="c1-calculation-title"
        className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-[-20px_0_44px_rgba(25,55,95,0.18)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[var(--text-muted)]">Memória de cálculo</p>
            <h2 id="c1-calculation-title" className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">{team.name}</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{quadrimester.label} · {monthLabel}</p>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} className="btn-secondary h-10 px-3 text-sm font-semibold">
            Fechar
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailItem label="Resultado atual" value={formatDetailedPercent(currentResult)} />
          <DetailItem label="Mês de competência" value={monthLabel} />
          <DetailItem label="Resultado anterior" value={formatDetailedPercent(team.previousResult)} />
          <DetailItem label="Evolução" value={formatPercentagePoints(evolution)} />
          <DetailItem label="Situação" value={situation.label} />
          <DetailItem label="Demanda programada" value={formatNumber(team.programmedDemand)} />
          <DetailItem label="Demanda espontânea" value={formatNumber(team.spontaneousDemand)} />
          <DetailItem label="Total considerado" value={formatNumber(totalConsidered)} />
          <DetailItem label="Registros recebidos" value={formatNumber(team.receivedRecords)} />
          <DetailItem label="Registros considerados" value={formatNumber(team.consideredRecords)} />
          <DetailItem label="Registros desconsiderados" value={formatNumber(team.excludedRecords)} />
        </div>

        <section className="mt-6 rounded-xl border border-[var(--border)] bg-[#f7faff] p-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Fórmula substituída</h3>
          <p className="mt-3 rounded-lg bg-white p-3 text-sm font-semibold text-[var(--primary-dark)]">
            {formatNumber(team.programmedDemand)} ÷ {formatNumber(totalConsidered)} × 100 = {formatDetailedPercent(currentResult)}
          </p>
        </section>

        <section className="mt-6 rounded-xl border border-[var(--border)] p-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Motivos das exclusões</h3>
          <ul className="mt-3 space-y-2">
            {team.exclusionReasons.map((item) => (
              <li key={item.reason} className="flex items-center justify-between gap-4 text-sm text-[var(--text-secondary)]">
                <span>{item.reason}</span>
                <span className="font-semibold text-[var(--text-primary)]">{formatNumber(item.total)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 grid gap-3 text-sm text-[var(--text-secondary)]">
          <p><span className="font-semibold text-[var(--text-primary)]">Fonte dos dados:</span> {quadrimester.dataSource}</p>
          <p><span className="font-semibold text-[var(--text-primary)]">Versão da regra:</span> {quadrimester.methodologyVersion}</p>
          <p><span className="font-semibold text-[var(--text-primary)]">Processamento:</span> {formatDateTime(quadrimester.processingDate)}</p>
        </section>

        <button type="button" onClick={handleExport} className="btn-primary mt-6 w-full px-4 py-2 text-sm font-semibold">
          Exportar memória de cálculo
        </button>
      </aside>
    </div>
  )
}

export const CalculoC1View = () => {
  const quadrimesters = useMemo(() => getC1Quadrimesters(), [])
  const situations = useMemo(() => getC1Situations(), [])
  const selectedQuadrimester = quadrimesters[0].id
  const [selectedMonth, setSelectedMonth] = useState('07')
  const [teamQuery, setTeamQuery] = useState('')
  const [sortDirection, setSortDirection] = useState('desc')
  const [isFormulaOpen, setIsFormulaOpen] = useState(true)
  const [selectedTeamId, setSelectedTeamId] = useState(null)
  const [refreshStamp, setRefreshStamp] = useState(null)
  const detailTriggerRef = useRef(null)

  const dataset = useMemo(() => getC1Dataset(selectedQuadrimester), [selectedQuadrimester])
  const selectedYear = selectedQuadrimester.split('-')[0]
  const selectedMonthLabel = `${monthOptions.find((month) => month.id === selectedMonth)?.label || 'Julho'} de ${selectedYear}`
  const summary = useMemo(() => getMunicipalSummary(dataset.teams, situations), [dataset.teams, situations])

  const teams = useMemo(() => (
    dataset.teams.map((team) => ({
      ...team,
      result: getTeamResult(team),
      totalConsidered: getTotalConsidered(team),
      evolution: getEvolution(getTeamResult(team), team.previousResult),
    }))
  ), [dataset.teams])

  const visibleTeams = useMemo(() => {
    const normalizedQuery = teamQuery.trim().toLowerCase()

    return teams
      .filter((team) => !normalizedQuery || team.name.toLowerCase().includes(normalizedQuery))
      .sort((a, b) => (sortDirection === 'asc' ? a.result - b.result : b.result - a.result))
  }, [sortDirection, teamQuery, teams])

  const selectedTeam = useMemo(() => (
    teams.find((team) => team.id === selectedTeamId) || null
  ), [selectedTeamId, teams])

  const lastProcessingInfo = refreshStamp ? `Atualizado nesta sessão em ${refreshStamp}` : `Último processamento em ${formatDateTime(dataset.processingDate)}`
  const municipalFormulaExample = `${formatNumber(summary.programmedDemand)} ÷ ${formatNumber(summary.totalConsidered)} × 100 = ${formatPercent(summary.currentResult)}`

  const handleRefresh = () => {
    setRefreshStamp(new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' }).format(new Date()))
  }

  const handleOpenDetail = (teamId, event) => {
    detailTriggerRef.current = event.currentTarget
    setSelectedTeamId(teamId)
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--primary-dark)]">Indicadores APS / Componente C1</p>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">Cálculo C1 — Mais Acesso à APS</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Acompanhamento da demanda programada e espontânea por equipe</p>
          <p className="mt-2 text-xs font-medium text-[var(--text-muted)]">{lastProcessingInfo}</p>
        </div>
        <button type="button" onClick={handleRefresh} className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold">
          <Icons.Activity />
          Atualizar cálculo
        </button>
      </header>

      <section className="app-card p-5" aria-label="Filtros do C1">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[14rem_1fr_auto]">
          <label className="block">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Mês de competência</span>
            <select
              value={selectedMonth}
              onChange={(event) => {
                setSelectedMonth(event.target.value)
                setSelectedTeamId(null)
              }}
              className="form-control mt-2 w-full px-3 py-2 text-sm outline-none"
              aria-label="Selecionar mês de competência do C1"
            >
              {monthOptions.map((month) => (
                <option key={month.id} value={month.id}>{month.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Pesquisar equipe</span>
            <div className="form-shell mt-2 flex items-center px-3 py-2">
              <span className="mr-2 text-[var(--text-muted)]"><Icons.Search /></span>
              <input
                type="search"
                value={teamQuery}
                onChange={(event) => setTeamQuery(event.target.value)}
                placeholder="Digite o nome da equipe"
                className="app-input w-full border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none"
                aria-label="Pesquisar equipe"
              />
            </div>
          </label>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[#f7faff] px-4 py-3 text-sm">
            <p className="font-semibold text-[var(--text-primary)]">Processamento</p>
            <p className="mt-1 text-[var(--text-secondary)]">{formatDateTime(dataset.processingDate)}</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Competência: {selectedMonthLabel}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Resumo municipal do C1">
        <SummaryCard
          icon={<Icons.Calculator />}
          label="C1 municipal"
          value={formatPercent(summary.currentResult)}
          helper={`${formatNumber(summary.totalConsidered)} atendimentos considerados`}
          comparison={{ value: summary.evolution }}
          tone={dataset.dataQuality.complete ? 'info' : 'warning'}
        />
        <SummaryCard
          icon={<Icons.Calendar />}
          label="Demanda programada"
          value={formatNumber(summary.programmedDemand)}
          helper="Numerador utilizado no cálculo"
          tone="success"
        />
        <SummaryCard
          icon={<Icons.Activity />}
          label="Demanda espontânea"
          value={formatNumber(summary.spontaneousDemand)}
          helper="Atendimentos somados ao denominador"
          tone="info"
        />
        <SummaryCard
          icon={<Icons.Alert />}
          label="Equipes para acompanhar"
          value={formatNumber(summary.teamsToMonitor)}
          helper="Conforme situações configuradas para o período"
          tone={summary.teamsToMonitor ? 'warning' : 'success'}
        />
      </section>

      <section className="app-card overflow-hidden">
        <button
          type="button"
          onClick={() => setIsFormulaOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
          aria-expanded={isFormulaOpen}
        >
          <span className="text-base font-semibold text-[var(--text-primary)]">Como o C1 foi calculado?</span>
          <span className="text-sm font-semibold text-[var(--primary-dark)]">{isFormulaOpen ? 'Recolher' : 'Expandir'}</span>
        </button>
        {isFormulaOpen && (
          <div className="border-t border-[var(--border-subtle)] p-5">
            <p className="rounded-xl bg-[#f7faff] p-4 text-sm font-semibold text-[var(--primary-dark)]">
              C1 = Demanda programada ÷ (Demanda programada + Demanda espontânea) × 100
            </p>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">{municipalFormulaExample}</p>
            <dl className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
              <DetailItem label="Período considerado" value={selectedMonthLabel} />
              <DetailItem label="Fonte dos dados" value={dataset.dataSource} />
              <DetailItem label="Versão da metodologia" value={dataset.methodologyVersion} />
              <DetailItem label="Processamento" value={formatDateTime(dataset.processingDate)} />
            </dl>
          </div>
        )}
      </section>

      <section className="app-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Resultados por equipe</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Percentual calculado a partir das demandas agregadas por equipe</p>
          </div>
          <button
            type="button"
            onClick={() => setSortDirection((value) => (value === 'asc' ? 'desc' : 'asc'))}
            className="btn-secondary px-4 py-2 text-sm font-semibold"
            aria-label="Alternar ordenação pelo resultado C1"
          >
            Ordenar: {sortDirection === 'asc' ? 'menor para maior' : 'maior para menor'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                {['Equipe', 'Demanda programada', 'Demanda espontânea', 'Total considerado', 'Resultado C1', 'Evolução', 'Situação', 'Ação'].map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleTeams.map((team) => {
                const situation = situations[team.situationKey]

                return (
                  <tr key={team.id}>
                    <td className="whitespace-nowrap">
                      <div>{team.name}</div>
                      <div className="mt-1 text-xs font-normal text-[var(--text-muted)]">INE {team.ine}</div>
                    </td>
                    <td>{formatNumber(team.programmedDemand)}</td>
                    <td>{formatNumber(team.spontaneousDemand)}</td>
                    <td>{formatNumber(team.totalConsidered)}</td>
                    <td className="min-w-36">
                      <div className="flex items-center gap-3">
                        <span className="w-14 font-semibold text-[var(--text-primary)]">{formatPercent(team.result)}</span>
                        <div className="w-24">
                          <ProgressBar percent={Math.min(team.result, 100)} />
                        </div>
                      </div>
                    </td>
                    <td className={`font-semibold ${evolutionTone(team.evolution)}`}>{formatPercentagePoints(team.evolution)}</td>
                    <td><SituationBadge situation={situation} /></td>
                    <td>
                      <button
                        type="button"
                        onClick={(event) => handleOpenDetail(team.id, event)}
                        className="text-sm font-semibold text-[var(--primary-dark)] hover:underline"
                      >
                        Ver cálculo
                      </button>
                    </td>
                  </tr>
                )
              })}
              {!visibleTeams.length && (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-sm text-[var(--text-muted)]">
                    Nenhuma equipe encontrada para o filtro informado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedTeam && (
        <CalculationDrawer
          team={selectedTeam}
          quadrimester={dataset}
          monthLabel={selectedMonthLabel}
          situation={situations[selectedTeam.situationKey]}
          onClose={() => setSelectedTeamId(null)}
          triggerRef={detailTriggerRef}
        />
      )}
    </div>
  )
}
