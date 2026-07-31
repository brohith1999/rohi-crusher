import { Line, Bar, Doughnut } from 'react-chartjs-2';
import './chartSetup.js';
import { useThemeMode } from '../../context/ThemeContext.jsx';

const TYPE_MAP = { line: Line, bar: Bar, doughnut: Doughnut };

export default function ChartCard({ title, sub, type = 'line', data, options, height = 260 }) {
  const { isDark } = useThemeMode();
  const Comp = TYPE_MAP[type];
  const textColor = isDark ? '#c9d0d3' : '#5a6870';
  const gridColor = isDark ? 'rgba(138,150,156,0.12)' : 'rgba(90,104,112,0.10)';

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: type === 'doughnut',
        position: 'bottom',
        labels: { color: textColor, boxWidth: 10, font: { size: 11 } },
      },
      tooltip: {
        backgroundColor: isDark ? '#1e252b' : '#ffffff',
        titleColor: isDark ? '#e7e9e6' : '#14191d',
        bodyColor: isDark ? '#c9d0d3' : '#5a6870',
        borderColor: isDark ? '#2a333a' : '#e7e9e6',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales:
      type === 'doughnut'
        ? undefined
        : {
            x: { ticks: { color: textColor, font: { size: 11 } }, grid: { color: 'transparent' } },
            y: { ticks: { color: textColor, font: { size: 11 } }, grid: { color: gridColor }, beginAtZero: true },
          },
    ...options,
  };

  return (
    <div className="rounded-xl border border-quarry-200 dark:border-quarry-700 bg-white dark:bg-quarry-900 p-4">
      <div className="mb-3">
        <h3 className="font-display text-sm uppercase tracking-wide text-quarry-900 dark:text-quarry-50">{title}</h3>
        {sub && <p className="text-xs text-quarry-500">{sub}</p>}
      </div>
      <div style={{ height }}>
        <Comp data={data} options={baseOptions} />
      </div>
    </div>
  );
}
