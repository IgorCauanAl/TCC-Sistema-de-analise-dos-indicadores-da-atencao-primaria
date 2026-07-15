export const StatusBadge = ({ type }) => {
  const styles = {
    'Fluxo adequado': 'bg-green-100 text-green-800',
    Atenção: 'bg-yellow-100 text-yellow-800',
    'Cuidado programado fragilizado': 'bg-orange-100 text-orange-800',
    'Cuidado Programado Fragilizado': 'bg-orange-100 text-orange-800',
    'Produção insuficiente': 'bg-red-100 text-red-800',
    'Prazo crítico': 'bg-red-200 text-red-900 font-bold',
    pendente: 'bg-red-100 text-red-800',
    corrigido: 'bg-green-100 text-green-800',
  }

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[type] || 'bg-gray-100 text-gray-800'}`}>
      {type}
    </span>
  )
}
