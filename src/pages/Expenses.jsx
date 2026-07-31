import ResourceManager from '../components/common/ResourceManager.jsx';
import { formatINR } from '../utils/dates.js';

const CATEGORIES = ['Diesel', 'Salary', 'Maintenance', 'Electricity', 'Other'];

export default function Expenses() {
  return (
    <ResourceManager
      entity="expenses"
      idPrefix="exp"
      title="Expenses"
      subtitle="Diesel, salary, maintenance and electricity costs"
      searchFields={(r) => [r.category, r.description]}
      filter={{ key: 'category', label: 'Category', options: CATEGORIES.map((c) => ({ value: c, label: c })) }}
      columns={[
        { key: 'date', label: 'Date', sortable: true },
        { key: 'category', label: 'Category' },
        { key: 'description', label: 'Description' },
        { key: 'amount', label: 'Amount', align: 'right', sortable: true, render: (r) => formatINR(r.amount) },
      ]}
      fields={[
        { key: 'date', label: 'Date', type: 'date', required: true },
        { key: 'category', label: 'Category', type: 'select', required: true, options: CATEGORIES.map((c) => ({ value: c, label: c })) },
        { key: 'description', label: 'Description', span: 2 },
        { key: 'amount', label: 'Amount (₹)', type: 'number', required: true },
      ]}
    />
  );
}
