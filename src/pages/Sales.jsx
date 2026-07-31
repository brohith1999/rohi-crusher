import { useMemo, useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem,
  IconButton, Tooltip, Tabs, Tab, Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ReceiptIcon from '@mui/icons-material/ReceiptOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShippingOutlined';
import { useData } from '../context/DataContext.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import DataTable from '../components/common/DataTable.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import InvoicePrint from '../components/print/InvoicePrint.jsx';
import { todayISO, formatINR, formatNumber } from '../utils/dates.js';

function emptyForm() {
  return { customerId: '', productId: '', qty: '', rate: '', paid: '', date: todayISO() };
}

export default function Sales() {
  const { sales, customers, products, company, addItem, updateItem, removeItem } = useData();
  const customerMap = Object.fromEntries(customers.map((c) => [c.id, c.name]));
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

  const [tab, setTab] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [deleting, setDeleting] = useState(null);
  const [printJob, setPrintJob] = useState(null);
  const [ledgerCustomer, setLedgerCustomer] = useState(null);

  useEffect(() => {
    if (formOpen) setForm(editing ? { ...editing } : emptyForm());
  }, [formOpen, editing]);

  const amount = useMemo(() => Math.round((Number(form.qty) || 0) * (Number(form.rate) || 0)), [form.qty, form.rate]);
  const balance = useMemo(() => Math.max(0, amount - (Number(form.paid) || 0)), [amount, form.paid]);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }
  function handleSave() {
    if (!form.customerId || !form.productId || !form.qty || !form.rate) return;
    const payload = {
      ...form,
      qty: Number(form.qty),
      rate: Number(form.rate),
      paid: Number(form.paid) || 0,
      amount,
      balance,
    };
    if (editing) {
      updateItem('sales', editing.id, payload);
    } else {
      const seq = sales.length + 1;
      addItem('sales', { ...payload, invoiceNo: `INV-${String(seq).padStart(5, '0')}` }, 'sale');
    }
    setFormOpen(false);
  }

  const ledgerRows = useMemo(() => {
    return customers.map((c) => {
      const rows = sales.filter((s) => s.customerId === c.id);
      const invoiced = rows.reduce((s, r) => s + r.amount, 0);
      const paid = rows.reduce((s, r) => s + r.paid, 0);
      return {
        id: c.id,
        name: c.name,
        invoiceCount: rows.length,
        invoiced,
        paid,
        balance: c.openingBalance + invoiced - paid,
      };
    });
  }, [customers, sales]);

  const ledgerDetail = ledgerCustomer
    ? sales.filter((s) => s.customerId === ledgerCustomer.id).sort((a, b) => (a.date < b.date ? 1 : -1))
    : [];

  return (
    <div>
      <PageHeader
        title="Sales"
        subtitle="Invoices, delivery challans and customer ledger"
        actions={
          tab === 0 && (
            <Button variant="contained" disableElevation startIcon={<AddIcon />} onClick={openAdd}>
              New Invoice
            </Button>
          )
        }
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} className="mb-4">
        <Tab label="Invoices" />
        <Tab label="Customer Ledger" />
      </Tabs>

      {tab === 0 && (
        <DataTable
          exportName="sales-invoices"
          searchFields={(r) => [r.invoiceNo, customerMap[r.customerId]]}
          columns={[
            { key: 'invoiceNo', label: 'Invoice No.', sortable: true },
            { key: 'date', label: 'Date', sortable: true },
            { key: 'customerId', label: 'Customer', render: (r) => customerMap[r.customerId] || '—' },
            { key: 'product', label: 'Material', render: (r) => productMap[r.productId]?.name || '—' },
            { key: 'qty', label: 'Qty', align: 'right', render: (r) => formatNumber(r.qty) },
            { key: 'amount', label: 'Amount', align: 'right', sortable: true, render: (r) => formatINR(r.amount) },
            {
              key: 'balance',
              label: 'Balance',
              align: 'right',
              sortable: true,
              render: (r) => (
                <Chip
                  size="small"
                  label={formatINR(r.balance)}
                  color={r.balance > 0 ? 'error' : 'success'}
                  variant="outlined"
                />
              ),
            },
          ]}
          rows={sales}
          actions={(row) => (
            <div className="flex justify-end gap-1">
              <Tooltip title="Print invoice">
                <IconButton size="small" onClick={() => setPrintJob({ mode: 'invoice', sale: row })}>
                  <ReceiptIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print delivery challan">
                <IconButton size="small" onClick={() => setPrintJob({ mode: 'challan', sale: row })}>
                  <LocalShippingIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => { setEditing(row); setFormOpen(true); }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={() => setDeleting(row)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          )}
        />
      )}

      {tab === 1 && !ledgerCustomer && (
        <DataTable
          rows={ledgerRows}
          searchFields={(r) => [r.name]}
          exportName="customer-ledger"
          columns={[
            { key: 'name', label: 'Customer', sortable: true },
            { key: 'invoiceCount', label: 'Invoices', align: 'right' },
            { key: 'invoiced', label: 'Total Invoiced', align: 'right', render: (r) => formatINR(r.invoiced) },
            { key: 'paid', label: 'Total Paid', align: 'right', render: (r) => formatINR(r.paid) },
            {
              key: 'balance',
              label: 'Balance',
              align: 'right',
              sortable: true,
              render: (r) => (
                <Chip size="small" label={formatINR(r.balance)} color={r.balance > 0 ? 'error' : 'success'} variant="outlined" />
              ),
            },
          ]}
          actions={(row) => (
            <Button size="small" onClick={() => setLedgerCustomer(row)}>
              View
            </Button>
          )}
        />
      )}

      {tab === 1 && ledgerCustomer && (
        <div>
          <Button size="small" className="!mb-3" onClick={() => setLedgerCustomer(null)}>
            ← Back to all customers
          </Button>
          <DataTable
            rows={ledgerDetail}
            exportName={`ledger-${ledgerCustomer.name}`}
            columns={[
              { key: 'invoiceNo', label: 'Invoice No.' },
              { key: 'date', label: 'Date', sortable: true },
              { key: 'product', label: 'Material', render: (r) => productMap[r.productId]?.name || '—' },
              { key: 'amount', label: 'Amount', align: 'right', render: (r) => formatINR(r.amount) },
              { key: 'paid', label: 'Paid', align: 'right', render: (r) => formatINR(r.paid) },
              { key: 'balance', label: 'Balance', align: 'right', render: (r) => formatINR(r.balance) },
            ]}
            emptyMessage={`No invoices for ${ledgerCustomer.name} yet.`}
          />
        </div>
      )}

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="font-display">{editing ? 'Edit Invoice' : 'New Invoice'}</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <TextField
              select label="Customer" size="small" value={form.customerId} className="sm:col-span-2"
              onChange={(e) => setForm((f) => ({ ...f, customerId: e.target.value }))}
            >
              {customers.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </TextField>
            <TextField
              select label="Material" size="small" value={form.productId}
              onChange={(e) => {
                const p = productMap[e.target.value];
                setForm((f) => ({ ...f, productId: e.target.value, rate: p ? p.rate : f.rate }));
              }}
            >
              {products.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
            </TextField>
            <TextField
              label="Date" type="date" size="small" value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Quantity" type="number" size="small" value={form.qty}
              onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value }))}
            />
            <TextField
              label="Rate (₹)" type="number" size="small" value={form.rate}
              onChange={(e) => setForm((f) => ({ ...f, rate: e.target.value }))}
            />
            <TextField label="Amount (auto)" size="small" value={formatINR(amount)} InputProps={{ readOnly: true }} slotProps={{ inputLabel: { shrink: true } }} />
            <TextField
              label="Paid (₹)" type="number" size="small" value={form.paid}
              onChange={(e) => setForm((f) => ({ ...f, paid: e.target.value }))}
            />
            <TextField label="Balance (auto)" size="small" value={formatINR(balance)} InputProps={{ readOnly: true }} slotProps={{ inputLabel: { shrink: true } }} />
          </div>
        </DialogContent>
        <DialogActions className="!px-6 !pb-4">
          <Button onClick={() => setFormOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" disableElevation>Save</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleting}
        message={`Delete invoice "${deleting?.invoiceNo}"? This cannot be undone.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => { removeItem('sales', deleting.id); setDeleting(null); }}
      />

      {printJob && (
        <InvoicePrint
          mode={printJob.mode}
          sale={printJob.sale}
          company={company}
          customerName={customerMap[printJob.sale.customerId]}
          productName={productMap[printJob.sale.productId]?.name}
          unit={productMap[printJob.sale.productId]?.unit}
          onClose={() => setPrintJob(null)}
        />
      )}
    </div>
  );
}
