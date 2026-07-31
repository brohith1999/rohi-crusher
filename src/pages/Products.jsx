import ResourceManager from '../components/common/ResourceManager.jsx';
import { formatINR } from '../utils/dates.js';

export default function Products() {
  return (
    <ResourceManager
      entity="products"
      idPrefix="prd"
      title="Products"
      subtitle="Materials produced and sold by the crusher unit"
      searchFields={(r) => [r.name, r.unit]}
      columns={[
        { key: 'name', label: 'Material', sortable: true },
        { key: 'unit', label: 'Unit' },
        { key: 'rate', label: 'Rate', sortable: true, align: 'right', render: (r) => formatINR(r.rate) },
      ]}
      fields={[
        { key: 'name', label: 'Material Name', required: true, span: 2 },
        {
          key: 'unit',
          label: 'Unit',
          type: 'select',
          options: [
            { value: 'Ton', label: 'Ton' },
            { value: 'Load', label: 'Load' },
            { value: 'Cft', label: 'Cft' },
          ],
        },
        { key: 'rate', label: 'Standard Rate (₹)', type: 'number', required: true },
      ]}
    />
  );
}
