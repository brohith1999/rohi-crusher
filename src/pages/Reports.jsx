import { useMemo } from 'react';
import { Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import { useData } from '../context/DataContext.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import ChartCard from '../components/charts/ChartCard.jsx';
import StatCard from '../components/common/StatCard.jsx';
import { CHART_COLORS } from '../components/charts/chartSetup.js';
import { exportToCSV } from '../utils/csv.js';
import { lastNDates, formatDateLabel, formatINR, formatNumber } from '../utils/dates.js';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentsIcon from '@mui/icons-material/Payments';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

export default function Reports() {
  const { sales, purchases, expenses, production } = useData();

  const totals = useMemo(() => {
    const salesTotal = sales.reduce((s, r) => s + r.amount, 0);
    const purchaseTotal = purchases.reduce((s, r) => s + r.amount, 0);
    const expenseTotal = expenses.reduce((s, r) => s + r.amount, 0);
    const productionTotal = production.reduce((s, r) => s + r.quantityTons, 0);
    return { salesTotal, purchaseTotal, expenseTotal, productionTotal };
  }, [sales, purchases, expenses, production]);

  const trend = useMemo(() => {
    const days = lastNDates(30);
    const salesByDay = Object.fromEntries(days.map((d) => [d, 0]));
    const purchaseByDay = Object.fromEntries(days.map((d) => [d, 0]));
    const expenseByDay = Object.fromEntries(days.map((d) => [d, 0]));
    sales.forEach((s) => { if (salesByDay[s.date] !== undefined) salesByDay[s.date] += s.amount; });
    purchases.forEach((p) => { if (purchaseByDay[p.date] !== undefined) purchaseByDay[p.date] += p.amount; });
    expenses.forEach((e) => { if (expenseByDay[e.date] !== undefined) expenseByDay[e.date] += e.amount; });
    return {
      labels: days.map(formatDateLabel),
      datasets: [
        { label: 'Sales', data: days.map((d) => salesByDay[d]), borderColor: CHART_COLORS.success, backgroundColor: 'rgba(76,154,106,0.15)', fill: true, tension: 0.3, pointRadius: 1 },
        { label: 'Purchases', data: days.map((d) => purchaseByDay[d]), borderColor: CHART_COLORS.steel, backgroundColor: 'rgba(62,124,177,0.12)', fill: true, tension: 0.3, pointRadius: 1 },
        { label: 'Expenses', data: days.map((d) => expenseByDay[d]), borderColor: CHART_COLORS.danger, backgroundColor: 'rgba(209,72,63,0.12)', fill: true, tension: 0.3, pointRadius: 1 },
      ],
    };
  }, [sales, purchases, expenses]);

  const expenseByCategory = useMemo(() => {
    const byCat = {};
    expenses.forEach((e) => { byCat[e.category] = (byCat[e.category] || 0) + e.amount; });
    const labels = Object.keys(byCat);
    return {
      labels,
      datasets: [{
        data: labels.map((l) => byCat[l]),
        backgroundColor: [CHART_COLORS.amber, CHART_COLORS.steel, CHART_COLORS.success, CHART_COLORS.danger, '#8a969c'],
        borderWidth: 0,
      }],
    };
  }, [expenses]);

  const productionByMaterial = useMemo(() => {
    const byMat = {};
    production.forEach((p) => { byMat[p.material] = (byMat[p.material] || 0) + p.quantityTons; });
    const labels = Object.keys(byMat);
    return {
      labels,
      datasets: [{ label: 'Tons', data: labels.map((l) => Math.round(byMat[l])), backgroundColor: CHART_COLORS.amber, borderRadius: 6, maxBarThickness: 32 }],
    };
  }, [production]);

  function handleExportSummary() {
    exportToCSV('reports-summary', [
      { metric: 'Total Sales', value: totals.salesTotal },
      { metric: 'Total Purchases', value: totals.purchaseTotal },
      { metric: 'Total Expenses', value: totals.expenseTotal },
      { metric: 'Total Production (Tons)', value: totals.productionTotal },
    ], [{ key: 'metric', label: 'Metric' }, { key: 'value', label: 'Value' }]);
  }

  return (
    <div id="print-area">
      <PageHeader
        title="Reports"
        subtitle="Business performance across sales, purchase, expenses and production"
        actions={
          <div className="flex gap-2 no-print">
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportSummary}>Export CSV</Button>
            <Button variant="contained" disableElevation startIcon={<PrintIcon />} onClick={() => window.print()}>Print</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={ReceiptLongIcon} label="Total Sales" value={formatINR(totals.salesTotal)} accent="success" />
        <StatCard icon={ShoppingCartIcon} label="Total Purchases" value={formatINR(totals.purchaseTotal)} accent="steel" />
        <StatCard icon={PaymentsIcon} label="Total Expenses" value={formatINR(totals.expenseTotal)} accent="danger" />
        <StatCard icon={PrecisionManufacturingIcon} label="Total Production" value={`${formatNumber(totals.productionTotal)} T`} accent="amber" />
      </div>

      <div className="grid grid-cols-1 mb-4">
        <ChartCard title="Sales vs Purchases vs Expenses" sub="Last 30 days" type="line" data={trend} height={300} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Expense Breakdown" sub="By category, all time" type="doughnut" data={expenseByCategory} />
        <ChartCard title="Production by Material" sub="Tons, all time" type="bar" data={productionByMaterial} />
      </div>
    </div>
  );
}
