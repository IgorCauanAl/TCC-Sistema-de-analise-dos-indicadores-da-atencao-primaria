import { PageHeader } from '../components/ui/PageHeader'
import { StatusBadge } from '../components/ui/StatusBadge'
import { MOCK_INDICATORS } from '../data/mockData'

export const CruzamentoView = () => (
  <div>
    <PageHeader title="Cruzamento de Indicadores" subtitle="Comparação entre desempenho, risco e recomendação operacional" />
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {MOCK_INDICATORS.map((indicator) => (
        <article key={indicator.equipe} className="app-card p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 className="font-semibold text-[var(--text-primary)]">{indicator.equipe}</h2>
            <StatusBadge type={indicator.risco} />
          </div>
          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[#f7faff] p-3">
              <dt className="text-[var(--text-muted)]">C1</dt>
              <dd className="mt-1 font-semibold text-[var(--text-primary)]">{indicator.c1}</dd>
            </div>
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[#f7faff] p-3">
              <dt className="text-[var(--text-muted)]">C4</dt>
              <dd className="mt-1 font-semibold text-[var(--text-primary)]">{indicator.c4}</dd>
            </div>
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[#f7faff] p-3">
              <dt className="text-[var(--text-muted)]">C5</dt>
              <dd className="mt-1 font-semibold text-[var(--text-primary)]">{indicator.c5}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">{indicator.recomendacao}</p>
        </article>
      ))}
    </div>
  </div>
)
