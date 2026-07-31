export default function StatCard({ icon: Icon, label, value, sub, accent = 'amber' }) {
  const accentMap = {
    amber: 'text-amber-signal bg-amber-signal/12',
    steel: 'text-steel bg-steel/12',
    success: 'text-success bg-success/12',
    danger: 'text-danger bg-danger/12',
  };
  return (
    <div className="relative rounded-xl border border-quarry-200 dark:border-quarry-700 bg-white dark:bg-quarry-900 p-4 overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-quarry-500">{label}</p>
          <p className="font-display font-mono-data text-2xl mt-1 tabular-nums text-quarry-900 dark:text-quarry-50">
            {value}
          </p>
          {sub && <p className="text-xs text-quarry-500 mt-0.5">{sub}</p>}
        </div>
        {Icon && (
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${accentMap[accent]}`}>
            <Icon fontSize="small" />
          </div>
        )}
      </div>
      <div className="perforated text-quarry-300 dark:text-quarry-700 absolute left-0 right-0 -bottom-px" />
    </div>
  );
}
