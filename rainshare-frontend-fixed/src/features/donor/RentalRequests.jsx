import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, CheckCircle, XCircle, RotateCcw, Package, Loader2 } from 'lucide-react';
import {
  fetchRentalRequestsForMyGear,
  approveRental,
  declineRental,
  markReturned,
} from '../../store/rentalSlice';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatDate } from '../../utils/helpers';

const STATUS_ORDER = ['pending', 'active', 'returned', 'declined'];

function RentalCard({ rental, onApprove, onDecline, onReturn, actionLoading }) {
  const statusColor = {
    pending:  'border-l-amber-400',
    active:   'border-l-emerald-400',
    returned: 'border-l-slate-300',
    declined: 'border-l-red-300',
  }[rental.status] || 'border-l-slate-200';

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card border-l-4 ${statusColor} p-5`}>
      <div className="flex items-start gap-4">
        {/* Gear thumb */}
        <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
          {rental.gear?.image_url ? (
            <img src={rental.gear.image_url} alt={rental.gear.title} className="w-full h-full object-cover" />
          ) : (
            <Package size={20} className="text-slate-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">
              {rental.gear?.title || `Gear #${rental.gear_id}`}
            </h3>
            <StatusBadge status={rental.status} />
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Renter: <span className="text-slate-700 dark:text-slate-200 font-medium">{rental.renter_name || `User #${rental.renter_id}`}</span>
          </p>

          <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {rental.start_date ? formatDate(rental.start_date) : '—'}
              {rental.end_date && ` → ${formatDate(rental.end_date)}`}
            </span>
            <span>Requested {formatDate(rental.created_at)}</span>
          </div>

          {rental.message && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-700 rounded-lg px-3 py-2">
              "{rental.message}"
            </p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {rental.status === 'pending' && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={() => onApprove(rental)}
            disabled={actionLoading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors disabled:opacity-60"
          >
            {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            Approve
          </button>
          <button
            onClick={() => onDecline(rental)}
            disabled={actionLoading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors disabled:opacity-60"
          >
            <XCircle size={14} />
            Decline
          </button>
        </div>
      )}

      {rental.status === 'active' && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={() => onReturn(rental)}
            disabled={actionLoading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-violet-600 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-xl transition-colors disabled:opacity-60"
          >
            {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
            Mark Returned
          </button>
        </div>
      )}
    </div>
  );
}

export default function RentalRequests() {
  const dispatch = useDispatch();
  const { rentals, status, actionStatus } = useSelector((s) => s.rentals);

  const [confirmAction, setConfirmAction] = useState(null); // { type, rental }

  useEffect(() => {
    dispatch(fetchRentalRequestsForMyGear());
  }, [dispatch]);

  const handleConfirm = async () => {
    if (!confirmAction) return;
    const { type, rental } = confirmAction;
    if (type === 'approve')  await dispatch(approveRental(rental.id));
    if (type === 'decline')  await dispatch(declineRental(rental.id));
    if (type === 'returned') await dispatch(markReturned(rental.id));
    setConfirmAction(null);
  };

  const loading = status === 'loading';
  const actionLoading = actionStatus === 'loading';

  // Sort: pending first, then active, returned, declined
  const sorted = [...rentals].sort((a, b) => {
    const ai = STATUS_ORDER.indexOf(a.status);
    const bi = STATUS_ORDER.indexOf(b.status);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const pendingCount = rentals.filter((r) => r.status === 'pending').length;
  const activeCount  = rentals.filter((r) => r.status === 'active').length;

  const dialogConfig = {
    approve:  { title: 'Approve Rental?',     message: `Approve the rental request from ${confirmAction?.rental?.renter_name || 'this renter'}? They'll be notified and the gear will be marked as rented.`, confirmLabel: 'Approve', destructive: false },
    decline:  { title: 'Decline Request?',    message: `Decline this rental request from ${confirmAction?.rental?.renter_name || 'this renter'}?`, confirmLabel: 'Decline', destructive: true  },
    returned: { title: 'Confirm Return?',     message: `Mark this gear as returned by ${confirmAction?.rental?.renter_name || 'the renter'}?`, confirmLabel: 'Mark Returned', destructive: false },
  }[confirmAction?.type] || {};

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Rental Requests</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {pendingCount > 0 && (
                <span className="text-amber-600 dark:text-amber-400 font-medium">{pendingCount} pending · </span>
              )}
              {activeCount} active rental{activeCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-40" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-28" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-36" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card py-16 text-center">
            <Calendar size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-400 text-sm">No rental requests yet.</p>
            <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Requests for your gear will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {sorted.map((rental) => (
              <RentalCard
                key={rental.id}
                rental={rental}
                actionLoading={actionLoading}
                onApprove={(r) => setConfirmAction({ type: 'approve',  rental: r })}
                onDecline={(r) => setConfirmAction({ type: 'decline',  rental: r })}
                onReturn={(r)  => setConfirmAction({ type: 'returned', rental: r })}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmAction}
        title={dialogConfig.title}
        message={dialogConfig.message}
        confirmLabel={dialogConfig.confirmLabel}
        destructive={dialogConfig.destructive}
        loading={actionLoading}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );
}
