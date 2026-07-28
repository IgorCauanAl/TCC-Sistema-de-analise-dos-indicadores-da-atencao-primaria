import { Icons } from '../ui/Icons'
import { formatNumber } from '../../utils/formatters'

const cardStyles = {
  received: 'border-[rgba(22,103,232,0.2)] bg-[rgba(22,103,232,0.08)] text-[var(--primary-dark)]',
  imported: 'border-[rgba(6,154,88,0.22)] bg-[rgba(6,154,88,0.08)] text-[var(--success)]',
  warning: 'border-[rgba(240,132,0,0.24)] bg-[rgba(240,132,0,0.09)] text-[var(--warning)]',
  failed: 'border-[rgba(224,47,53,0.22)] bg-[rgba(224,47,53,0.08)] text-[var(--danger)]',
}

export const ImportSummaryCards = ({ summary }) => {
  const items = [
    { id: 'received', label: 'Arquivos recebidos', value: summary.received, icon: <Icons.Upload /> },
    { id: 'imported', label: 'Importados', value: summary.imported, icon: <Icons.CheckCircle /> },
    { id: 'warning', label: 'Importados com avisos', value: summary.warning, icon: <Icons.Alert /> },
    { id: 'failed', label: 'Não importados', value: summary.failed, icon: <Icons.Alert /> },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article key={item.id} className="app-card p-5">
          <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl border ${cardStyles[item.id]}`}>
            {item.icon}
          </div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{item.label}</p>
          <p className="mt-2 text-3xl font-semibold leading-none text-[var(--text-primary)]">{formatNumber(item.value)}</p>
        </article>
      ))}
    </div>
  )
}
