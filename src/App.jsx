import { useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'
import { useThemeMode } from './context/ThemeContext.jsx'
import { buildMuiTheme } from './theme/muiTheme.js'
import Layout from './components/layout/Layout.jsx'

import Dashboard from './pages/Dashboard.jsx'
import Customers from './pages/Customers.jsx'
import Suppliers from './pages/Suppliers.jsx'
import Vehicles from './pages/Vehicles.jsx'
import Drivers from './pages/Drivers.jsx'
import Products from './pages/Products.jsx'
import Weighbridge from './pages/Weighbridge.jsx'
import Production from './pages/Production.jsx'
import Stock from './pages/Stock.jsx'
import Sales from './pages/Sales.jsx'
import Purchase from './pages/Purchase.jsx'
import Expenses from './pages/Expenses.jsx'
import Reports from './pages/Reports.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  const { mode } = useThemeMode()
  const muiTheme = useMemo(() => buildMuiTheme(mode), [mode])

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/weighbridge" element={<Weighbridge />} />
          <Route path="/production" element={<Production />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </MuiThemeProvider>
  )
}
