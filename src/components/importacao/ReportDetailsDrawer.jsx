import { formatNumber } from '../../utils/formatters'
import { IMPORT_RESULT_STATUS } from '../../data/importReportsData'
import { InconsistencyTable } from './InconsistencyTable'

export const ReportDetailsDrawer = ({ report, team, onClose, onOpenInconsistencies }) => {
  if (!report) return null

  const resultLabel = IMPORT_RESULT_STATUS[report.result]?.label || report.result

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(14,27,51,0.36)] p-0 sm:p-4" onMouseDown={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-detail-title"
        className="h-full w-full overflow-y-auto bg-white p-5 shadow-[-20px_0_44px_rgba(25,55,95,0.18)] sm:max-w-2xl sm:rounded-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary-dark)]">Detalhes do relatório</p>
            <h2 id="report-detail-title" className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">{report.detailTitle}</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{team?.name || 'Equipe não identificada'} — {report.quarter}</p>
          </div>
          <button type="button" onClick={onClose} className="btn-secondary h-10 px-3 text-sm font-semibold">Fechar</button>
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            ['Arquivo recebido', report.fileName],
            ['Emitido em', report.emittedAt],
            ['Importado em', report.importedAt],
            ['Importado por', report.importedBy],
            ['Equipe/INE', team ? `${team.name} — INE ${team.ine}` : '—'],
            ['Pacientes identificados', report.patients == null ? '—' : formatNumber(report.patients)],
            ['Pacientes sem inconsistências', formatNumber(report.cleanPatients)],
            ['Pacientes com inconsistências', formatNumber(report.patientsWithIssues)],
            ['Resultado', resultLabel],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-[var(--border-subtle)] bg-[#f7faff] p-3">
              <dt className="text-xs font-medium text-[var(--text-muted)]">{label}</dt>
              <dd className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{value}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Inconsistências encontradas</h3>
            <button type="button" onClick={onOpenInconsistencies} className="btn-primary px-4 py-2 text-sm font-semibold">
              Ver paciente no módulo Inconsistências
            </button>
          </div>
          <div className="mt-4">
            <InconsistencyTable items={report.issueBreakdown} />
          </div>
        </section>
      </aside>
    </div>
  )
}
