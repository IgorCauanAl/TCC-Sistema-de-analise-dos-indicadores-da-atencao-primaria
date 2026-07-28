import { useEffect, useMemo, useRef, useState } from 'react'
import { Icons } from '../components/ui/Icons'
import { CLINICAL_AUDIT_FINDINGS } from '../data/clinicalAuditData'

const indicatorOptions = [
  { id: 'all', label: 'Todos os indicadores' },
  { id: 'C4', label: 'C4 Diabetes' },
  { id: 'C5', label: 'C5 Hipertensão' },
]

const classificationOptions = [
  { id: 'all', label: 'Todas as conclusões' },
  { id: 'Acompanhamento incompleto', label: 'Acompanhamento incompleto' },
  { id: 'Sem acompanhamento válido', label: 'Sem acompanhamento válido' },
]

const searchColumnOptions = [
  { id: 'all', label: 'Todas as colunas' },
  { id: 'patient', label: 'Paciente' },
  { id: 'cpf', label: 'CPF' },
  { id: 'team', label: 'Equipe/INE' },
  { id: 'evidence', label: 'Evidência' },
  { id: 'conclusion', label: 'Conclusão' },
]

const classificationStyles = {
  'Sem acompanhamento válido': 'border-[rgba(224,47,53,0.22)] bg-[rgba(224,47,53,0.08)] text-[var(--danger)]',
  'Acompanhamento incompleto': 'border-[rgba(229,109,34,0.24)] bg-[rgba(229,109,34,0.08)] text-[var(--alert)]',
}

const pluralize = (count, singular, plural = `${singular}s`) => `${count} ${count === 1 ? singular : plural}`

const getTeams = () => {
  const teams = new Map()

  CLINICAL_AUDIT_FINDINGS.forEach((finding) => {
    if (!teams.has(finding.ine)) {
      teams.set(finding.ine, {
        id: finding.ine,
        label: finding.team,
        ine: finding.ine,
      })
    }
  })

  return [...teams.values()]
}

const getSearchValue = (finding, column) => {
  const values = {
    patient: finding.patientInitials,
    cpf: finding.cpf,
    team: `${finding.team} ${finding.ine}`,
    evidence: finding.evidence,
    conclusion: `${finding.classification} ${finding.explainableConclusion}`,
    all: [
      finding.patientInitials,
      finding.cpf,
      finding.team,
      finding.ine,
      finding.classification,
      finding.inteligencia,
      finding.acaoRecomendada,
      finding.evidence,
      finding.pendingItems.map((item) => `${item.indicator} ${item.name}`).join(' '),
    ].join(' '),
  }

  return values[column] || values.all
}

const SummaryCard = ({ label, value, description, tone }) => {
  const toneClass = tone === 'danger'
    ? 'bg-[rgba(224,47,53,0.08)] text-[var(--danger)]'
    : tone === 'alert'
      ? 'bg-[rgba(229,109,34,0.08)] text-[var(--alert)]'
      : tone === 'success'
        ? 'bg-[rgba(6,154,88,0.08)] text-[var(--success)]'
        : 'bg-[rgba(22,103,232,0.08)] text-[var(--primary-dark)]'

  return (
    <article className="app-card flex items-center gap-4 p-5">
      <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-lg font-semibold ${toneClass}`} aria-hidden="true">
        <Icons.Activity />
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">{value}</p>
        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{description}</p>
      </div>
    </article>
  )
}

const IndicatorBadge = ({ indicator }) => (
  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
    indicator === 'C4'
      ? 'border-[rgba(126,87,194,0.18)] bg-[rgba(126,87,194,0.1)] text-[#5f43a8]'
      : 'border-[rgba(53,167,184,0.2)] bg-[rgba(53,167,184,0.1)] text-[#116b7a]'
  }`}>
    {indicator === 'C4' ? 'C4 Diabetes' : 'C5 Hipertensão'}
  </span>
)

