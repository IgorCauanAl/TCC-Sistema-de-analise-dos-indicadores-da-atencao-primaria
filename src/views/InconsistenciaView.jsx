import { useEffect, useMemo, useRef, useState } from 'react'
import { Icons } from '../components/ui/Icons'
import { IMPORT_AUDIT_METADATA, MISSING_CPF_RECORDS } from '../data/inconsistenciesData'

const filterColumns = [
  { id: 'all', label: 'Todas as colunas' },
  { id: 'name', label: 'Nome' },
  { id: 'team', label: 'Equipe' },
  { id: 'ine', label: 'INE' },
]

const manualReviewSteps = [
  {
    title: 'Consultar o cadastro individual',
    description: 'Localize o registro no PEC ou sistema cadastral de origem.',
  },
  {
    title: 'Comparar identificadores',
    description: 'Confira CNS, data de nascimento, filiação e equipe responsável.',
  },
  {
    title: 'Corrigir na fonte e reimportar',
    description: 'Registre a correção no sistema oficial antes da próxima análise.',
  },
]

const getUniqueCount = (values) => new Set(values).size

const getMissingCpfSearchValue = (record, column) => {
  if (column === 'all') return `${record.patientName} ${record.team} ${record.ine}`
  if (column === 'name') return record.patientName
  return record[column] || ''
}

const SummaryCard = ({ label, value, description }) => (
  <article className="app-card p-5">
    <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
    <p className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">{value}</p>
    <p className="mt-2 text-sm leading-5 text-[var(--text-muted)]">{description}</p>
  </article>
)

const InconsistencySummary = ({ missingCpfCount, typeCount, affectedTeamsCount }) => (
  <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
    <SummaryCard
      label="Registros para revisar"
      value={missingCpfCount}
      description="Sem alteração automática nos cadastros"
    />
    <SummaryCard
      label="Tipos identificados"
      value={typeCount}
      description="Ausência de CPF"
    />
    <SummaryCard
      label="Equipes envolvidas"
      value={affectedTeamsCount}
      description="Conferência distribuída por equipe de origem"
    />
  </section>
)

