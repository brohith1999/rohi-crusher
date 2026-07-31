import { Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { formatINR, formatNumber } from '../../utils/dates.js';

/**
 * @param {'invoice'|'challan'} mode
 */
export default function InvoicePrint({ mode, sale, company, customerName, productName, unit, onClose }) {
  const isInvoice = mode === 'invoice';
  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <div id="print-area" className="text-sm text-quarry-900">
          <div className="text-center mb-3">
            <p className="font-display font-bold text-lg uppercase">{company.name}</p>
            <p className="text-xs">{company.address}</p>
            <p className="text-xs">Ph: {company.phone} {company.gstin ? `· GSTIN: ${company.gstin}` : ''}</p>
          </div>
          <div className="perforated text-quarry-400 mb-3" />
          <p className="text-center font-display uppercase tracking-widest text-xs mb-3">
            {isInvoice ? 'Tax Invoice' : 'Delivery Challan'}
          </p>

          <table className="w-full text-sm mb-3">
            <tbody>
              <Row label={isInvoice ? 'Invoice No.' : 'Challan No.'} value={sale.invoiceNo} />
              <Row label="Date" value={sale.date} />
              <Row label="Customer" value={customerName || '—'} />
              <Row label="Material" value={productName || '—'} />
              <Row label="Quantity" value={`${formatNumber(sale.qty)} ${unit || ''}`} />
              {isInvoice && <Row label="Rate" value={formatINR(sale.rate)} />}
            </tbody>
          </table>

          {isInvoice && (
            <>
              <div className="perforated text-quarry-400 my-3" />
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-t border-dashed border-quarry-400">
                    <td className="py-1 font-semibold">Total Amount</td>
                    <td className="py-1 text-right font-bold font-mono-data text-base">{formatINR(sale.amount)}</td>
                  </tr>
                  <Row label="Paid" value={formatINR(sale.paid)} />
                  <Row label="Balance Due" value={formatINR(sale.balance)} />
                </tbody>
              </table>
            </>
          )}

          <div className="perforated text-quarry-400 my-3" />
          <p className="text-center text-[11px] text-quarry-500">Computer generated document · No signature required</p>
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
