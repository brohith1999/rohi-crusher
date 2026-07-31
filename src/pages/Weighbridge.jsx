import { useMemo, useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem,
  IconButton, Tooltip, Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PrintIcon from '@mui/icons-material/PrintOutlined';
import { useData } from '../context/DataContext.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import DataTable from '../components/common/DataTable.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import { todayISO, formatNumber } from '../utils/dates.js';
import WeighSlip from '../components/print/WeighSlip.jsx';

const MATERIALS = ['Blue Metal 20mm', 'Blue Metal 40mm', 'M-Sand', 'P-Sand', 'Jelly 6mm', 'Dust'];

function emptyForm() {
  return {
    type: 'sale', vehicleId: '', customerId: '', supplierId: '', material: MATERIALS[0],
    gross: '', tare: '', date: todayISO(), time: new Date().toTimeString().slice(0, 5),
  };
}

export default function Weighbridge() {
  const { weighEntries, vehicles, customers, suppliers, company, addItem, updateItem, removeItem } = useData();
  const vehicleMap = Object.fromEntries(vehicles.map((v) => [v.id, v.number]));
  const customerMap = Object.fromEntries(customers.map((c) => [c.id, c.name]));
  const supplierMap = Object.fromEntries(suppliers.map((s) => [s.id, s.name]));

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [deleting, setDeleting] = useState(null);
  const [printing, setPrinting] = useState(null);

  useEffect(() => {
    if (formOpen) setForm(editing ? { ...editing } : emptyForm());
  }, [formOpen, editing]);

  const net = useMemo(() => {
    const g = Number(form.gross) || 0;
    const t = Number(form.tare) || 0;
    return Math.max(0, g - t);
  }, [form.gross, form.tare]);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(row) {
    setEditing(row);
    setFormOpen(true);
  }

  function handleSave() {
    if (!form.vehicleId || !form.gross || !form.tare) return;
    const payload = {
      ...form,
      gross: Number(form.gross),
      tare: Number(form.tare),
      net,
      customerId: form.type === 'sale' ? form.customerId || null : null,
      supplierId: form.type === 'purchase' ? form.supplierId || null : null,
    };
    if (editing) {
      updateItem('weighEntries', editing.id, payload);
    } else {
      const seq = weighEntries.length + 1;
      addItem('weighEntries', { ...payload, slipNo: `WB-${String(seq).padStart(5, '0')}` }, 'weigh');
    }
    setFormOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Weighbridge"
        subtitle="Gross / tare / net weight capture with printable slips"
        actions={
          <Button variant="contained" disableElevation startIcon={<AddIcon />} onClick={openAdd}>
            New Weighment
          </Button>
        }
      />

      <DataTable
        exportName="weighbridge-entries"
        searchFields={(r) => [r.slipNo, vehicleMap[r.vehicleId], r.material]}
        filter={{
          key: 'type',
          label: 'Type',
          options: [
            { value: 'sale', label: 'Sale' },
            { value: 'purchase', label: 'Purchase' },
          ],
        }}
        columns={[
          { key: 'slipNo', label: 'Slip No.', sortable: true },
          { key: 'date', label: 'Date', sortable: true },
          { key: 'time', label: 'Time' },
          { key: 'vehicleId', label: 'Vehicle', render: (r) => vehicleMap[r.vehicleId] || '—' },
          {
            key: 'type',
            label: 'Type',
            render: (r) => (
              <Chip
                size="small"
                label={r.type === 'sale' ? 'Sale' : 'Purchase'}
                color={r.type === 'sale' ? 'success' : 'default'}
                variant="outlined"
              />
            ),
          },
          {
            key: 'party',
            label: 'Party',
            render: (r) => (r.type === 'sale' ? customerMap[r.customerId] : supplierMap[r.supplierId]) || '—',
          },
          { key: 'material', label: 'Material' },
          { key: 'gross', label: 'Gross', align: 'right', render: (r) => formatNumber(r.gross) },
          { key: 'tare', label: 'Tare', align: 'right', render: (r) => formatNumber(r.tare) },
          {
            key: 'net',
            label: 'Net',
            align: 'right',
            sortable: true,
            render: (r) => <span className="font-mono-data font-semibold text-amber-signal-dark dark:text-amber-signal">{formatNumber(r.net)}</span>,
          },
        ]}
        rows={weighEntries}
        actions={(row) => (
          <div className="flex justify-end gap-1">
            <Tooltip title="Print slip">
              <IconButton size="small" onClick={() => setPrinting(row)}>
                <PrintIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => openEdit(row)}>
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
        <DialogTitle className="font-display">{editing ? 'Edit Weighment' : 'New Weighment'}</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <TextField
              select label="Entry Type" size="small" value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            >
              <MenuItem value="sale">Sale (Outgoing)</MenuItem>
              <MenuItem value="purchase">Purchase (Incoming)</MenuItem>
            </TextField>
            <TextField
              select label="Vehicle" size="small" value={form.vehicleId}
              onChange={(e) => setForm((f) => ({ ...f, vehicleId: e.target.value }))}
            >
              {vehicles.map((v) => (
                <MenuItem key={v.id} value={v.id}>{v.number}</MenuItem>
              ))}
            </TextField>

            {form.type === 'sale' ? (
              <TextField
                select label="Customer" size="small" value={form.customerId} className="sm:col-span-2"
                onChange={(e) => setForm((f) => ({ ...f, customerId: e.target.value }))}
              >
                {customers.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                select label="Supplier" size="small" value={form.supplierId} className="sm:col-span-2"
                onChange={(e) => setForm((f) => ({ ...f, supplierId: e.target.value }))}
              >
                {suppliers.map((s) => (
                  <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              select label="Material" size="small" value={form.material}
              onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))}
            >
              {MATERIALS.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </TextField>
            <div />

            <TextField
              label="Gross Weight" type="number" size="small" value={form.gross}
              onChange={(e) => setForm((f) => ({ ...f, gross: e.target.value }))}
            />
            <TextField
              label="Tare Weight" type="number" size="small" value={form.tare}
              onChange={(e) => setForm((f) => ({ ...f, tare: e.target.value }))}
            />

            <TextField
              label="Net Weight (auto)" size="small" value={formatNumber(net)}
              className="sm:col-span-2 font-mono-data"
              InputProps={{ readOnly: true }}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              label="Date" type="date" size="small" value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Time" type="time" size="small" value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </div>
        </DialogContent>
        <DialogActions className="!px-6 !pb-4">
          <Button onClick={() => setFormOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" disableElevation>Save</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleting}
        message={`Delete slip "${deleting?.slipNo}"? This cannot be undone.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          removeItem('weighEntries', deleting.id);
          setDeleting(null);
        }}
      />

      {printing && (
        <WeighSlip
          entry={printing}
          company={company}
          vehicleNo={vehicleMap[printing.vehicleId]}
          partyName={printing.type === 'sale' ? customerMap[printing.customerId] : supplierMap[printing.supplierId]}
          onClose={() => setPrinting(null)}
        />
      )}
    </div>
  );
}
