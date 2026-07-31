import { useMemo } from 'react';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ScaleIcon from '@mui/icons-material/Scale';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import PaymentsIcon from '@mui/icons-material/Payments';
import { useData } from '../context/DataContext.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import StatCard from '../components/common/StatCard.jsx';
import ChartCard from '../components/charts/ChartCard.jsx';
import { CHART_COLORS } from '../components/charts/chartSetup.js';
import { todayISO, lastNDates, formatDateLabel, formatMonthLabel, monthKey, formatINR, formatNumber } from '../utils/dates.js';

export default function Dashboard() {
  const { weighEntries, sales, purchases, production, expenses, products, company } = useData();
  const today = todayISO();

  const todayWeigh = useMemo(() => weighEntries.filter((w) => w.date === today), [weighEntries, today]);
  const todaySales = useMemo(() => sales.filter((s) => s.date === today), [sales, today]);
  const todayPurchases = useMemo(() => purchases.filter((p) => p.date === today), [purchases, today]);
  const todayProduction = useMemo(() => production.filter((p) => p.date === today), [production, today]);

  const stats = useMemo(() => {
    const vehiclesToday = new Set(todayWeigh.map((w) => w.vehicleId)).size;
    const salesAmt = todaySales.reduce((s, r) => s + r.amount, 0);
    const purchaseAmt = todayPurchases.reduce((s, r) => s + r.amount, 0);
    const productionTons = todayProduction.reduce((s, r) => s + r.quantityTons, 0);
    const dieselLiters = todayProduction.reduce((s, r) => s + r.dieselLiters, 0);
    const pending = sales.reduce((s, r) => s + (r.balance || 0), 0);
    return { vehiclesToday, salesAmt, purchaseAmt, productionTons, dieselLiters, pending };
  }, [todayWeigh, todaySales, todayPurchases, todayProduction, sales]);

  const dailySales = useMemo(() => {
    const days = lastNDates(14);
    const byDay = Object.fromEntries(days.map((d) => [d, 0]));
    sales.forEach((s) => {
      if (byDay[s.date] !== undefined) byDay[s.date] += s.amount;
    });
    return {
      labels: days.map(formatDateLabel),
      datasets: [
        {
          label: 'Sales (₹)',
          data: days.map((d) => byDay[d]),
          borderColor: CHART_COLORS.amber,
          backgroundColor: 'rgba(242,169,59,0.18)',
          fill: true,
          tension: 0.35,
          pointRadius: 2,
        },
      ],
    };
  }, [sales]);

  const monthlySales = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push(d.toISOString().slice(0, 7));
    }
    const byMonth = Object.fromEntries(months.map((m) => [m, 0]));
    sales.forEach((s) => {
      const mk = monthKey(s.date);
      if (byMonth[mk] !== undefined) byMonth[mk] += s.amount;
    });
    return {
      labels: months.map((m) => formatMonthLabel(`${m}-01`)),
      datasets: [
        {
          label: 'Sales (₹)',
          data: months.map((m) => byMonth[m]),
          backgroundColor: CHART_COLORS.steel,
          borderRadius: 6,
          maxBarThickness: 36,
        },
      ],
    };
  }, [sales]);

  const productionChart = useMemo(() => {
    const days = lastNDates(14);
    const byDay = Object.fromEntries(days.map((d) => [d, 0]));
    production.forEach((p) => {
      if (byDay[p.date] !== undefined) byDay[p.date] += p.quantityTons;
    });
    return {
      labels: days.map(formatDateLabel),
      datasets: [
        {
          label: 'Production (Tons)',
          data: days.map((d) => byDay[d]),
          backgroundColor: CHART_COLORS.success,
          borderRadius: 6,
          maxBarThickness: 22,
        },
      ],
    };
  }, [production]);

  const stockChart = useMemo(() => {
    const produced = {};
    production.forEach((p) => {
      produced[p.material] = (produced[p.material] || 0) + p.quantityTons;
    });
    const sold = {};
    sales.forEach((s) => {
      const prod = products.find((p) => p.id === s.productId);
      const name = prod?.name || 'Other';
      sold[name] = (sold[name] || 0) + s.qty;
    });
    const materials = Object.keys(produced);
    const stock = materials.map((m) => Math.max(0, Math.round((produced[m] || 0) - (sold[m] || 0))));
    return {
      labels: materials,
      datasets: [
        {
          data: stock,
          backgroundColor: [CHART_COLORS.amber, CHART_COLORS.steel, CHART_COLORS.success, CHART_COLORS.danger, '#8a969c', '#c9861f'],
          borderWidth: 0,
        },
      ],
    };
  }, [production, sales, products]);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={`${company.name} — ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`} />

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-7 gap-3 mb-6">
        <StatCard icon={LocalShippingIcon} label="Vehicles Today" value={stats.vehiclesToday} accent="steel" />
        <StatCard icon={ScaleIcon} label="Loads Today" value={todayWeigh.length} accent="amber" />
        <StatCard icon={ReceiptLongIcon} label="Sales Today" value={formatINR(stats.salesAmt)} accent="success" />
        <StatCard icon={ShoppingCartIcon} label="Purchases Today" value={formatINR(stats.purchaseAmt)} accent="steel" />
        <StatCard icon={PrecisionManufacturingIcon} label="Production Today" value={`${formatNumber(stats.productionTons)} T`} accent="amber" />
        <StatCard icon={LocalGasStationIcon} label="Diesel Today" value={`${formatNumber(stats.dieselLiters)} L`} accent="danger" />
        <StatCard icon={PaymentsIcon} label="Pending Payments" value={formatINR(stats.pending)} accent="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ChartCard title="Daily Sales" sub="Last 14 days" type="line" data={dailySales} />
        <ChartCard title="Monthly Sales" sub="Last 6 months" type="bar" data={monthlySales} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Production" sub="Tons crushed per day, last 14 days" type="bar" data={productionChart} />
        <ChartCard title="Stock" sub="Estimated closing stock by material" type="doughnut" data={stockChart} />
      </div>
    </div>
  );
}
