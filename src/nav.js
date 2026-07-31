import DashboardIcon from '@mui/icons-material/SpaceDashboard';
import PeopleIcon from '@mui/icons-material/Groups2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BadgeIcon from '@mui/icons-material/Badge';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ScaleIcon from '@mui/icons-material/Scale';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentsIcon from '@mui/icons-material/Payments';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import StoreIcon from '@mui/icons-material/Store';

export const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', path: '/', icon: DashboardIcon }],
  },
  {
    label: 'Master Data',
    items: [
      { label: 'Customers', path: '/customers', icon: PeopleIcon },
      { label: 'Suppliers', path: '/suppliers', icon: StoreIcon },
      { label: 'Vehicles', path: '/vehicles', icon: LocalShippingIcon },
      { label: 'Drivers', path: '/drivers', icon: BadgeIcon },
      { label: 'Products', path: '/products', icon: Inventory2Icon },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Weighbridge', path: '/weighbridge', icon: ScaleIcon },
      { label: 'Production', path: '/production', icon: PrecisionManufacturingIcon },
      { label: 'Stock', path: '/stock', icon: WarehouseIcon },
    ],
  },
  {
    label: 'Accounts',
    items: [
      { label: 'Sales', path: '/sales', icon: ReceiptLongIcon },
      { label: 'Purchase', path: '/purchase', icon: ShoppingCartIcon },
      { label: 'Expenses', path: '/expenses', icon: PaymentsIcon },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'Reports', path: '/reports', icon: BarChartIcon },
      { label: 'Settings', path: '/settings', icon: SettingsIcon },
    ],
  },
];

export const ALL_NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);
