import { PageHeader } from '../components/ui/PageHeader'
import { ProgressBar } from '../components/ui/ProgressBar'
import { MOCK_INDICATORS } from '../data/mockData'

export const CalculoC1View = () => (
  <div>
    <PageHeader title="Cálculo C1 - Mais Acesso" subtitle="Simulação de cobertura por equipe para o componente C1" />
    <div className="space-y-4">
      {MOCK_INDICATORS.map((indicator) => {
        const percent = Number.parseInt(indicator.c1, 10)
        return (
          <div key={indicator.equipe} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">{indicator.equipe}</h2>
              <span className="text-sm font-bold text-blue-700">{indicator.c1}</span>
            </div>
            <ProgressBar percent={percent} colorClass={percent >= 50 ? 'bg-green-600' : 'bg-blue-600'} />
          </div>
        )
      })}
    </div>
  </div>
)
