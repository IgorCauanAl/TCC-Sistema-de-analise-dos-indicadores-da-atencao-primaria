import { EmptyState } from './EmptyState'

export const ProblemReportsTable = ({ reports, onRemove, onReview }) => {
  if (!reports.length) {
    return (
      <EmptyState
        title="Nenhum relatório com problema"
        description="Os relatórios que exigirem correção ou revisão aparecerão aqui."
      />
    )
  }

  return (
    <section className="app-card overflow-hidden">
      <div className="border-b border-[var(--border-subtle)] px-5 py-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Relatórios com problemas</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Arquivos não reconhecidos, inválidos, duplicados, sem equipe/INE ou com falha de processamento.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {['Arquivo', 'Problema', 'Data', 'Equipe/INE', 'Situação', 'Ação'].map((header) => <th key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.fileName}</td>
                <td className="min-w-72">{report.problem}</td>
                <td>{report.date}</td>
                <td>{report.team}</td>
                <td>{report.status}</td>
                <td className="min-w-44">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => onReview(report)} className="text-sm font-semibold text-[var(--primary-dark)] hover:underline">{report.action}</button>
                    <button type="button" className="text-sm font-semibold text-[var(--primary-dark)] hover:underline">Tentar novamente</button>
                    <button type="button" onClick={() => onRemove(report.id)} className="text-sm font-semibold text-[var(--danger)] hover:underline">Remover</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
