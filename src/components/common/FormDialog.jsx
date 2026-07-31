import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, MenuItem,
} from '@mui/material';

/**
 * @param {Array<{key:string,label:string,type?:'text'|'number'|'select'|'date'|'time'|'textarea',options?:Array<{value,label}>,required?:boolean,span?:2}>} fields
 */
export default function FormDialog({ open, title, fields, initialValues, onCancel, onSubmit, submitLabel = 'Save' }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      const base = {};
      fields.forEach((f) => {
        base[f.key] = initialValues?.[f.key] ?? (f.type === 'number' ? '' : '');
      });
      setValues(base);
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues]);

  function setField(key, val) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function handleSubmit() {
    const nextErrors = {};
    fields.forEach((f) => {
      if (f.required && (values[f.key] === '' || values[f.key] === undefined || values[f.key] === null)) {
        nextErrors[f.key] = 'Required';
      }
    });
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    const cleaned = { ...values };
    fields.forEach((f) => {
      if (f.type === 'number') cleaned[f.key] = cleaned[f.key] === '' ? 0 : Number(cleaned[f.key]);
    });
    onSubmit(cleaned);
  }

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle className="font-display">{title}</DialogTitle>
      <DialogContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {fields.map((f) => {
            const spanCls = f.span === 2 ? 'sm:col-span-2' : '';
            if (f.type === 'select') {
              return (
                <TextField
                  key={f.key}
                  select
                  label={f.label}
                  size="small"
                  value={values[f.key] ?? ''}
                  onChange={(e) => setField(f.key, e.target.value)}
                  error={!!errors[f.key]}
                  helperText={errors[f.key]}
                  className={spanCls}
                >
                  {(f.options || []).map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }
            if (f.type === 'textarea') {
              return (
                <TextField
                  key={f.key}
                  label={f.label}
                  size="small"
                  multiline
                  minRows={2}
                  value={values[f.key] ?? ''}
                  onChange={(e) => setField(f.key, e.target.value)}
                  error={!!errors[f.key]}
                  helperText={errors[f.key]}
                  className={spanCls}
                />
              );
            }
            return (
              <TextField
                key={f.key}
                label={f.label}
                size="small"
                type={f.type || 'text'}
                value={values[f.key] ?? ''}
                onChange={(e) => setField(f.key, e.target.value)}
                error={!!errors[f.key]}
                helperText={errors[f.key]}
                className={spanCls}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            );
          })}
        </div>
      </DialogContent>
      <DialogActions className="!px-6 !pb-4">
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disableElevation>
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
