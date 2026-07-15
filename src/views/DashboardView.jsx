import { Icons } from '../components/ui/Icons'
import { PageHeader } from '../components/ui/PageHeader'
import { StatusBadge } from '../components/ui/StatusBadge'
import { MOCK_INDICATORS } from '../data/mockData'

const alertCards = [
  { label: 'Quase regularizados', value: 10, patients: 72, helper: 'Pendências rápidas para concluir.', color: 'green', icon: <Icons.CheckCircle /> },
  { label: 'Acompanhamento Parcial', value: 10, patients: 383, helper: 'Pacientes com cuidado incompleto.', color: 'yellow', icon: <Icons.Alert /> },
  { label: 'Zerados', value: 10, patients: 188, helper: 'Sem acompanhamento válido no ciclo.', color: 'red', icon: <Icons.Alert /> },
]

const cardStyles = {
  green: 'border-green-200 border-l-green-500 text-green-600',
  yellow: 'border-yellow-200 border-l-yellow-500 text-yellow-600',
  orange: 'border-orange-200 border-l-orange-500 text-orange-600',
  red: 'border-red-200 border-l-red-500 text-red-600',
}

const getTopTeams = (field) => [...MOCK_INDICATORS].sort((a, b) => b[field] - a[field]).slice(0, 10)

const HorizontalRanking = ({ data, field, barColor }) => {
  const maxValue = Math.max(...data.map((item) => item[field]))

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.equipe} className="grid grid-cols-[1.5rem_minmax(8rem,12rem)_1fr_5rem] items-center gap-3 text-sm">
          <span className="text-right font-semibold text-gray-400">{index + 1}</span>
          <span className="truncate font-medium text-gray-700">{item.equipe}</span>
          <div className="h-3 rounded-full bg-gray-100">
            <div className={`h-3 rounded-full ${barColor}`} style={{ width: `${(item[field] / maxValue) * 100}%` }} />
          </div>
          <span className="text-right font-semibold text-gray-900">{item[field]} pac.</span>
        </div>
      ))}
    </div>
  )
}

export const DashboardView = () => (
  <div className="space-y-6">
    <PageHeader title="Página Inicial" subtitle="Sala de Situação - Gestão da Atenção Primária à Saúde" />

    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {alertCards.map((card) => (
        <div key={card.label} className={`rounded-lg border border-l-4 bg-white p-4 shadow-sm ${cardStyles[card.color]}`}>
          <div className="mb-2 flex items-center">
            {card.icon}
            <span className="ml-2 font-semibold">{card.label}</span>
          </div>
          <div className="space-y-2 text-3xl font-bold text-gray-800">
            <div>
              {card.value} <span className="text-sm font-normal text-gray-500">equipes</span>
            </div>
            <div>
              {card.patients} <span className="text-sm font-normal text-gray-500">pacientes</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">{card.helper}</p>
        </div>
      ))}
    </div>

    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800">Ranking de equipes em acompanhamento parcial</h3>
      <p className="mb-6 mt-1 text-sm text-gray-500">10 equipes com mais pacientes em acompanhamento parcial</p>
      <HorizontalRanking data={getTopTeams('acompanhamentoParcial')} field="acompanhamentoParcial" barColor="bg-yellow-500" />

      <div className="mt-10 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-800">Ranking de equipes com pacientes zerados</h3>
        <p className="mb-6 mt-1 text-sm text-gray-500">10 equipes com mais pacientes sem acompanhamento válido no ciclo</p>
        <HorizontalRanking data={getTopTeams('zerados')} field="zerados" barColor="bg-red-500" />
      </div>
    </div>

    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800">Situação por Equipe</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Equipe', 'Acesso APS (C1)', 'Quase Regularizados', 'Gargalo Principal', 'Selo de Risco'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {MOCK_INDICATORS.map((indicator) => (
              <tr key={indicator.equipe}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{indicator.equipe}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{indicator.c1}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{indicator.quaseRegularizados} pacientes</td>
                <td className="px-6 py-4 text-sm text-gray-600">{indicator.gargaloPrincipal}</td>
                <td className="px-6 py-4"><StatusBadge type={indicator.risco} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)
