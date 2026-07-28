export const ProgressBar = ({ percent, colorClass = 'bg-[var(--primary)]' }) => (
  <div className="h-2.5 w-full rounded-full bg-[#edf2f8]">
    <div className={`${colorClass} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
  </div>
)
