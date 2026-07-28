import { Fragment, useState } from 'react'

const statusStyles = {
  Completo: 'border-[rgba(6,154,88,0.22)] bg-[rgba(6,154,88,0.08)] text-[var(--success)]',
  Incompleto: 'border-[rgba(224,47,53,0.22)] bg-[rgba(224,47,53,0.08)] text-[var(--danger)]',
  'Aguardando importação': 'border-[rgba(22,103,232,0.2)] bg-[rgba(22,103,232,0.08)] text-[var(--primary-dark)]',
  'Com relatórios em revisão': 'border-[rgba(240,132,0,0.24)] bg-[rgba(240,132,0,0.09)] text-[var(--warning)]',
  'Com possíveis duplicidades': 'border-[rgba(229,109,34,0.24)] bg-[rgba(229,109,34,0.09)] text-[var(--alert)]',
}

export const QuarterConference = ({ rows }) => {
  const [expandedId, setExpandedId] = useState(null)

  return (
    <section className="app-card overflow-hidden">
      <div className="border-b border-[var(--border-subtle)] px-5 py-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Conferência dos relatórios do quadrimestre</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Verifique se todas as equipes enviaram os relatórios necessários antes de processar os indicadores.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {['Indicador', 'Equipes esperadas', 'Relatórios recebidos', 'Faltam', 'Situação', 'Ação'].map((header) => <th key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <Fragment key={row.id}>
                <tr>
                  <td>{row.indicator}</td>
                  <td>{row.expectedTeams}</td>
                  <td>{row.receivedReports}</td>
                  <td>{row.missing}</td>
                  <td>
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    {row.missing ? (
                      <button type="button" onClick={() => setExpandedId(expandedId === row.id ? null : row.id)} className="text-sm font-semibold text-[var(--primary-dark)] hover:underline">
                        Ver equipes pendentes
                      </button>
                    ) : (
                      <span className="text-sm text-[var(--text-muted)]">—</span>
                    )}
                  </td>
                </tr>
                {expandedId === row.id && (
                  <tr>
                    <td colSpan="6" className="bg-[#f7faff]">
                      <div className="px-2 py-2">
                        <p className="font-semibold text-[var(--text-primary)]">Equipes sem relatório</p>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {row.missingTeams.map((team) => (
                            <li key={team} className="rounded-full border border-[var(--border-subtle)] bg-white px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">{team}</li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
