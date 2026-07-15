export const PageHeader = ({ title, subtitle }) => (
  <div className="mb-8">
    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
  </div>
)
