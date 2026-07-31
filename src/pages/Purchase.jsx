import { useMemo, useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem,
  IconButton, Tooltip, Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useData } from '../context/DataContext.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import DataTable from '../components/common/DataTable.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import { todayISO, formatINR, formatNumber } from '../utils/dates.js';

const MATERIALS = ['Blue Metal 20mm', 'Blue Metal 40mm', 'M-Sand', 'P-Sand', 'Jelly 6mm', 'Dust', 'Raw Stone'];

function emptyForm() {
  return { supplierId: '', material: MATERIALS[0], qty: '', rate: '', paid: '', date: todayISO() };
}

export default function Purchase() {
  const { purchases, suppliers, addItem, updateItem, removeItem } = useData();
  const supplierMap = Object.fromEntries(suppliers.map((s) => [s.id, s.name]));

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (formOpen) setForm(editing ? { ...editing } : emptyForm());
  }, [formOpen, editing]);

  const amount = useMemo(() => Math.round((Number(form.qty) || 0) * (Number(form.rate) || 0)), [form.qty, form.rate]);
  const balance = useMemo(() => Math.max(0, amount - (Number(form.paid) || 0)), [amount, form.paid]);

  function handleSave() {
    if (!form.supplierId || !form.qty || !form.rate) return;
    const payload = {
      ...form,
      qty: Number(form.qty),
      rate: Number(form.rate),
      paid: Number(form.paid) || 0,
      amount,
      balance,
    };
    if (editing) {
      updateItem('purchases', editing.id, payload);
    } else {
      const seq = purchases.length + 1;
      addItem('purchases', { ...payload, billNo: `PB-${String(seq).padStart(5, '0')}` }, 'pur');
    }
    setFormOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Purchase"
        subtitle="Supplier bills and raw material purchases"
        actions={
          <Button variant="contained" disableElevation startIcon={<AddIcon />} onClick={() => { setEditing(null); setFormOpen(true); }}>
            New Bill
          </Button>
        }
      />

      <DataTable
        exportName="purchase-bills"
        searchFields={(r) => [r.billNo, supplierMap[r.supplierId], r.material]}
        columns={[
          { key: 'billNo', label: 'Bill No.', sortable: true },
          { key: 'date', label: 'Date', sortable: true },
          { key: 'supplierId', label: 'Supplier', render: (r) => supplierMap[r.supplierId] || '—' },
          { key: 'material', label: 'Material' },
          { key: 'qty', label: 'Qty', align: 'right', render: (r) => formatNumber(r.qty) },
          { key: 'amount', label: 'Amount', align: 'right', sortable: true, render: (r) => formatINR(r.amount) },
          {
            key: 'balance', label: 'Balance', align: 'right', sortable: true,
            render: (r) => <Chip size="small" label={formatINR(r.balance)} color={r.balance > 0 ? 'error' : 'success'} variant="outlined" />,
          },
        ]}
        rows={purchases}
        actions={(row) => (
          <div className="flex justify-end gap-1">
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

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="font-display">{editing ? 'Edit Bill' : 'New Bill'}</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <TextField
              select label="Supplier" size="small" value={form.supplierId} className="sm:col-span-2"
              onChange={(e) => setForm((f) => ({ ...f, supplierId: e.target.value }))}
            >
              {suppliers.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
            </TextField>
            <TextField
              select label="Material" size="small" value={form.material}
              onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))}
            >
              {MATERIALS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </TextField>
            <TextField
              label="Date" type="date" size="small" value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField label="Quantity" type="number" size="small" value={form.qty} onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value }))} />
            <TextField label="Rate (₹)" type="number" size="small" value={form.rate} onChange={(e) => setForm((f) => ({ ...f, rate: e.target.value }))} />
            <TextField label="Amount (auto)" size="small" value={formatINR(amount)} InputProps={{ readOnly: true }} slotProps={{ inputLabel: { shrink: true } }} />
            <TextField label="Paid (₹)" type="number" size="small" value={form.paid} onChange={(e) => setForm((f) => ({ ...f, paid: e.target.value }))} />
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
        message={`Delete bill "${deleting?.billNo}"? This cannot be undone.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => { removeItem('purchases', deleting.id); setDeleting(null); }}
      />
    </div>
  );
}
