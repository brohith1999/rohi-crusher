import ResourceManager from '../components/common/ResourceManager.jsx';

export default function Vehicles() {
  return (
    <ResourceManager
      entity="vehicles"
      idPrefix="veh"
      title="Vehicles"
      subtitle="Fleet used for loading and transport"
      searchFields={(r) => [r.number, r.category, r.ownerName]}
      filter={{
        key: 'type',
        label: 'Type',
        options: [
          { value: 'Own', label: 'Own' },
          { value: 'Hired', label: 'Hired' },
        ],
      }}
      columns={[
        { key: 'number', label: 'Vehicle No.', sortable: true },
        { key: 'category', label: 'Category' },
        { key: 'type', label: 'Type' },
        { key: 'ownerName', label: 'Owner' },
      ]}
      fields={[
        { key: 'number', label: 'Vehicle Number', required: true, span: 2 },
        { key: 'category', label: 'Category (e.g. Tipper 10 Ton)', span: 2 },
        {
          key: 'type',
          label: 'Type',
          type: 'select',
          options: [
            { value: 'Own', label: 'Own' },
            { value: 'Hired', label: 'Hired' },
          ],
          required: true,
        },
        { key: 'ownerName', label: 'Owner Name' },
      ]}
    />
  );
}
