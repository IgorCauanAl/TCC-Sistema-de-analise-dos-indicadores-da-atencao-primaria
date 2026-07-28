import { useEffect, useMemo, useRef, useState } from 'react'
import { Icons } from '../components/ui/Icons'
import {
  AUDIT_HISTORY_RECORDS,
  AUDIT_QUARTERS,
  getAuditClinicalAlert,
  getAuditDelayStatus,
  getQuarterSummary,
} from '../data/historicoAuditoriaData'

const stepLabels = [
  { id: 'quarter', label: 'Quadrimestre' },
  { id: 'table', label: 'Pacientes' },
  { id: 'details', label: 'Detalhes' },
]

const indicatorFilterOptions = [
  { id: 'all', label: 'Todos os indicadores' },
  { id: 'C4', label: 'C4' },
  { id: 'C5', label: 'C5' },
]

const delayHistoryFilterOptions = [
  { id: 'all', label: 'Todos os históricos' },
  { id: 'risco_alto', label: 'Risco Alto' },
  { id: 'risco_clinico', label: 'Risco Clínico' },
  { id: 'absenteismo_recente', label: 'Absenteísmo Recente' },
  { id: 'absenteismo_cronico', label: 'Absenteísmo Crônico' },
]

const searchColumnOptions = [
  { id: 'all', label: 'Todas as colunas' },
  { id: 'paciente', label: 'Nome' },
  { id: 'cpf', label: 'CPF' },
  { id: 'historico', label: 'Histórico de atraso' },
]

