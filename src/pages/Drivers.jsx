import { useData } from '../context/DataContext.jsx';
import ResourceManager from '../components/common/ResourceManager.jsx';

export default function Drivers() {
  const { vehicles } = useData();
  const vehicleOptions = vehicles.map((v) => ({ value: v.id, label: v.number }));
  const vehicleMap = Object.fromEntries(vehicles.map((v) => [v.id, v.number]));

  return (
    <ResourceManager
      entity="drivers"
      idPrefix="drv"
      title="Drivers"
      subtitle="Assigned to vehicles for loading trips"
      searchFields={(r) => [r.name, r.phone, r.licenseNo]}
      columns={[
        { key: 'name', label: 'Name', sortable: true },
        { key: 'phone', label: 'Phone' },
        { key: 'licenseNo', label: 'License No.' },
        { key: 'vehicleId', label: 'Vehicle', render: (r) => vehicleMap[r.vehicleId] || '—' },
      ]}
      fields={[
        { key: 'name', label: 'Driver Name', required: true, span: 2 },
        { key: 'phone', label: 'Phone' },
        { key: 'licenseNo', label: 'License No.' },
        { key: 'vehicleId', label: 'Assigned Vehicle', type: 'select', options: vehicleOptions, span: 2 },
      ]}
    />
  );
}
