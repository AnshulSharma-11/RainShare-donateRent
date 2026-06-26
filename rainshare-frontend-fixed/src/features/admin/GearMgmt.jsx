import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { fetchGearList, fetchCategories, updateGearStatus, deleteGear } from '../../store/gearSlice';

const STATUS_STYLES = {
  available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  rented: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  unavailable: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
};

export default function GearMgmt() {
  const dispatch = useDispatch();
  const { gear, categories, gearStatus } = useSelector((s) => s.gear) || {};
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchGearList());
    dispatch(fetchCategories());
  }, [dispatch]);

  const filtered = useMemo(() => {
    return (gear || []).filter((g) => {
      const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || String(g.category_id) === String(categoryFilter);
      return matchesStatus && matchesCategory;
    });
  }, [gear, statusFilter, categoryFilter]);

  const handleStatusChange = async (item, status) => {
    const res = await dispatch(updateGearStatus({ id: item.id, status }));
    if (res.error) toast.error('Failed to update gear status');
    else toast.success(`"${item.name}" marked as ${status}`);
  };

  const handleDelete = async (item) => {
    const res = await dispatch(deleteGear(item.id));
    if (res.error) toast.error('Failed to delete gear');
    else toast.success(`"${item.name}" deleted`);
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Gear Management</h1>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="all">All statuses</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="unavailable">Unavailable</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="all">All categories</option>
            {(categories || []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="text-left font-medium px-5 py-2.5">Item</th>
                <th className="text-left font-medium px-5 py-2.5">Owner</th>
                <th className="text-left font-medium px-5 py-2.5">Category</th>
                <th className="text-left font-medium px-5 py-2.5">Status</th>
                <th className="text-right font-medium px-5 py-2.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {gearStatus === 'loading' && (
                <tr><td colSpan={5} className="px-5 py-6 text-center text-slate-400">Loading gear…</td></tr>
              )}
              {filtered.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">{g.name}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{g.owner_name || g.owner_id}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{g.category_name || '—'}</td>
                  <td className="px-5 py-3">
                    <select
                      value={g.status}
                      onChange={(e) => handleStatusChange(g, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full font-medium border-0 focus:ring-2 focus:ring-primary/40 ${STATUS_STYLES[g.status] || ''}`}
                    >
                      <option value="available">Available</option>
                      <option value="rented">Rented</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => setConfirmDelete(g)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {gearStatus !== 'loading' && filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-6 text-center text-slate-400">No gear matches your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Delete Gear</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Deleting "{confirmDelete.name}" will also cancel any pending or active rentals and donation
              records linked to it. This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:opacity-90">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
