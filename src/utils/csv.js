function escapeCell(value) {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Exports an array of flat objects to a CSV file and triggers a download.
 * @param {string} filename
 * @param {Array<Record<string, any>>} rows
 * @param {Array<{key:string,label:string}>} [columns] optional explicit column set
 */
export function exportToCSV(filename, rows, columns) {
  if (!rows || rows.length === 0) return;
  const cols = columns || Object.keys(rows[0]).map((key) => ({ key, label: key }));

  const header = cols.map((c) => escapeCell(c.label)).join(',');
  const lines = rows.map((row) => cols.map((c) => escapeCell(row[c.key])).join(','));
  const csv = [header, ...lines].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
