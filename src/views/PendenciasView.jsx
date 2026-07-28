import { PageHeader } from '../components/ui/PageHeader'
import { StatusBadge } from '../components/ui/StatusBadge'
import { MOCK_PATIENTS } from '../data/mockData'

export const PendenciasView = () => (
  <div>
    <PageHeader title="Fechamento de Pendências" subtitle="Acompanhamento de correções e registros faltantes" />
    <div className="app-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {['Usuário', 'UBS', 'Pendências', 'Status'].map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_PATIENTS.map((patient) => (
              <tr key={patient.id}>
                <td className="whitespace-nowrap">{patient.name}</td>
                <td>{patient.ubs}</td>
                <td>{patient.pendencias.length ? patient.pendencias.join(', ') : 'Sem pendências'}</td>
                <td><StatusBadge type={patient.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)
