import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

export default function EmptyState({ message = 'Nothing here yet.' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-quarry-500">
      <Inventory2OutlinedIcon sx={{ fontSize: 34 }} />
      <p className="text-sm">{message}</p>
    </div>
  );
}
