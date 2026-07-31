export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

/** Returns an array of the last n ISO dates, oldest first (inclusive of today). */
export function lastNDates(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i -= 1) out.push(isoDaysAgo(i));
  return out;
}

export function formatDateLabel(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export function formatMonthLabel(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
}

export function monthKey(iso) {
  return iso.slice(0, 7); // YYYY-MM
}

export function formatINR(n) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    n || 0
  );
}

export function formatNumber(n, digits = 0) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: digits }).format(n || 0);
}
