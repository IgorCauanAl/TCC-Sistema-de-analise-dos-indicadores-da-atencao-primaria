import { Icons } from '../ui/Icons'
import tccHealthSymbol from '../../assets/tcc-health-symbol.png'
import { DASHBOARD_CONTEXT } from '../../data/dashboardSituationData'

export const Sidebar = ({ activeModule, menuItems, onChangeModule }) => {
  const daysUntilQuadrimesterEnd = DASHBOARD_CONTEXT.daysUntilClose

  return (
    <aside className="sticky top-0 flex h-screen w-[260px] max-w-[76vw] shrink-0 flex-col border-r border-white/15 bg-[#0F3A5D] text-white">
      <div className="flex h-[72px] items-center border-b border-white/15 px-5">
        <img
          src={tccHealthSymbol}
          alt=""
          className="mr-2.5 h-9 w-9 shrink-0 object-contain"
          aria-hidden="true"
        />
        <div className="ml-1">
          <h1 className="text-base font-semibold leading-tight tracking-normal text-white">Prototipo Visual TCC</h1>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-5" aria-label="Módulos do sistema">
        <ul className="space-y-2 px-3">
          {menuItems.map((item, index) => (
            <li key={item.id} className="group">
              <button
                type="button"
                onClick={() => onChangeModule(item.id)}
                aria-current={activeModule === item.id ? 'page' : undefined}
                aria-label={`${item.label}${index < 8 ? `. Atalho Alt mais ${index + 1}` : ''}`}
                title={index < 8 ? `Atalho Alt+${index + 1}` : undefined}
                className={`relative flex min-h-12 w-full items-center rounded-xl px-3.5 py-2.5 text-left transition-colors ${
                  activeModule === item.id
                    ? 'bg-white text-slate-900 font-semibold shadow-sm before:absolute before:left-0 before:top-2 before:h-8 before:w-1 before:rounded-r-full before:bg-[#0F3A5D]'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className={`mr-3 shrink-0 ${activeModule === item.id ? 'text-slate-900' : 'text-slate-400 group-hover:text-white'}`}>{item.icon}</span>
                <span className="text-[15px] font-semibold leading-snug">{item.label}</span>
                {index < 8 && (
                  <span className="ml-auto rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[0.68rem] font-medium text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true">
                    Alt+{index + 1}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-5 mb-5 rounded-2xl bg-[#0F3A5D] p-4 text-white shadow-[0_10px_24px_rgba(15,58,93,0.18)]">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
          <Icons.Calendar />
          <span>2º quadrimestre 2026</span>
        </div>
        <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-white" style={{ width: `${Math.min(100, Math.max(12, (daysUntilQuadrimesterEnd / 90) * 100))}%` }} />
        </div>
        <div className="flex items-end justify-between gap-3">
          <span className="text-[54px] font-semibold leading-[0.9] text-white">{daysUntilQuadrimesterEnd}</span>
          <span className="pb-1 text-[11px] font-medium leading-tight text-white">dias restantes para o fechamento</span>
        </div>
      </div>
    </aside>
  )
}
