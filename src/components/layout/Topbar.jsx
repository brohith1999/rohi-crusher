import { useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton, Tooltip } from '@mui/material';
import { useThemeMode } from '../../context/ThemeContext.jsx';
import { useData } from '../../context/DataContext.jsx';

export default function Topbar({ onMenuClick }) {
  const { isDark, toggle } = useThemeMode();
  const { customers, suppliers, vehicles, weighEntries } = useData();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const boxRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setFocused(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out = [];
    customers.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 3).forEach((c) =>
      out.push({ label: c.name, sub: 'Customer', path: '/customers' })
    );
    suppliers.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 3).forEach((s) =>
      out.push({ label: s.name, sub: 'Supplier', path: '/suppliers' })
    );
    vehicles.filter((v) => v.number.toLowerCase().includes(q)).slice(0, 3).forEach((v) =>
      out.push({ label: v.number, sub: 'Vehicle', path: '/vehicles' })
    );
    weighEntries.filter((w) => w.slipNo.toLowerCase().includes(q)).slice(0, 3).forEach((w) =>
      out.push({ label: w.slipNo, sub: 'Weigh Slip', path: '/weighbridge' })
    );
    return out.slice(0, 8);
  }, [query, customers, suppliers, vehicles, weighEntries]);

  return (
    <header className="h-16 shrink-0 border-b border-quarry-200 dark:border-quarry-700/60 bg-white dark:bg-quarry-900 flex items-center gap-3 px-4 sm:px-6">
      <IconButton className="lg:!hidden" onClick={onMenuClick} aria-label="Open menu">
        <MenuIcon />
      </IconButton>

      <div ref={boxRef} className="relative flex-1 max-w-md">
        <div className="flex items-center gap-2 rounded-lg bg-quarry-50 dark:bg-quarry-800 px-3 h-10 border border-quarry-200 dark:border-quarry-700">
          <SearchIcon fontSize="small" className="!text-quarry-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Search customers, vehicles, slip no..."
            className="bg-transparent outline-none text-sm w-full text-quarry-900 dark:text-quarry-100 placeholder:text-quarry-500"
          />
        </div>
        {focused && results.length > 0 && (
          <div className="absolute mt-1 w-full rounded-lg border border-quarry-200 dark:border-quarry-700 bg-white dark:bg-quarry-800 shadow-lg z-50 overflow-hidden">
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => {
                  navigate(r.path);
                  setFocused(false);
                  setQuery('');
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-quarry-50 dark:hover:bg-quarry-700 flex items-center justify-between"
              >
                <span className="text-quarry-900 dark:text-quarry-100">{r.label}</span>
                <span className="text-[11px] uppercase tracking-wide text-quarry-500">{r.sub}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

      <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
        <IconButton onClick={toggle} aria-label="Toggle theme">
          {isDark ? <LightModeIcon className="!text-amber-signal" /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
    </header>
  );
}
