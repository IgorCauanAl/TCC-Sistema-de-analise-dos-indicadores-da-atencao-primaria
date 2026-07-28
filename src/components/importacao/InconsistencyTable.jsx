import { EmptyState } from './EmptyState'

export const InconsistencyTable = ({ items }) => {
  if (!items.length) {
    return <EmptyState title="Nenhuma inconsistência encontrada" description="Este relatório não possui inconsistências registradas na importação." />
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="data-table">
        <thead>
          <tr>
            {['Tipo', 'Quantidade', 'Tratamento'].map((header) => <th key={header}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.type}>
              <td className="min-w-56">{item.type}</td>
              <td>{item.quantity}</td>
              <td>{item.treatment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
