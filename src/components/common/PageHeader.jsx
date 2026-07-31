export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
      <div>
        <h1 className="font-display text-2xl uppercase tracking-wide text-quarry-900 dark:text-quarry-50">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-quarry-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