const StepIndicator = ({ currentStep }) => {
  const currentIndex = stepLabels.findIndex((step) => step.id === currentStep)

  return (
    <ol className="flex flex-wrap items-center gap-2" aria-label="Etapas do Histórico de Auditoria">
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

const DelayBadge = ({ record }) => {
  const status = getAuditDelayStatus(record)

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
      {status.label}
    </span>
  )
}

const getAuditRecordSearchValue = (record, column) => {
  const status = getAuditDelayStatus(record)
  const values = {
    paciente: record.paciente,
    cpf: record.cpf,
    historico: `${status.label} ${status.explanation}`,
    all: `${record.paciente} ${record.cpf} ${record.indicador} ${status.label} ${status.explanation}`,
  }

  return values[column] || values.all
}

const QuarterCard = ({ quarter, selected, onSelect }) => {
  const summary = getQuarterSummary(quarter.id)

  return (
    <button
      type="button"
      onClick={() => onSelect(quarter.id)}
      className={`app-card min-h-40 p-5 text-left transition hover:border-[rgba(22,103,232,0.34)] hover:bg-[var(--surface-interactive)] ${
        selected ? 'border-[var(--primary)] ring-2 ring-[rgba(22,103,232,0.16)]' : ''
      }`}
      aria-label={`Selecionar ${quarter.title}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary-dark)]">{quarter.label}</p>
          <h3 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{quarter.title}</h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{quarter.period}</p>
        </div>
        <span className="text-xl text-[var(--text-muted)]" aria-hidden="true">›</span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-[rgba(22,103,232,0.08)] px-3 py-1 text-xs font-semibold text-[var(--primary-dark)]">
          {summary.total} pacientes
        </span>
        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
          {summary.critical} críticos
        </span>
      </div>
    </button>
  )
}

const VariableSnapshotCard = ({ variable }) => {
  const pending = variable.status === 'NÃO*'

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[#f7faff] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {variable.codigo}: {variable.procedimento} até {variable.deadline}
          </p>
          <p className="mt-2 text-xs text-[var(--text-muted)]">Data limite do quadrimestre</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${
          pending
            ? 'border-red-200 bg-red-50 text-red-700'
            : 'border-green-200 bg-green-50 text-green-700'
        }`}>
          {variable.status}
        </span>
      </div>
    </div>
  )
}

const DetailModal = ({ record, onClose, triggerRef }) => {
  const closeButtonRef = useRef(null)
  const indicators = Object.keys(record.snapshots)
  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0])
  const status = getAuditDelayStatus(record)
  const variables = record.snapshots[selectedIndicator] || []
  const alertText = getAuditClinicalAlert(record, selectedIndicator)

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(14,27,51,0.42)] p-4" onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-history-detail-title"
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_24px_80px_rgba(14,27,51,0.28)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary-dark)]">Fotografia do quadrimestre</p>
            <h2 id="audit-history-detail-title" className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">{record.paciente}</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{record.equipe} · {record.quarterId} · {record.indicador}</p>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} className="btn-secondary px-4 py-2 text-sm font-semibold">
            Fechar
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[#f7faff] p-4">
            <p className="text-xs font-medium text-[var(--text-muted)]">CPF</p>
            <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{record.cpf}</p>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[#f7faff] p-4">
            <p className="text-xs font-medium text-[var(--text-muted)]">Histórico de Atraso</p>
            <div className="mt-2"><DelayBadge record={record} /></div>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[#f7faff] p-4">
            <p className="text-xs font-medium text-[var(--text-muted)]">Motivo da elegibilidade</p>
            <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">{status.explanation}</p>
          </div>
        </div>

        <section className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Fotografia do indicador</h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Procedimentos congelados no fechamento do quadrimestre selecionado.</p>
            </div>

            {indicators.length > 1 && (
              <label className="block min-w-48">
                <span className="sr-only">Selecionar indicador da fotografia</span>
                <select
                  value={selectedIndicator}
                  onChange={(event) => setSelectedIndicator(event.target.value)}
                  className="form-control w-full px-3 py-2 text-sm font-semibold outline-none"
                  aria-label="Selecionar indicador da fotografia"
                >
                  {indicators.map((indicator) => (
                    <option key={indicator} value={indicator}>{indicator}</option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3">
            {variables.map((variable) => (
              <VariableSnapshotCard key={`${record.id}-${selectedIndicator}-${variable.codigo}`} variable={variable} />
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-[rgba(224,47,53,0.22)] bg-[rgba(224,47,53,0.06)] p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-red-800">Alerta automático</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--text-primary)]">{alertText}</p>
        </section>
      </section>
    </div>
  )
}

export const ModuloHistorico = ({ initialQuarter = null, initialPatientName = null }) => {
  const [selectedQuarter, setSelectedQuarter] = useState(initialQuarter)
  const [indicatorFilter, setIndicatorFilter] = useState('all')
  const [delayHistoryFilter, setDelayHistoryFilter] = useState('all')
  const [searchColumn, setSearchColumn] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const detailTriggerRef = useRef(null)

  useEffect(() => {
    setSelectedQuarter(initialQuarter)
  }, [initialQuarter])

  const quarter = AUDIT_QUARTERS.find((item) => item.id === selectedQuarter)
  const records = useMemo(() => (
    selectedQuarter
      ? AUDIT_HISTORY_RECORDS.filter((record) => record.quarterId === selectedQuarter)
      : []
  ), [selectedQuarter])
  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return records.filter((record) => {
      const matchesIndicator = indicatorFilter === 'all' || Boolean(record.snapshots[indicatorFilter])
      const matchesDelayHistory = delayHistoryFilter === 'all' || getAuditDelayStatus(record).id === delayHistoryFilter
      const matchesSearch = !normalizedQuery || getAuditRecordSearchValue(record, searchColumn).toLowerCase().includes(normalizedQuery)

      return matchesIndicator && matchesDelayHistory && matchesSearch
    })
  }, [delayHistoryFilter, indicatorFilter, query, records, searchColumn])
  const highlightedRecord = initialPatientName
    ? records.find((record) => record.paciente === initialPatientName)
    : null
  const currentStep = selectedRecord ? 'details' : selectedQuarter ? 'table' : 'quarter'

  const handleOpenDetails = (record, event) => {
    detailTriggerRef.current = event.currentTarget
    setSelectedRecord(record)
  }

  const clearFilters = () => {
    setIndicatorFilter('all')
    setDelayHistoryFilter('all')
    setSearchColumn('all')
    setQuery('')
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--primary-dark)]">Auditoria de Fechamento</p>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">Histórico de Auditoria</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
            Selecione o quadrimestre fechado e consulte a fotografia read-only dos pacientes que não bateram a meta.
          </p>
        </div>
        <StepIndicator currentStep={currentStep} />
      </header>

      {!selectedQuarter && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Selecione o quadrimestre</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Após a seleção, a tabela de pacientes será exibida na próxima etapa.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {AUDIT_QUARTERS.map((item) => (
              <QuarterCard key={item.id} quarter={item} selected={selectedQuarter === item.id} onSelect={setSelectedQuarter} />
            ))}
          </div>
        </section>
      )}

      {selectedQuarter && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">Quadrimestre selecionado</p>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{quarter?.title || selectedQuarter}</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{quarter?.period}</p>
            </div>
            <button type="button" onClick={() => setSelectedQuarter(null)} className="btn-secondary px-4 py-2 text-sm font-semibold">
              Trocar quadrimestre
            </button>
          </div>

          {highlightedRecord && (
            <div className="rounded-xl border border-[rgba(22,103,232,0.22)] bg-[rgba(22,103,232,0.08)] px-4 py-3 text-sm text-[var(--primary-dark)]">
              Paciente elegível vindo do módulo Pacientes: <span className="font-semibold">{highlightedRecord.paciente}</span>. Clique em “Detalhes” para abrir a fotografia.
            </div>
          )}

          <div className="app-card p-5">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[12rem_14rem_12rem_1fr_auto]">
              <select
                value={indicatorFilter}
                onChange={(event) => setIndicatorFilter(event.target.value)}
                className="form-control px-3 py-2 text-sm outline-none"
                aria-label="Filtrar por indicador"
              >
                {indicatorFilterOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
              <select
                value={delayHistoryFilter}
                onChange={(event) => setDelayHistoryFilter(event.target.value)}
                className="form-control px-3 py-2 text-sm outline-none"
                aria-label="Filtrar por histórico de atraso"
              >
                {delayHistoryFilterOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
              <select
                value={searchColumn}
                onChange={(event) => setSearchColumn(event.target.value)}
                className="form-control px-3 py-2 text-sm outline-none"
                aria-label="Selecionar coluna da busca"
              >
                {searchColumnOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
              <label className="form-shell flex items-center px-3 py-2">
                <span className="mr-2 text-[var(--text-muted)]" aria-hidden="true"><Icons.Search /></span>
                <span className="sr-only">Buscar no histórico de auditoria</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar por nome, CPF ou histórico"
                  className="app-input w-full border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none"
                />
              </label>
              {(indicatorFilter !== 'all' || delayHistoryFilter !== 'all' || searchColumn !== 'all' || query.trim()) && (
                <button type="button" onClick={clearFilters} className="btn-secondary px-4 py-2 text-sm font-semibold">
                  Limpar
                </button>
              )}
            </div>
            <p className="mt-4 text-sm text-[var(--text-muted)]">{filteredRecords.length} {filteredRecords.length === 1 ? 'paciente encontrado' : 'pacientes encontrados'}</p>
          </div>

          <div className="app-card overflow-x-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] px-5 py-4">
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">Pacientes auditados</h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{filteredRecords.length} registros demonstrativos · somente leitura</p>
              </div>
              <span className="rounded-full border border-[rgba(22,103,232,0.18)] bg-[rgba(22,103,232,0.08)] px-3 py-1 text-xs font-semibold text-[var(--primary-dark)]">
                {selectedQuarter}
              </span>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  {['Paciente', 'CPF', 'Indicador', 'Histórico de Atraso', 'Detalhes'].map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className={highlightedRecord?.id === record.id ? 'bg-[rgba(22,103,232,0.06)]' : undefined}>
                    <td className="whitespace-nowrap">{record.paciente}</td>
                    <td className="whitespace-nowrap">{record.cpf}</td>
                    <td>
                      <span className="rounded-full border border-[rgba(22,103,232,0.2)] bg-[rgba(22,103,232,0.08)] px-2.5 py-1 text-xs font-semibold text-[var(--primary-dark)]">
                        {record.indicador}
                      </span>
                    </td>
                    <td><DelayBadge record={record} /></td>
                    <td>
                      <button
                        type="button"
                        onClick={(event) => handleOpenDetails(record, event)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary-dark)] hover:underline"
                        aria-label={`Ver fotografia histórica de ${record.paciente}`}
                      >
                        Detalhes
                        <Icons.Eye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {selectedRecord && (
        <DetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          triggerRef={detailTriggerRef}
        />
      )}
    </div>
  )
}
