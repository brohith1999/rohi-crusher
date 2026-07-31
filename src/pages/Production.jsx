import ResourceManager from '../components/common/ResourceManager.jsx';
import { formatNumber } from '../utils/dates.js';

const MACHINES = ['Primary Crusher - CR1', 'Secondary Crusher - CR2', 'VSI Sand Machine'];
const MATERIALS = ['Blue Metal 20mm', 'Blue Metal 40mm', 'M-Sand', 'P-Sand', 'Jelly 6mm', 'Dust'];

export default function Production() {
  return (
    <ResourceManager
      entity="production"
      idPrefix="prod"
      title="Crusher Production"
      subtitle="Daily shift-wise production, diesel and running hours"
      searchFields={(r) => [r.machine, r.material, r.shift]}
      filter={{
        key: 'shift',
        label: 'Shift',
        options: [
          { value: 'Day', label: 'Day' },
          { value: 'Night', label: 'Night' },
        ],
      }}
      columns={[
        { key: 'date', label: 'Date', sortable: true },
        { key: 'shift', label: 'Shift' },
        { key: 'machine', label: 'Machine' },
        { key: 'material', label: 'Material' },
        { key: 'quantityTons', label: 'Qty (T)', align: 'right', sortable: true, render: (r) => formatNumber(r.quantityTons) },
        { key: 'dieselLiters', label: 'Diesel (L)', align: 'right', render: (r) => formatNumber(r.dieselLiters) },
        { key: 'hours', label: 'Hours', align: 'right' },
      ]}
      fields={[
        { key: 'date', label: 'Date', type: 'date', required: true },
        {
          key: 'shift', label: 'Shift', type: 'select', required: true,
          options: [{ value: 'Day', label: 'Day' }, { value: 'Night', label: 'Night' }],
        },
        {
          key: 'machine', label: 'Machine', type: 'select', span: 2, required: true,
          options: MACHINES.map((m) => ({ value: m, label: m })),
        },
        {
          key: 'material', label: 'Material', type: 'select', required: true,
          options: MATERIALS.map((m) => ({ value: m, label: m })),
        },
        { key: 'quantityTons', label: 'Quantity (Tons)', type: 'number', required: true },
        { key: 'dieselLiters', label: 'Diesel Consumed (L)', type: 'number' },
        { key: 'hours', label: 'Running Hours', type: 'number' },
      ]}
    />
  );
}
