import { useMemo, useState } from 'react';
import { TextField } from '@mui/material';
import { useData } from '../context/DataContext.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import DataTable from '../components/common/DataTable.jsx';
import { formatNumber, isoDaysAgo, todayISO } from '../utils/dates.js';

export default function Stock() {
  const { products, production, sales } = useData();
  const [from, setFrom] = useState(isoDaysAgo(29));
  const [to, setTo] = useState(todayISO());

  const rows = useMemo(() => {
    return products.map((p) => {
      const opening = production
        .filter((r) => r.material === p.name && r.date < from)
        .reduce((s, r) => s + r.quantityTons, 0)
        - sales
          .filter((r) => r.productId === p.id && r.date < from)
          .reduce((s, r) => s + r.qty, 0);

      const producedInRange = production
        .filter((r) => r.material === p.name && r.date >= from && r.date <= to)
        .reduce((s, r) => s + r.quantityTons, 0);

      const soldInRange = sales
        .filter((r) => r.productId === p.id && r.date >= from && r.date <= to)
        .reduce((s, r) => s + r.qty, 0);

      const closing = opening + producedInRange - soldInRange;

      return {
        id: p.id,
        name: p.name,
        unit: p.unit,
        opening: Math.max(0, Math.round(opening)),
        production: Math.round(producedInRange),
        sales: Math.round(soldInRange),
        closing: Math.max(0, Math.round(closing)),
      };
    });
  }, [products, production, sales, from, to]);

  return (
    <div>
      <PageHeader
        title="Stock"
        subtitle="Opening, produced, sold and closing quantity by material"
        actions={
          <div className="flex items-center gap-2">
            <TextField
              size="small" type="date" label="From" value={from}
              onChange={(e) => setFrom(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              size="small" type="date" label="To" value={to}
              onChange={(e) => setTo(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </div>
        }
      />

      <DataTable
        exportName="stock-report"
        rows={rows}
        searchFields={(r) => [r.name]}
        columns={[
          { key: 'name', label: 'Material', sortable: true },
          { key: 'unit', label: 'Unit' },
          { key: 'opening', label: 'Opening', align: 'right', render: (r) => formatNumber(r.opening) },
          { key: 'production', label: 'Production', align: 'right', render: (r) => formatNumber(r.production) },
          { key: 'sales', label: 'Sales', align: 'right', render: (r) => formatNumber(r.sales) },
          {
            key: 'closing',
            label: 'Closing',
            align: 'right',
            sortable: true,
            render: (r) => <span className="font-mono-data font-semibold text-amber-signal-dark dark:text-amber-signal">{formatNumber(r.closing)}</span>,
          },
        ]}
      />
    </div>
  );
}