const ClassificationBadge = ({ classification }) => (
  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${classificationStyles[classification] || classificationStyles['Acompanhamento incompleto']}`}>
    {classification}
  </span>
)

const EmptyState = ({ onClear }) => (
  <section className="app-card px-6 py-12 text-center">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(22,103,232,0.18)] bg-[rgba(22,103,232,0.08)] text-[var(--primary)]" aria-hidden="true">
      <Icons.Search />
    </div>
    <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">Nenhum achado encontrado</h3>
    <p className="mt-2 text-sm text-[var(--text-muted)]">Revise os filtros ou o termo usado na busca.</p>
    <button type="button" onClick={onClear} className="btn-secondary mt-5 px-4 py-2 text-sm font-semibold">
      Limpar filtros
    </button>
  </section>
)

const Filters = ({
  indicatorFilter,
  teamFilter,
  classificationFilter,
  searchColumn,
  query,
  teams,
  resultCount,
  onIndicatorChange,
  onTeamChange,
  onClassificationChange,
  onSearchColumnChange,
  onQueryChange,
}) => (
  <section className="app-card p-5">
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[12rem_1fr_14rem_12rem_1fr]">
      <label className="sr-only" htmlFor="clinical-audit-indicator">Indicador</label>
      <select
        id="clinical-audit-indicator"
        value={indicatorFilter}
        onChange={(event) => onIndicatorChange(event.target.value)}
        className="form-control px-3 py-2 text-sm outline-none"
        aria-label="Filtrar por indicador"
      >
        {indicatorOptions.map((option) => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>

      <label className="sr-only" htmlFor="clinical-audit-team">Equipe</label>
      <select
        id="clinical-audit-team"
        value={teamFilter}
        onChange={(event) => onTeamChange(event.target.value)}
        className="form-control px-3 py-2 text-sm outline-none"
        aria-label="Filtrar por equipe"
      >
        <option value="all">Todas as equipes</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>{team.label} — INE {team.ine}</option>
        ))}
      </select>

      <label className="sr-only" htmlFor="clinical-audit-classification">Conclusão</label>
      <select
        id="clinical-audit-classification"
        value={classificationFilter}
        onChange={(event) => onClassificationChange(event.target.value)}
        className="form-control px-3 py-2 text-sm outline-none"
        aria-label="Filtrar por conclusão da auditoria"
      >
        {classificationOptions.map((option) => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>

      <label className="sr-only" htmlFor="clinical-audit-search-column">Buscar em</label>
      <select
        id="clinical-audit-search-column"
        value={searchColumn}
        onChange={(event) => onSearchColumnChange(event.target.value)}
        className="form-control px-3 py-2 text-sm outline-none"
        aria-label="Selecionar coluna da busca"
      >
        {searchColumnOptions.map((option) => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>

      <label className="form-shell flex items-center px-3 py-2">
        <span className="mr-2 text-[var(--text-muted)]" aria-hidden="true"><Icons.Search /></span>
        <span className="sr-only">Buscar por paciente, equipe, regra ou pendência</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar por paciente, equipe, regra ou pendência"
          className="app-input w-full border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none"
        />
      </label>
    </div>
    <p className="mt-4 text-sm text-[var(--text-muted)]">{pluralize(resultCount, 'resultado encontrado', 'resultados encontrados')}</p>
  </section>
)

const FindingsTable = ({ findings, onOpenFinding }) => (
  <div className="app-card overflow-x-auto">
    <table className="data-table min-w-[1120px]">
      <thead>
        <tr>
          {['Paciente/equipe', 'Indicador', 'Evidência do e-SUS Helper', 'Conclusão da auditoria', 'Ação'].map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {findings.map((finding) => (
          <tr key={finding.id}>
            <td className="whitespace-nowrap">
              <span className="block">{finding.patientInitials}</span>
              <span className="mt-1 block text-xs font-normal text-[var(--text-muted)]">CPF {finding.cpf}</span>
              <span className="mt-2 block text-xs font-normal text-[var(--text-muted)]">{finding.team} · INE {finding.ine}</span>
            </td>
            <td>
              <div className="flex flex-wrap gap-2">
                {finding.indicators.map((indicator) => <IndicatorBadge key={indicator} indicator={indicator} />)}
              </div>
            </td>
            <td className="min-w-80">
              <p className="line-clamp-3 text-sm leading-5 text-[var(--text-secondary)]">{finding.evidence}</p>
            </td>
            <td className="min-w-56">
              <ClassificationBadge classification={finding.classification} />
              <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">{finding.explainableConclusion}</p>
            </td>
            <td>
              <button
                type="button"
                onClick={(event) => onOpenFinding(finding, event)}
                className="text-sm font-semibold text-[var(--primary-dark)] hover:underline"
                aria-label={`Ver análise de ${finding.patientInitials}`}
              >
                Ver análise
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

const AuditIndicatorSymbol = ({ indicator }) => (
  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border text-xs font-semibold ${
    indicator === 'C4'
      ? 'border-[rgba(126,87,194,0.18)] bg-[rgba(126,87,194,0.1)] text-[#5f43a8]'
      : 'border-[rgba(53,167,184,0.2)] bg-[rgba(53,167,184,0.1)] text-[#116b7a]'
  }`}>
    {indicator}
  </span>
)

