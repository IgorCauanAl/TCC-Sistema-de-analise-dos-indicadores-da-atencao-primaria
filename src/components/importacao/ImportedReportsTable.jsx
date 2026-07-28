import { useMemo } from 'react'
import { formatNumber } from '../../utils/formatters'
import { ImportValidationBadge } from './ImportValidationBadge'
import { EmptyState } from './EmptyState'

export const ImportedReportsTable = ({ reports, teams, filters, onFilterChange, onDetails }) => {
  const filteredReports = useMemo(() => {
    const query = filters.query.trim().toLowerCase()

    return reports.filter((report) => {
      const team = teams.find((item) => item.id === report.teamId)
      const matchesQuery = !query || report.fileName.toLowerCase().includes(query)
      const matchesIndicator = filters.indicator === 'all' || report.report.startsWith(filters.indicator)
      const matchesQuarter = filters.quarter === 'all' || report.quarter === filters.quarter
      const matchesTeam = filters.team === 'all' || report.teamId === filters.team
      const matchesResult = filters.result === 'all' || report.result === filters.result
      const matchesDate = !filters.date || report.importedAt.includes(filters.date)

      return matchesQuery && matchesIndicator && matchesQuarter && matchesTeam && matchesResult && matchesDate && team
    })
  }, [filters, reports, teams])

  return (
    <section className="space-y-4">
      <div className="app-card p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
          <input className="form-control px-3 py-2 text-sm outline-none" placeholder="Buscar arquivo" value={filters.query} onChange={(event) => onFilterChange('query', event.target.value)} />
          <select className="form-control px-3 py-2 text-sm outline-none" value={filters.indicator} onChange={(event) => onFilterChange('indicator', event.target.value)}>
            <option value="all">Todos os indicadores</option>
            <option value="C4">C4</option>
            <option value="C5">C5</option>
          </select>
          <select className="form-control px-3 py-2 text-sm outline-none" value={filters.quarter} onChange={(event) => onFilterChange('quarter', event.target.value)}>
            <option value="all">Todos os quadrimestres</option>
            <option value="Q2-2026">Q2-2026</option>
          </select>
          <select className="form-control px-3 py-2 text-sm outline-none" value={filters.team} onChange={(event) => onFilterChange('team', event.target.value)}>
            <option value="all">Todas as equipes</option>
            {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
          <select className="form-control px-3 py-2 text-sm outline-none" value={filters.result} onChange={(event) => onFilterChange('result', event.target.value)}>
            <option value="all">Todos os resultados</option>
            <option value="imported">Importado</option>
            <option value="importedWithWarnings">Importado com avisos</option>
            <option value="notImported">Não importado</option>
          </select>
          <input className="form-control px-3 py-2 text-sm outline-none" placeholder="Data de importação" value={filters.date} onChange={(event) => onFilterChange('date', event.target.value)} />
        </div>
      </div>

      {!filteredReports.length ? (
        <EmptyState title="Histórico sem dados" description="Nenhum relatório importado corresponde aos filtros atuais." />
      ) : (
        <div className="app-card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                {['Arquivo', 'Indicador', 'Quadrimestre', 'Equipe/INE', 'Pacientes', 'Importado em', 'Importado por', 'Resultado', 'Ação'].map((header) => <th key={header}>{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => {
                const team = teams.find((item) => item.id === report.teamId)

                return (
                  <tr key={report.id}>
                    <td>{report.fileName}<span className="mt-1 block text-xs text-[var(--text-muted)]">{report.version}</span></td>
                    <td>{report.report}</td>
                    <td>{report.quarter}</td>
                    <td>{team.name} — INE {team.ine}</td>
                    <td>{report.patients == null ? '—' : formatNumber(report.patients)}</td>
                    <td>{report.importedAt}</td>
                    <td>{report.importedBy}</td>
                    <td><ImportValidationBadge type="result" status={report.result} /></td>
                    <td className="min-w-40">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => onDetails(report)} className="text-sm font-semibold text-[var(--primary-dark)] hover:underline">Ver detalhes</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
