const tabs = [
  { id: 'prepare', label: 'Preparar importação' },
  { id: 'imported', label: 'Relatórios importados' },
  { id: 'problems', label: 'Relatórios com problemas' },
]

export const ImportTabs = ({ activeTab, onChange }) => (
  <div className="flex flex-wrap gap-2 border-b border-[var(--border)]" role="tablist" aria-label="Etapas da importação de relatórios">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        role="tab"
        aria-selected={activeTab === tab.id}
        onClick={() => onChange(tab.id)}
        className={`border-b-2 px-3 py-3 text-sm font-semibold transition ${
          activeTab === tab.id
            ? 'border-[var(--primary)] text-[var(--primary-dark)]'
            : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
)