const EvidenceStatusItem = ({ item, status }) => {
  const isDone = status === 'done'
  const Icon = isDone ? Icons.CheckCircle : Icons.Alert

  return (
    <div className={`rounded-lg border p-3 ${
      isDone
        ? 'border-[rgba(6,154,88,0.22)] bg-[rgba(6,154,88,0.08)]'
        : 'border-[rgba(224,47,53,0.24)] bg-[rgba(224,47,53,0.08)]'
    }`}>
      <div className="flex items-start gap-3">
        <AuditIndicatorSymbol indicator={item.indicator} />
        <div className="min-w-0 flex-1">
          <div className={`flex items-start gap-2 text-sm font-semibold ${isDone ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
            <span className="mt-0.5 shrink-0" aria-hidden="true"><Icon /></span>
            <p>{item.name}</p>
          </div>
          <p className="mt-1 text-xs font-semibold text-[var(--text-secondary)]">
            {isDone ? 'Feito no relatório importado' : 'Pendente no relatório importado'}
          </p>
        </div>
      </div>
    </div>
  )
}

const FindingDrawer = ({ finding, onClose, triggerRef }) => {
  const closeButtonRef = useRef(null)

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
        aria-labelledby="clinical-audit-drawer-title"
        className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-[-20px_0_44px_rgba(25,55,95,0.18)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary-dark)]">Análise explicável do achado</p>
            <h2 id="clinical-audit-drawer-title" className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">{finding.patientInitials}</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{finding.team} · INE {finding.ine}</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)] text-xl font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-interactive)]"
            aria-label="Fechar análise"
          >
            ×
          </button>
        </div>

        <section className="mt-6 rounded-xl border border-[rgba(22,103,232,0.2)] bg-[rgba(22,103,232,0.07)] p-4">
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            Este resultado considera somente o relatório importado do e-SUS Helper. Ele não confirma diretamente o prontuário e não substitui avaliação clínica ou decisão da equipe.
          </p>
        </section>

        <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailField label="CPF" value={finding.cpf} />
          <DetailField label="CNS" value={finding.cns} />
          <DetailField label="Resultado" value={finding.classification} />
        </dl>

        <section className="mt-5 rounded-xl border border-[var(--border)]">
          <div className="border-b border-[var(--border-subtle)] bg-[#f7faff] p-4">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Diagnóstico</h3>
          </div>
          <dl>
            <div className="p-4">
              <dt className="text-xs font-medium uppercase text-[var(--text-muted)]">Conclusão</dt>
              <dd className="mt-2 text-sm leading-6 text-[var(--text-primary)]">{finding.explainableConclusion}</dd>
            </div>
          </dl>
        </section>

        <section className="mt-5 rounded-xl border border-[var(--border)]">
          <div className="border-b border-[var(--border-subtle)] bg-[#f7faff] p-4">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Evidência do e-SUS Helper</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
            {finding.completedItems.map((item) => (
              <EvidenceStatusItem key={item.id} item={item} status="done" />
            ))}
            {finding.pendingItems.map((item) => (
              <EvidenceStatusItem key={item.id} item={item} status="pending" />
            ))}
          </div>
        </section>

        <dl className="mt-5 rounded-xl border border-[var(--border)]">
          {[
            ['Data da auditoria', finding.auditedAt],
            ['Competência', finding.competence],
            ['Fonte', finding.source],
          ].map(([label, value], index) => (
            <div key={label} className={`flex justify-between gap-4 px-4 py-3 ${index ? 'border-t border-[var(--border-subtle)]' : ''}`}>
              <dt className="text-xs text-[var(--text-muted)]">{label}</dt>
              <dd className="text-right text-sm font-semibold text-[var(--text-primary)]">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <button type="button" onClick={onClose} className="btn-primary px-4 py-2 text-sm font-semibold">
            Concluir revisão
          </button>
        </div>
      </aside>
    </div>
  )
}

export const AuditoriaRegistrosClinicosView = () => {
  const [indicatorFilter, setIndicatorFilter] = useState('all')
  const [teamFilter, setTeamFilter] = useState('all')
  const [classificationFilter, setClassificationFilter] = useState('all')
  const [searchColumn, setSearchColumn] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedFinding, setSelectedFinding] = useState(null)
  const [updateFeedback, setUpdateFeedback] = useState('')
  const drawerTriggerRef = useRef(null)

  const teams = useMemo(() => getTeams(), [])

  const filteredFindings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return CLINICAL_AUDIT_FINDINGS.filter((finding) => {
      const matchesIndicator = indicatorFilter === 'all' || finding.indicators.includes(indicatorFilter)
      const matchesTeam = teamFilter === 'all' || finding.ine === teamFilter
      const matchesClassification = classificationFilter === 'all' || finding.classification === classificationFilter
      const matchesSearch = !normalizedQuery || getSearchValue(finding, searchColumn).toLowerCase().includes(normalizedQuery)

      return matchesIndicator && matchesTeam && matchesClassification && matchesSearch
    })
  }, [classificationFilter, indicatorFilter, query, searchColumn, teamFilter])

  const handleClearFilters = () => {
    setIndicatorFilter('all')
    setTeamFilter('all')
    setClassificationFilter('all')
    setSearchColumn('all')
    setQuery('')
  }

  const handleOpenFinding = (finding, event) => {
    drawerTriggerRef.current = event.currentTarget
    setSelectedFinding(finding)
  }

  return (
    <div className="max-w-full space-y-6 overflow-x-hidden">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary-dark)]">Qualidade assistencial / Análise do e-SUS Helper</p>
          <h1 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">Auditoria dos Registros Clínicos</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
            Analisa as pendências individuais de C4 e C5 importadas do e-SUS Helper e explica a classificação aplicada.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <button
            type="button"
            onClick={() => setUpdateFeedback('Auditoria demonstrativa atualizada com os dados importados disponíveis.')}
            className="btn-primary px-4 py-2 text-sm font-semibold"
          >
            Atualizar auditoria
          </button>
          {updateFeedback && <p className="text-xs font-medium text-[var(--success)]" role="status">{updateFeedback}</p>}
        </div>
      </header>

      <Filters
        indicatorFilter={indicatorFilter}
        teamFilter={teamFilter}
        classificationFilter={classificationFilter}
        searchColumn={searchColumn}
        query={query}
        teams={teams}
        resultCount={filteredFindings.length}
        onIndicatorChange={setIndicatorFilter}
        onTeamChange={setTeamFilter}
        onClassificationChange={setClassificationFilter}
        onSearchColumnChange={setSearchColumn}
        onQueryChange={setQuery}
      />

      {filteredFindings.length ? (
        <FindingsTable findings={filteredFindings} onOpenFinding={handleOpenFinding} />
      ) : (
        <EmptyState onClear={handleClearFilters} />
      )}

      {selectedFinding && (
        <FindingDrawer
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
          triggerRef={drawerTriggerRef}
        />
      )}
    </div>
  )
}
