import { Icons } from '../ui/Icons'

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
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-blue-900 text-white shadow-xl">
      <div className="flex items-center border-b border-blue-800 p-6">
        <Icons.Activity />
        <div className="ml-3">
          <h1 className="text-lg font-bold leading-tight">SAJ SAÚDE</h1>
          <p className="text-xs text-blue-300">Gestão APS</p>
        </div>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onChangeModule(item.id)}
                className={`flex w-full items-center rounded-md px-4 py-3 text-left transition-colors ${
                  activeModule === item.id
                    ? 'bg-blue-700 text-white shadow-inner'
                    : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-3 mb-4 rounded-md border border-blue-700 bg-blue-800/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">Dias para fechar o quadrimestre</p>
        <p className="mt-2 text-3xl font-bold leading-none text-white">{daysUntilQuadrimesterEnd}</p>
      </div>
    </aside>
  )
}
