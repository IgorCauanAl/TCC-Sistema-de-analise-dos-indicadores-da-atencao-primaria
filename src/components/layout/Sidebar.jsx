import { Icons } from '../ui/Icons'
import tccHealthSymbol from '../../assets/tcc-health-symbol.png'

const getDaysUntilQuadrimesterEnd = () => {
  const today = new Date()
  const currentMonth = today.getMonth()
  const endMonth = currentMonth < 4 ? 3 : currentMonth < 8 ? 7 : 11
  const endDate = new Date(today.getFullYear(), endMonth + 1, 0)
  const todayStart = new Date(today.getFullYear(), currentMonth, today.getDate())
  const millisecondsPerDay = 1000 * 60 * 60 * 24

  return Math.max(0, Math.ceil((endDate - todayStart) / millisecondsPerDay))
}

export const Sidebar = ({ activeModule, menuItems, onChangeModule }) => {
  const daysUntilQuadrimesterEnd = getDaysUntilQuadrimesterEnd()

  return (
    <aside className="sticky top-0 flex h-screen w-[260px] max-w-[76vw] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--sidebar)] text-[var(--text-primary)]">
      <div className="flex h-[72px] items-center border-b border-[var(--border)] px-5">
        <img
          src={tccHealthSymbol}
          alt=""
          className="mr-2.5 h-9 w-9 shrink-0 object-contain"
          aria-hidden="true"
        />
        <div className="ml-1">
          <h1 className="text-base font-semibold leading-tight tracking-normal text-[var(--primary-dark)]">Prototipo Visual TCC</h1>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-5">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onChangeModule(item.id)}
                className={`relative flex min-h-12 w-full items-center rounded-xl px-3.5 py-2.5 text-left transition-colors ${
                  activeModule === item.id
                    ? 'bg-[var(--surface-interactive)] text-[var(--primary)] before:absolute before:left-0 before:top-2 before:h-8 before:w-1 before:rounded-r-full before:bg-[var(--primary)]'
                    : 'text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--primary)]'
                }`}
              >
                <span className={`mr-3 shrink-0 ${activeModule === item.id ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]'}`}>{item.icon}</span>
                <span className="text-sm font-medium leading-snug">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-5 mb-5 rounded-2xl border border-[#b9d2f4] bg-[#f7fbff] p-5 text-center">
        <div className="mb-3 flex items-center justify-center gap-2 text-[var(--primary)]">
          <Icons.Calendar />
          <p className="text-xs font-semibold uppercase tracking-normal text-[var(--text-primary)]">2º Quadrimestre</p>
        </div>
        <p className="text-5xl font-semibold leading-none text-[var(--primary-dark)]">{daysUntilQuadrimesterEnd}</p>
        <p className="mx-auto mt-3 max-w-32 text-sm leading-5 text-[var(--text-primary)]">dias restantes para o fechamento</p>
      </div>
    </aside>
  )
}
