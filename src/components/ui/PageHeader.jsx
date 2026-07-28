export const PageHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <h1 className="text-[1.375rem] font-semibold leading-tight text-[var(--text-primary)]">{title}</h1>
    {subtitle && <p className="mt-1.5 max-w-4xl text-sm leading-6 text-[var(--text-secondary)]">{subtitle}</p>}
  </div>
)
