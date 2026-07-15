export const ProgressBar = ({ percent, colorClass = 'bg-blue-600' }) => (
  <div className="h-2.5 w-full rounded-full bg-gray-200">
    <div className={`${colorClass} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
  </div>
)
