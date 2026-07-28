export const StatusBadge = ({ type }) => {
  const styles = {
    'Fluxo adequado': 'border-[rgba(6,154,88,0.24)] bg-[rgba(6,154,88,0.08)] text-[var(--success)] before:bg-[var(--success)]',
    Atenção: 'border-[rgba(240,132,0,0.28)] bg-[rgba(240,132,0,0.1)] text-[var(--warning)] before:bg-[var(--warning)]',
    'Cuidado programado fragilizado': 'border-[rgba(229,109,34,0.28)] bg-[rgba(229,109,34,0.1)] text-[var(--alert)] before:bg-[var(--alert)]',
    'Cuidado Programado Fragilizado': 'border-[rgba(229,109,34,0.28)] bg-[rgba(229,109,34,0.1)] text-[var(--alert)] before:bg-[var(--alert)]',
    'Produção insuficiente': 'border-[rgba(224,47,53,0.24)] bg-[rgba(224,47,53,0.08)] text-[var(--danger)] before:bg-[var(--danger)]',
    'Prazo crítico': 'border-[rgba(224,47,53,0.3)] bg-[rgba(224,47,53,0.1)] text-[var(--danger)] before:bg-[var(--danger)]',
    pendente: 'border-[rgba(224,47,53,0.24)] bg-[rgba(224,47,53,0.08)] text-[var(--danger)] before:bg-[var(--danger)]',
    corrigido: 'border-[rgba(6,154,88,0.24)] bg-[rgba(6,154,88,0.08)] text-[var(--success)] before:bg-[var(--success)]',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none before:h-1.5 before:w-1.5 before:rounded-full ${styles[type] || 'border-[rgba(22,103,232,0.2)] bg-[rgba(22,103,232,0.08)] text-[var(--primary-dark)] before:bg-[var(--primary)]'}`}>
      {type}
    </span>
  )
}
