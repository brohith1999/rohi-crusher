import { useRef, useState } from 'react';
import { Button, TextField, Switch, FormControlLabel, Avatar, Chip } from '@mui/material';
import UploadIcon from '@mui/icons-material/UploadOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useData } from '../context/DataContext.jsx';
import { useThemeMode } from '../context/ThemeContext.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';

export default function Settings() {
  const { company, updateCompany, users, resetDemoData } = useData();
  const { isDark, toggle } = useThemeMode();
  const fileRef = useRef(null);
  const [form, setForm] = useState(company);
  const [saved, setSaved] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
    setSaved(false);
  }

  function handleSave() {
    updateCompany(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set('logoDataUrl', reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Company details, branding, appearance and demo users" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 rounded-xl border border-quarry-200 dark:border-quarry-700 bg-white dark:bg-quarry-900 p-5">
          <h2 className="font-display text-sm uppercase tracking-wide mb-4">Company Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label="Company Name" size="small" value={form.name} onChange={(e) => set('name', e.target.value)} className="sm:col-span-2" />
            <TextField label="Tagline" size="small" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} className="sm:col-span-2" />
            <TextField label="Address" size="small" multiline minRows={2} value={form.address} onChange={(e) => set('address', e.target.value)} className="sm:col-span-2" />
            <TextField label="Phone" size="small" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            <TextField label="Email" size="small" value={form.email} onChange={(e) => set('email', e.target.value)} />
            <TextField label="GSTIN" size="small" value={form.gstin} onChange={(e) => set('gstin', e.target.value)} className="sm:col-span-2" />
          </div>

          <div className="flex items-center gap-4 mt-5">
            <Avatar
              variant="rounded"
              src={form.logoDataUrl || undefined}
              sx={{ width: 56, height: 56, bgcolor: '#f2a93b', color: '#14191d', fontWeight: 700 }}
            >
              {!form.logoDataUrl && form.name?.slice(0, 2).toUpperCase()}
            </Avatar>
            <div>
              <Button size="small" variant="outlined" startIcon={<UploadIcon />} onClick={() => fileRef.current?.click()}>
                Upload Logo
              </Button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleLogoChange} />
              <p className="text-[11px] text-quarry-500 mt-1">PNG or JPG, stored locally in this browser.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <Button variant="contained" disableElevation onClick={handleSave}>Save Changes</Button>
            {saved && <span className="text-sm text-success">Saved.</span>}
          </div>
        </section>

        <div className="flex flex-col gap-4">
          <section className="rounded-xl border border-quarry-200 dark:border-quarry-700 bg-white dark:bg-quarry-900 p-5">
            <h2 className="font-display text-sm uppercase tracking-wide mb-3">Appearance</h2>
            <FormControlLabel
              control={<Switch checked={isDark} onChange={toggle} />}
              label={isDark ? 'Dark mode' : 'Light mode'}
            />
          </section>

          <section className="rounded-xl border border-quarry-200 dark:border-quarry-700 bg-white dark:bg-quarry-900 p-5">
            <h2 className="font-display text-sm uppercase tracking-wide mb-3">Users (Demo)</h2>
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-quarry-500">@{u.username}</p>
                  </div>
                  <Chip size="small" label={u.role} variant="outlined" />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-quarry-500 mt-3">
              Demo only — this project has no authentication or backend.
            </p>
          </section>

          <section className="rounded-xl border border-danger/30 bg-danger/5 p-5">
            <h2 className="font-display text-sm uppercase tracking-wide mb-2 text-danger">Reset Demo Data</h2>
            <p className="text-xs text-quarry-500 mb-3">
              Clears everything stored in this browser and reloads the original sample dataset.
            </p>
            <Button color="error" variant="outlined" startIcon={<RestartAltIcon />} onClick={() => setResetOpen(true)}>
              Reset to Sample Data
            </Button>
          </section>
        </div>
      </div>

      <ConfirmDialog
        open={resetOpen}
        title="Reset all demo data?"
        message="This clears every record stored in this browser (customers, weighments, sales, everything) and reloads the original sample dataset. This cannot be undone."
        confirmLabel="Reset"
        onCancel={() => setResetOpen(false)}
        onConfirm={resetDemoData}
      />
    </div>
  );
}
