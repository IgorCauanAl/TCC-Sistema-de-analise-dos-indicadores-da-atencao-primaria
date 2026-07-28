import { ProgressBar } from '../ui/ProgressBar'
import { ImportValidationBadge } from './ImportValidationBadge'

export const FileProgressTable = ({ files }) => (
  <section className="app-card overflow-hidden">
    <div className="border-b border-[var(--border-subtle)] px-5 py-4">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Importação em andamento</h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Cada relatório é processado individualmente. Uma falha não bloqueia os demais arquivos.</p>
    </div>
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            {['Arquivo', 'Etapa atual', 'Progresso', 'Resultado'].map((header) => <th key={header}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td className="min-w-48">{file.fileName}</td>
              <td>{file.currentStep}</td>
              <td className="min-w-52">
                <div className="flex items-center gap-3">
                  <div className="w-32"><ProgressBar percent={file.progress} /></div>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{file.progress}%</span>
                </div>
              </td>
              <td><ImportValidationBadge type="result" status={file.result} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)
