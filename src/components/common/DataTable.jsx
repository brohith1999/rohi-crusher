import { useMemo, useState } from 'react';
import { TextField, Select, MenuItem, Pagination, IconButton, Tooltip } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DownloadIcon from '@mui/icons-material/Download';
import EmptyState from './EmptyState.jsx';
import { exportToCSV } from '../../utils/csv';

/**
 * @param {Array<{key:string,label:string,sortable?:boolean,align?:'left'|'right'|'center',render?:(row:any)=>any}>} columns
 * @param {Array<object>} rows
 * @param {(row:object)=>Array<string>} [searchFields] values considered for the search box
 * @param {{key:string,label:string,options:Array<{value:string,label:string}>}} [filter] optional single dropdown filter
 * @param {(row:object)=>JSX.Element} [actions]
 * @param {string} [exportName] if provided, shows a CSV export button
 */
export default function DataTable({
  columns,
  rows,
  searchFields,
  filter,
  actions,
  exportName,
  emptyMessage = 'No records yet.',
  pageSize = 8,
}) {
  const [query, setQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let out = rows;
    if (filter && filterValue !== 'all') {
      out = out.filter((r) => String(r[filter.key]) === filterValue);
    }
    const q = query.trim().toLowerCase();
    if (q && searchFields) {
      out = out.filter((r) => searchFields(r).some((v) => String(v ?? '').toLowerCase().includes(q)));
    }
    if (sortKey) {
      out = [...out].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
        return sortDir === 'asc'
          ? String(av ?? '').localeCompare(String(bv ?? ''))
          : String(bv ?? '').localeCompare(String(av ?? ''));
      });
    }
    return out;
  }, [rows, query, filterValue, sortKey, sortDir, filter, searchFields]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  return (
    <div className="rounded-xl border border-quarry-200 dark:border-quarry-700 bg-white dark:bg-quarry-900 overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 p-3 border-b border-quarry-200 dark:border-quarry-700">
        {searchFields && (
          <TextField
            size="small"
            placeholder="Search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="min-w-[200px]"
          />
        )}
        {filter && (
          <Select
            size="small"
            value={filterValue}
            onChange={(e) => {
              setFilterValue(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="all">All {filter.label}</MenuItem>
            {filter.options.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        )}
        <div className="flex-1" />
        <span className="text-xs text-quarry-500">{filtered.length} record{filtered.length === 1 ? '' : 's'}</span>
        {exportName && (
          <Tooltip title="Export CSV">
            <IconButton
              size="small"
              onClick={() =>
                exportToCSV(
                  exportName,
                  filtered,
                  columns.filter((c) => c.key !== 'actions').map((c) => ({ key: c.key, label: c.label }))
                )
              }
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-quarry-50 dark:bg-quarry-800/60 text-quarry-500 text-xs uppercase tracking-wide">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-2.5 font-semibold whitespace-nowrap ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => handleSort(col.key)}
                        className="inline-flex items-center gap-1 hover:text-amber-signal-dark dark:hover:text-amber-signal"
                      >
                        {col.label}
                        {sortKey === col.key &&
                          (sortDir === 'asc' ? (
                            <ArrowUpwardIcon sx={{ fontSize: 14 }} />
                          ) : (
                            <ArrowDownwardIcon sx={{ fontSize: 14 }} />
                          ))}
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
                {actions && <th className="px-4 py-2.5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paged.map((row, i) => (
                <tr
                  key={row.id ?? i}
                  className="border-t border-quarry-100 dark:border-quarry-800 hover:bg-quarry-50/70 dark:hover:bg-quarry-800/40"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-2.5 whitespace-nowrap ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      }`}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {actions && <td className="px-4 py-2.5 text-right">{actions(row)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > pageSize && (
        <div className="flex justify-center py-3 border-t border-quarry-100 dark:border-quarry-800">
          <Pagination count={pageCount} page={page} onChange={(_, p) => setPage(p)} size="small" shape="rounded" />
        </div>
      )}
    </div>
  );
}