const InconsistencyCategoryCard = ({ category, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(category.id)}
    className={`app-card flex min-h-56 flex-col justify-between border-l-4 p-6 text-left transition hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-[0_18px_34px_rgba(25,55,95,0.12)] focus-visible:-translate-y-0.5 ${category.borderClass}`}
    aria-label={`Abrir auditoria ${category.title}`}
  >
    <span>
      <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold ${category.iconClass}`}>
        {category.icon}
      </span>
      <span className="mt-5 block text-xl font-semibold text-[var(--text-primary)]">{category.title}</span>
      <span className="mt-2 block text-sm leading-6 text-[var(--text-secondary)]">{category.description}</span>
    </span>
    <span className="mt-6 flex items-center justify-between gap-4">
      <span className="text-sm font-semibold text-[var(--primary-dark)]">Abrir auditoria</span>
      <span className="text-2xl text-[var(--text-muted)]" aria-hidden="true">›</span>
    </span>
  </button>
)

const InconsistencyToolbar = ({ filterColumn, query, onChangeColumn, onChangeQuery, placeholder }) => (
  <div className="app-card p-5">
    <div className="grid grid-cols-1 gap-3 md:grid-cols-[12rem_1fr]">
      <label className="sr-only" htmlFor="inconsistency-column-filter">Coluna da busca</label>
      <select
        id="inconsistency-column-filter"
        value={filterColumn}
        onChange={(event) => onChangeColumn(event.target.value)}
        className="form-control px-3 py-2 text-sm outline-none"
        aria-label="Selecionar coluna para busca"
      >
        {filterColumns.map((column) => (
          <option key={column.id} value={column.id}>{column.label}</option>
        ))}
      </select>

      <label className="form-shell flex items-center px-3 py-2">
        <span className="mr-2 text-[var(--text-muted)]" aria-hidden="true"><Icons.Search /></span>
        <span className="sr-only">{placeholder}</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onChangeQuery(event.target.value)}
          placeholder={placeholder}
          className="app-input w-full border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none"
          aria-label={placeholder}
        />
      </label>
    </div>
  </div>
)

const EmptyState = ({ onClear }) => (
  <div className="app-card px-6 py-12 text-center">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(22,103,232,0.18)] bg-[rgba(22,103,232,0.08)] text-[var(--primary)]" aria-hidden="true">
      <Icons.Search />
    </div>
    <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">Nenhuma inconsistência encontrada</h3>
    <p className="mt-2 text-sm text-[var(--text-muted)]">Revise os termos utilizados na busca.</p>
    <button type="button" onClick={onClear} className="btn-secondary mt-5 px-4 py-2 text-sm font-semibold">
      Limpar busca
    </button>
  </div>
)

const MissingCpfTable = ({ records, onReview }) => (
  <div className="app-card overflow-x-auto">
    <table className="data-table">
      <thead>
        <tr>
          {['Paciente', 'Situação cadastral', 'Equipe de origem', 'INE', 'Origem', 'Ação'].map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <tr key={record.id}>
            <td className="whitespace-nowrap">
              <span className="block">{record.patientName}</span>
              <span className="mt-1 block text-xs font-normal text-[var(--text-muted)]">CNS {record.cns}</span>
            </td>
            <td>
              <span className="rounded-full border border-[rgba(224,47,53,0.22)] bg-[rgba(224,47,53,0.08)] px-3 py-1 text-xs font-semibold text-[var(--danger)]">
                CPF não informado
              </span>
            </td>
            <td className="whitespace-nowrap">{record.team}</td>
            <td className="whitespace-nowrap">{record.ine}</td>
            <td className="whitespace-nowrap">{record.origin}</td>
            <td>
              <button
                type="button"
                onClick={(event) => onReview({ kind: 'missingCpf', record }, event)}
                className="text-sm font-semibold text-[var(--primary-dark)] hover:underline"
                aria-label={`Revisar cadastro sem CPF de ${record.patientName}`}
              >
                Revisar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const ManualReviewSteps = () => (
  <section className="mt-6">
    <h3 className="text-base font-semibold text-[var(--text-primary)]">Etapas recomendadas</h3>
    <ol className="mt-3 space-y-3">
      {manualReviewSteps.map((step, index) => (
        <li key={step.title} className="rounded-xl border border-[var(--border-subtle)] bg-[#f7faff] p-4">
          <p className="text-sm font-semibold text-[var(--text-primary)]">{index + 1}. {step.title}</p>
          <p className="mt-1 text-sm leading-5 text-[var(--text-secondary)]">{step.description}</p>
        </li>
      ))}
    </ol>
  </section>
)

const DetailField = ({ label, value }) => (
  <div className="rounded-xl border border-[var(--border-subtle)] bg-[#f7faff] p-3">
    <dt className="text-xs font-medium text-[var(--text-muted)]">{label}</dt>
    <dd className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{value}</dd>
  </div>
)

const InconsistencyReviewDrawer = ({ selection, onClose, triggerRef }) => {
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

  const titleId = 'missing-cpf-review-title'

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(14,27,51,0.36)]" onMouseDown={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-[-20px_0_44px_rgba(25,55,95,0.18)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary-dark)]">
              REVISÃO DE CPF AUSENTE
            </p>
            <h2 id={titleId} className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">
              {selection.record.patientName}
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Auditoria da qualidade cadastral</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)] text-xl font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-interactive)]"
            aria-label="Fechar revisão"
          >
            ×
          </button>
        </div>

        <section className="mt-6 rounded-xl border border-[rgba(224,47,53,0.22)] bg-[rgba(224,47,53,0.07)] p-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Validação humana obrigatória</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Não associe um CPF sem conferir outros identificadores no cadastro de origem.
          </p>
        </section>

        <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailField label="Paciente" value={selection.record.patientName} />
          <DetailField label="CPF" value="Não informado" />
          <DetailField label="CNS" value={selection.record.cns} />
          <DetailField label="Equipe" value={selection.record.team} />
          <DetailField label="INE" value={selection.record.ine} />
          <DetailField label="Origem" value={selection.record.origin} />
          <DetailField label="Data da importação" value={selection.record.importedAt} />
          <DetailField label="Tratamento" value="Conferência manual" />
        </dl>

        <ManualReviewSteps />

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="btn-primary px-4 py-2 text-sm font-semibold">
            Concluir revisão
          </button>
        </div>
      </aside>
    </div>
  )
}

const DashboardHeader = () => (
  <header className="flex flex-wrap items-start justify-between gap-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary-dark)]">QUALIDADE CADASTRAL / AUDITORIA DA IMPORTAÇÃO</p>
      <h1 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">Inconsistências</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
        Identifique registros que precisam de conferência antes da análise dos indicadores C4 e C5.
      </p>
    </div>
    <div className="app-card flex items-center gap-3 px-4 py-3">
      <span className="h-3 w-3 rounded-full bg-[var(--success)]" aria-hidden="true" />
      <span>
        <span className="block text-sm font-semibold text-[var(--text-primary)]">Última importação analisada</span>
        <span className="mt-1 block text-xs text-[var(--text-muted)]">{IMPORT_AUDIT_METADATA.lastImportAnalyzedAt}</span>
      </span>
    </div>
  </header>
)

const AuditHeader = ({ title, description, onBack }) => (
  <header className="flex flex-wrap items-start justify-between gap-4">
    <div>
      <p className="text-sm font-medium text-[var(--text-muted)]">Inconsistência selecionada</p>
      <h1 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
    </div>
    <button type="button" onClick={onBack} className="btn-secondary px-4 py-2 text-sm font-semibold">
      Voltar para inconsistências
    </button>
  </header>
)

export const InconsistenciaView = () => {
  const [selectedType, setSelectedType] = useState(null)
  const [query, setQuery] = useState('')
  const [filterColumn, setFilterColumn] = useState('all')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const reviewTriggerRef = useRef(null)

  const missingCpfTeams = useMemo(() => getUniqueCount(MISSING_CPF_RECORDS.map((record) => record.ine)), [])
  const categories = useMemo(() => [
    {
      id: 'missingCpf',
      title: 'Sem CPF',
      description: 'Cadastros importados sem CPF informado.',
      icon: 'ID',
      borderClass: 'border-l-[var(--danger)]',
      iconClass: 'bg-[rgba(224,47,53,0.08)] text-[var(--danger)]',
    },
  ], [])

  const filteredMissingCpfRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return MISSING_CPF_RECORDS

    return MISSING_CPF_RECORDS.filter((record) => (
      getMissingCpfSearchValue(record, filterColumn).toLowerCase().includes(normalizedQuery)
    ))
  }, [filterColumn, query])

  const handleSelectType = (type) => {
    setSelectedType(type)
    setQuery('')
    setFilterColumn('all')
    setSelectedRecord(null)
  }

  const handleBackToDashboard = () => {
    setSelectedType(null)
    setQuery('')
    setFilterColumn('all')
    setSelectedRecord(null)
  }

  const handleOpenReview = (payload, event) => {
    reviewTriggerRef.current = event.currentTarget
    setSelectedRecord(payload)
  }

  const affectedTeamsCount = missingCpfTeams

  if (selectedType === 'missingCpf') {
    return (
      <div className="space-y-6">
        <AuditHeader
          title="Sem CPF"
          description="Cadastros importados sem CPF informado para conferência na origem."
          onBack={handleBackToDashboard}
        />

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SummaryCard label="Cadastros sem CPF" value={MISSING_CPF_RECORDS.length} description="Registros para localizar na origem" />
          <SummaryCard label="Equipes afetadas" value={missingCpfTeams} description="Equipes de origem envolvidas" />
          <SummaryCard label="Tratamento recomendado" value="Revisão manual" description="Confirmar no cadastro de origem" />
        </section>

        <section className="rounded-xl border border-[rgba(224,47,53,0.18)] bg-[rgba(224,47,53,0.07)] p-5">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">O CPF ausente limita a identificação segura</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Confira CPF, CNS e cadastro individual no sistema de origem. Atualize a fonte antes de realizar uma nova importação.
          </p>
        </section>

        <InconsistencyToolbar
          filterColumn={filterColumn}
          query={query}
          onChangeColumn={setFilterColumn}
          onChangeQuery={setQuery}
          placeholder="Buscar por nome, equipe ou INE"
        />

        {filteredMissingCpfRecords.length ? (
          <MissingCpfTable records={filteredMissingCpfRecords} onReview={handleOpenReview} />
        ) : (
          <EmptyState onClear={() => setQuery('')} />
        )}

        <footer className="flex flex-wrap justify-between gap-3 text-xs text-[var(--text-muted)]">
          <span>Dados demonstrativos da importação e-SUS Helper</span>
          <span>As correções devem ser realizadas no sistema de origem.</span>
        </footer>

        {selectedRecord && (
          <InconsistencyReviewDrawer
            selection={selectedRecord}
            onClose={() => setSelectedRecord(null)}
            triggerRef={reviewTriggerRef}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <InconsistencySummary
        missingCpfCount={MISSING_CPF_RECORDS.length}
        typeCount={categories.length}
        affectedTeamsCount={affectedTeamsCount}
      />

      <section className="rounded-xl border border-[rgba(22,103,232,0.2)] bg-[rgba(22,103,232,0.07)] p-5">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">Selecione o tipo de inconsistência</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          A auditoria organiza os registros por problema cadastral. Nenhuma correção ou unificação é feita automaticamente.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {categories.map((category) => (
          <InconsistencyCategoryCard key={category.id} category={category} onSelect={handleSelectType} />
        ))}
      </section>
    </div>
  )
}
