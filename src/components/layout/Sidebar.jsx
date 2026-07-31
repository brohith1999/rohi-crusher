import { NavLink } from 'react-router-dom';
import { NAV_GROUPS } from '../../nav';
import { useData } from '../../context/DataContext.jsx';

export default function Sidebar({ open, onClose }) {
  const { company } = useData();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-72 shrink-0 flex flex-col
          bg-quarry-900 dark:bg-quarry-950 text-quarry-100 border-r border-quarry-700/60
          transform transition-transform duration-200 lg:static lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center gap-3 px-5 h-16 border-b border-quarry-700/60 shrink-0">
          <div className="h-9 w-9 rounded-md bg-amber-signal flex items-center justify-center font-display font-bold text-quarry-950 text-lg">
            SB
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm tracking-wide uppercase text-quarry-50 truncate">
              {company.name}
            </p>
            <p className="text-[11px] text-quarry-400 truncate">{company.tagline}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest uppercase text-quarry-500">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                       ${isActive
                         ? 'bg-amber-signal/15 text-amber-signal border-l-2 border-amber-signal'
                         : 'text-quarry-200 hover:bg-quarry-800 border-l-2 border-transparent'}`
                    }
                  >
                    <item.icon fontSize="small" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-quarry-700/60 text-[11px] text-quarry-500">
          Frontend demo &middot; data stored in this browser only
        </div>
      </aside>
    </>
  );
}
