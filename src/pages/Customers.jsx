import ResourceManager from '../components/common/ResourceManager.jsx';
import { formatINR } from '../utils/dates.js';

export default function Customers() {
  return (
    <ResourceManager
      entity="customers"
      idPrefix="cus"
      title="Customers"
      subtitle="Buyers of blue metal, sand and aggregates"
      searchFields={(r) => [r.name, r.phone, r.gstin, r.address]}
      columns={[
        { key: 'name', label: 'Name', sortable: true },
        { key: 'phone', label: 'Phone' },
        { key: 'address', label: 'Address' },
        { key: 'gstin', label: 'GSTIN' },
        {
          key: 'openingBalance',
          label: 'Opening Balance',
          sortable: true,
          align: 'right',
          render: (r) => formatINR(r.openingBalance),
        },
      ]}
      fields={[
        { key: 'name', label: 'Customer Name', required: true, span: 2 },
        { key: 'phone', label: 'Phone' },
        { key: 'gstin', label: 'GSTIN' },
        { key: 'address', label: 'Address', type: 'textarea', span: 2 },
        { key: 'openingBalance', label: 'Opening Balance (₹)', type: 'number' },
      ]}
    />
  );
}
