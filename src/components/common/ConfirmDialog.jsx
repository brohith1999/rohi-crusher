import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function ConfirmDialog({ open, title = 'Are you sure?', message, confirmLabel = 'Delete', onCancel, onConfirm }) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle className="font-display">{title}</DialogTitle>
      <DialogContent>
        <p className="text-sm text-quarry-500">{message}</p>
      </DialogContent>
      <DialogActions className="!px-6 !pb-4">
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disableElevation>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
