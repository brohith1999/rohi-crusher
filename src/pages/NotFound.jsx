import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <ReportGmailerrorredIcon sx={{ fontSize: 44 }} className="!text-amber-signal" />
      <h1 className="font-display text-2xl uppercase tracking-wide">Page not found</h1>
      <p className="text-sm text-quarry-500 max-w-sm">
        The page you're looking for doesn't exist. Check the sidebar for available modules.
      </p>
      <Button component={Link} to="/" variant="contained" disableElevation className="!mt-2">
        Back to Dashboard
      </Button>
    </div>
  );
}
