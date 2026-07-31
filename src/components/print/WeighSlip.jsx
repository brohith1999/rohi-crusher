import { Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { formatNumber } from '../../utils/dates.js';

export default function WeighSlip({ entry, company, vehicleNo, partyName, onClose }) {
  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <div id="print-area" className="font-mono-data text-sm text-quarry-900">
          <div className="text-center mb-3">
            <p className="font-display font-bold text-lg uppercase">{company.name}</p>
            <p className="text-xs">{company.address}</p>
            <p className="text-xs">Ph: {company.phone} {company.gstin ? `· GSTIN: ${company.gstin}` : ''}</p>
          </div>
          <div className="perforated text-quarry-400 mb-3" />
          <p className="text-center font-display uppercase tracking-widest text-xs mb-3">Weighment Slip</p>

          <table className="w-full text-sm">
            <tbody>
              <Row label="Slip No." value={entry.slipNo} />
              <Row label="Date" value={entry.date} />
              <Row label="Time" value={entry.time} />
              <Row label="Vehicle No." value={vehicleNo || '—'} />
              <Row label={entry.type === 'sale' ? 'Customer' : 'Supplier'} value={partyName || '—'} />
              <Row label="Material" value={entry.material} />
              <Row label="Type" value={entry.type === 'sale' ? 'Sale (Outgoing)' : 'Purchase (Incoming)'} />
            </tbody>
          </table>

          <div className="perforated text-quarry-400 my-3" />

          <table className="w-full text-sm">
            <tbody>
              <Row label="Gross Wt." value={`${formatNumber(entry.gross)} kg`} />
              <Row label="Tare Wt." value={`${formatNumber(entry.tare)} kg`} />
              <tr className="border-t border-dashed border-quarry-400">
                <td className="py-1 font-semibold">Net Wt.</td>
                <td className="py-1 text-right font-bold text-base">{formatNumber(entry.net)} kg</td>
              </tr>
            </tbody>
          </table>

          <div className="perforated text-quarry-400 my-3" />
          <p className="text-center text-[11px] text-quarry-500">
            Computer generated slip · No signature required
          </p>
        </div>
      </DialogContent>
      <DialogActions className="no-print !px-6 !pb-4">
        <Button onClick={onClose} color="inherit">Close</Button>
        <Button onClick={() => window.print()} variant="contained" disableElevation startIcon={<PrintIcon />}>
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Row({ label, value }) {
  return (
    <tr>
      <td className="py-1 text-quarry-500">{label}</td>
      <td className="py-1 text-right font-medium">{value}</td>
    </tr>
  );
}
