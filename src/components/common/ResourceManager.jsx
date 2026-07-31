import { useState } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PageHeader from './PageHeader.jsx';
import DataTable from './DataTable.jsx';
import FormDialog from './FormDialog.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import { useData } from '../../context/DataContext.jsx';

/**
 * Fully reusable master-data CRUD page: table + add/edit form + delete confirm.
 * @param {string} entity data-context key, e.g. "customers"
 * @param {string} idPrefix short prefix used for generated ids
 * @param {string} title
 * @param {string} subtitle
 * @param {Array} columns DataTable columns
 * @param {Array} fields FormDialog field schema
 * @param {(row:object)=>Array<string>} searchFields
 * @param {object} [filter]
 * @param {(row:object)=>boolean} [canDelete] optional guard, e.g. block delete if referenced elsewhere
 */
export default function ResourceManager({
  entity, idPrefix, title, subtitle, columns, fields, searchFields, filter, canDelete,
}) {
  const data = useData();
  const rows = data[entity];
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [blockedMsg, setBlockedMsg] = useState('');

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(row) {
    setEditing(row);
    setFormOpen(true);
  }
  function handleSubmit(values) {
    if (editing) {
      data.updateItem(entity, editing.id, values);
    } else {
      data.addItem(entity, values, idPrefix);
    }
    setFormOpen(false);
  }
  function requestDelete(row) {
    if (canDelete && !canDelete(row)) {
      setBlockedMsg('This record is referenced elsewhere and cannot be deleted in the demo.');
      return;
    }
    setDeleting(row);
  }

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <Button variant="contained" disableElevation startIcon={<AddIcon />} onClick={openAdd}>
            Add {idPrefix ? title.slice(0, -1) : 'New'}
          </Button>
        }
      />

      {blockedMsg && (
        <div className="mb-3 text-sm px-3 py-2 rounded-lg bg-danger/10 text-danger">{blockedMsg}</div>
      )}

      <DataTable
        columns={columns}
        rows={rows}
        searchFields={searchFields}
        filter={filter}
        exportName={entity}
        actions={(row) => (
          <div className="flex justify-end gap-1">
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => openEdit(row)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={() => requestDelete(row)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        )}
      />

      <FormDialog
        open={formOpen}
        title={editing ? `Edit ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`}
        fields={fields}
        initialValues={editing}
        onCancel={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleting}
        message={`Delete "${deleting?.name || deleting?.number || deleting?.id}"? This cannot be undone.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          data.removeItem(entity, deleting.id);
          setDeleting(null);
        }}
      />
    </div>
  );
}
