import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

export const CHART_COLORS = {
  amber: '#f2a93b',
  steel: '#3e7cb1',
  success: '#4c9a6a',
  danger: '#d1483f',
  grid: 'rgba(138,150,156,0.15)',
};
