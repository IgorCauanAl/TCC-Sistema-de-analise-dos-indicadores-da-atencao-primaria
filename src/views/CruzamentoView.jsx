import { PageHeader } from '../components/ui/PageHeader'
import { StatusBadge } from '../components/ui/StatusBadge'
import { MOCK_INDICATORS } from '../data/mockData'

export const CruzamentoView = () => (
  <div>
    <PageHeader title="Cruzamento de Indicadores" subtitle="Comparação entre desempenho, risco e recomendação operacional" />
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {MOCK_INDICATORS.map((indicator) => (
        <article key={indicator.equipe} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 className="font-semibold text-gray-900">{indicator.equipe}</h2>
            <StatusBadge type={indicator.risco} />
          </div>
          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-md bg-gray-50 p-3">
              <dt className="text-gray-500">C1</dt>
              <dd className="mt-1 font-bold text-gray-900">{indicator.c1}</dd>
            </div>
            <div className="rounded-md bg-gray-50 p-3">
              <dt className="text-gray-500">C4</dt>
              <dd className="mt-1 font-bold text-gray-900">{indicator.c4}</dd>
            </div>
            <div className="rounded-md bg-gray-50 p-3">
              <dt className="text-gray-500">C5</dt>
              <dd className="mt-1 font-bold text-gray-900">{indicator.c5}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-gray-600">{indicator.recomendacao}</p>
        </article>
      ))}
    </div>
  </div>
)
