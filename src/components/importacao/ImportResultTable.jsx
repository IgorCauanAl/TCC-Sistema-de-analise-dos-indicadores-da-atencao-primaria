import { formatNumber } from '../../utils/formatters'
import { IMPORT_RESULT_STATUS } from '../../data/importReportsData'
import { ImportValidationBadge } from './ImportValidationBadge'
import { EmptyState } from './EmptyState'

export const ImportResultTable = ({ reports, teams, onDetails }) => {
  if (!reports.length) {
    return <EmptyState title="Nenhum resultado de importação" description="Os resultados aparecerão após a conclusão da importação dos arquivos válidos." />
  }

  return (
    <section className="app-card overflow-hidden">
      <div className="border-b border-[var(--border-subtle)] px-5 py-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Resultado da importação</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Importação concluída não significa indicadores processados.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {['Arquivo', 'Equipe/INE', 'Pacientes identificados', 'Inconsistências', 'Resultado', 'Ação'].map((header) => <th key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => {
              const team = teams.find((item) => item.id === report.teamId)
              const resultLabel = IMPORT_RESULT_STATUS[report.result]?.label

              return (
                <tr key={report.id}>
                  <td className="min-w-48">{report.fileName}</td>
                  <td>{team ? `${team.name} — INE ${team.ine}` : '—'}</td>
                  <td>{report.patients == null ? '—' : formatNumber(report.patients)}</td>
                  <td>{report.inconsistencies}</td>
                  <td><ImportValidationBadge type="result" status={report.result} /></td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => onDetails(report)} className="text-sm font-semibold text-[var(--primary-dark)] hover:underline">
                        {resultLabel === 'Não importado' ? 'Revisar' : 'Ver detalhes'}
                      </button>
                      <button type="button" className="text-sm font-semibold text-[var(--primary-dark)] hover:underline">Substituir relatório</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
