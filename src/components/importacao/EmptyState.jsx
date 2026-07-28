export const EmptyState = ({ title, description, action }) => (
  <div className="app-card px-6 py-10 text-center">
    <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
    {description && <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
)
