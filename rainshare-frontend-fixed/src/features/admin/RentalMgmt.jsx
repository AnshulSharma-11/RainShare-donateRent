import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchAllRentals, approveRental, markReturned, flagOverdue } from '../../store/rentalSlice';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  active: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  returned: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export default function RentalMgmt() {
  const dispatch = useDispatch();
  const { rentals, rentalsStatus } = useSelector((s) => s.rentals) || {};
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => { dispatch(fetchAllRentals()); }, [dispatch]);

  const pendingRentals = useMemo(() => (rentals || []).filter((r) => r.status === 'pending'), [rentals]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAllPending = () => {
    setSelectedIds((prev) =>
      prev.length === pendingRentals.length ? [] : pendingRentals.map((r) => r.id)
    );
  };

  const handleApprove = async (rental) => {
    const res = await dispatch(approveRental(rental.id));
    if (res.error) toast.error('Failed to approve rental');
    else toast.success('Rental approved');
  };

  const handleBulkApprove = async () => {
    const results = await Promise.all(selectedIds.map((id) => dispatch(approveRental(id))));
    const failed = results.filter((r) => r.error).length;
    if (failed) toast.error(`${failed} rental(s) failed to approve`);
    else toast.success(`${selectedIds.length} rental(s) approved`);
    setSelectedIds([]);
  };

  const handleReturn = async (rental) => {
    const res = await dispatch(markReturned(rental.id));
    if (res.error) toast.error('Failed to mark as returned');
    else toast.success('Marked as returned');
  };

  const handleFlagOverdue = async (rental) => {
    const res = await dispatch(flagOverdue(rental.id));
    if (res.error) toast.error('Failed to flag rental as overdue');
    else toast.success('Rental flagged as overdue');
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Rental Management</h1>

      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {selectedIds.length} selected
          </span>
          <div className="flex gap-2">
            <button onClick={() => setSelectedIds([])} className="text-sm px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
              Clear
            </button>
            <button onClick={handleBulkApprove} className="text-sm px-3 py-1.5 rounded-lg bg-primary text-white hover:opacity-90">
              Bulk Approve
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="text-left px-5 py-2.5">
                  <input
                    type="checkbox"
                    checked={pendingRentals.length > 0 && selectedIds.length === pendingRentals.length}
                    onChange={toggleSelectAllPending}
                    disabled={pendingRentals.length === 0}
                  />
                </th>
                <th className="text-left font-medium px-5 py-2.5">Gear</th>
                <th className="text-left font-medium px-5 py-2.5">Renter</th>
                <th className="text-left font-medium px-5 py-2.5">Dates</th>
                <th className="text-left font-medium px-5 py-2.5">Status</th>
                <th className="text-right font-medium px-5 py-2.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {rentalsStatus === 'loading' && (
                <tr><td colSpan={6} className="px-5 py-6 text-center text-slate-400">Loading rentals…</td></tr>
              )}
              {(rentals || []).map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-5 py-3">
                    {r.status === 'pending' && (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(r.id)}
                        onChange={() => toggleSelect(r.id)}
                      />
                    )}
                  </td>
                  <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">{r.gear_name || r.gear?.name}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{r.renter_name}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                    {r.start_date ? new Date(r.start_date).toLocaleDateString() : '—'}
                    {' – '}
                    {r.end_date ? new Date(r.end_date).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLES[r.status] || ''}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right space-x-2">
                    {r.status === 'pending' && (
                      <button onClick={() => handleApprove(r)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 dark:bg-sky-900/20 dark:text-sky-400">
                        Approve
                      </button>
                    )}
                    {r.status === 'active' && (
                      <>
                        <button onClick={() => handleReturn(r)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400">
                          Mark Returned
                        </button>
                        <button onClick={() => handleFlagOverdue(r)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">
                          Flag Overdue
                        </button>
                      </>
                    )}
                    {(r.status === 'returned' || r.status === 'overdue') && (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {rentalsStatus !== 'loading' && (!rentals || rentals.length === 0) && (
                <tr><td colSpan={6} className="px-5 py-6 text-center text-slate-400">No rentals yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
