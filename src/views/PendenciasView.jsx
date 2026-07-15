import { PageHeader } from '../components/ui/PageHeader'
import { StatusBadge } from '../components/ui/StatusBadge'
import { MOCK_PATIENTS } from '../data/mockData'

export const PendenciasView = () => (
  <div>
    <PageHeader title="Fechamento de Pendências" subtitle="Acompanhamento de correções e registros faltantes" />
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Usuário', 'UBS', 'Pendências', 'Status'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {MOCK_PATIENTS.map((patient) => (
              <tr key={patient.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{patient.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{patient.ubs}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{patient.pendencias.length ? patient.pendencias.join(', ') : 'Sem pendências'}</td>
                <td className="px-6 py-4"><StatusBadge type={patient.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)
