import { useMemo, useRef, useState } from 'react'
import { Icons } from '../ui/Icons'
import { ImportValidationBadge } from './ImportValidationBadge'

const getTeamLabel = (file, teams) => {
  if (!file.teamId) return 'Não identificada'
  const team = teams.find((item) => item.id === file.teamId)
  return team ? `${team.name} — INE ${team.ine}${file.manualTeam ? ' · Equipe definida manualmente' : ''}` : '—'
}

const canImport = (file) => ['ready', 'warning', 'duplicate'].includes(file.validation) && file.teamId

export const ImportQueueTable = ({ files, teams, onFilesSelected, onRemove, onClear, onSetTeam, onImport }) => {
  const inputRef = useRef(null)
  const [editingFileId, setEditingFileId] = useState(null)
  const [teamQuery, setTeamQuery] = useState('')
  const validCount = useMemo(() => files.filter(canImport).length, [files])
  const filteredTeams = useMemo(() => {
    const query = teamQuery.trim().toLowerCase()
    if (!query) return teams
    return teams.filter((team) => team.name.toLowerCase().includes(query) || team.ine.includes(query))
  }, [teamQuery, teams])

  return (
    <section className="app-card overflow-hidden">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.csv,.xlsx,.xls"
        className="hidden"
        onChange={(event) => onFilesSelected(Array.from(event.target.files || []))}
      />
      <div className="border-b border-[var(--border-subtle)] px-5 py-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Arquivos selecionados</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Confira os relatórios identificados antes de iniciar a importação.</p>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="data-table">
          <thead>
            <tr>
              {['Arquivo', 'Relatório identificado', 'Quadrimestre', 'Equipe/INE', 'Validação', 'Ação'].map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td className="min-w-48">{file.fileName}</td>
                <td>{file.report}</td>
                <td>{file.quarter}</td>
                <td className="min-w-64">
                  {editingFileId === file.id ? (
                    <div className="space-y-2">
                      <input
                        type="search"
                        value={teamQuery}
                        onChange={(event) => setTeamQuery(event.target.value)}
                        placeholder="Pesquisar equipe ou INE"
                        className="form-control w-full px-3 py-2 text-sm outline-none"
                      />
                      <select
                        className="form-control w-full px-3 py-2 text-sm outline-none"
                        onChange={(event) => {
                          onSetTeam(file.id, event.target.value)
                          setEditingFileId(null)
                          setTeamQuery('')
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>Selecionar equipe</option>
                        {filteredTeams.map((team) => (
                          <option key={team.id} value={team.id}>{team.name} — INE {team.ine}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <span>{getTeamLabel(file, teams)}</span>
                  )}
                </td>
                <td><ImportValidationBadge status={file.validation} /></td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    {file.validation === 'missingTeam' && (
                      <button type="button" onClick={() => setEditingFileId(file.id)} className="text-sm font-semibold text-[var(--primary-dark)] hover:underline">Informar equipe</button>
                    )}
                    {file.validation === 'duplicate' && <button type="button" className="text-sm font-semibold text-[var(--primary-dark)] hover:underline">Revisar</button>}
                    {file.validation === 'invalid' && <button type="button" className="text-sm font-semibold text-[var(--primary-dark)] hover:underline">Substituir relatório</button>}
                    {file.validation === 'validating' && <button type="button" className="text-sm font-semibold text-[var(--primary-dark)] hover:underline">Tentar novamente</button>}
                    <button type="button" onClick={() => onRemove(file.id)} className="text-sm font-semibold text-[var(--danger)] hover:underline">Remover</button>
                  </div>
                </td>
              </tr>
            ))}
            {!files.length && (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-sm text-[var(--text-muted)]">Nenhum arquivo selecionado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {files.map((file) => (
          <article key={file.id} className="rounded-xl border border-[var(--border-subtle)] bg-[#f7faff] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">{file.fileName}</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{file.report} · {file.quarter}</p>
            </div>
            <ImportValidationBadge status={file.validation} />
          </div>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">{getTeamLabel(file, teams)}</p>
          {editingFileId === file.id && (
            <div className="mt-3 space-y-2">
              <input
                type="search"
                value={teamQuery}
                onChange={(event) => setTeamQuery(event.target.value)}
                placeholder="Pesquisar equipe ou INE"
                className="form-control w-full px-3 py-2 text-sm outline-none"
              />
              <select
                className="form-control w-full px-3 py-2 text-sm outline-none"
                onChange={(event) => {
                  onSetTeam(file.id, event.target.value)
                  setEditingFileId(null)
                  setTeamQuery('')
                }}
                defaultValue=""
              >
                <option value="" disabled>Selecionar equipe</option>
                {filteredTeams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name} — INE {team.ine}</option>
                ))}
              </select>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
              {file.validation === 'missingTeam' && <button type="button" onClick={() => setEditingFileId(file.id)} className="btn-secondary px-3 py-2 text-sm font-semibold">Informar equipe</button>}
              <button type="button" onClick={() => onRemove(file.id)} className="btn-secondary px-3 py-2 text-sm font-semibold">Remover</button>
            </div>
          </article>
        ))}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] px-5 py-4">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => inputRef.current?.click()} className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold">
            <Icons.Upload />
            Adicionar mais arquivos
          </button>
          <button type="button" onClick={onClear} className="btn-secondary px-4 py-2 text-sm font-semibold">Limpar lista</button>
        </div>
        <button type="button" onClick={onImport} disabled={!validCount} className="btn-primary px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50">
          Importar {validCount} relatórios
        </button>
      </footer>
      <p className="px-5 pb-4 text-xs text-[var(--text-muted)]">
        Arquivos inválidos ou sem equipe/INE obrigatória não entram na contagem de importação.
      </p>
    </section>
  )
}
