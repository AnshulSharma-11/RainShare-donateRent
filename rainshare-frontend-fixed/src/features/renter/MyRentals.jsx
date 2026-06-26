import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Package, Calendar, Clock, AlertTriangle, Mail, XCircle, Loader2,
} from 'lucide-react';
import { fetchMyRentals, cancelRentalRequest } from '../../store/rentalSlice';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatDate } from '../../utils/helpers';

const TABS = [
  { key: 'active',    label: 'Active'    },
  { key: 'pending',   label: 'Pending'   },
  { key: 'completed', label: 'Completed' },
  { key: 'overdue',   label: 'Overdue'   },
];

function daysRemaining(returnDate) {
  if (!returnDate) return null;
  const diff = Math.ceil((new Date(returnDate) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
}

function DaysCountdown({ returnDate, overdue }) {
  const days = daysRemaining(returnDate);
  if (days === null) return null;

  if (overdue) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
        <AlertTriangle size={11} />
        {Math.abs(days)} day{Math.abs(days) !== 1 ? 's' : ''} overdue
      </span>
    );
  }

  const color =
    days <= 2  ? 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20' :
    days <= 7  ? 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20' :
                 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20';

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
      <Clock size={11} />
      {days} day{days !== 1 ? 's' : ''} left
    </span>
  );
}

function RentalCard({ rental, onCancel, cancelling }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isOverdue =
    rental.status === 'active' &&
    rental.return_date &&
    new Date(rental.return_date) < today;

  const isPending = rental.status === 'pending';

  const borderColor =
    isOverdue      ? 'border-l-amber-400' :
    isPending      ? 'border-l-sky-400'   :
    rental.status === 'active'    ? 'border-l-emerald-400' :
    rental.status === 'returned'  ? 'border-l-slate-300'   :
    rental.status === 'cancelled' ? 'border-l-red-300'     :
    rental.status === 'declined'  ? 'border-l-red-300'     :
    'border-l-slate-200';

  const ownerEmail = rental.gear?.owner_email || rental.owner_email;

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card border-l-4 ${borderColor} p-5 ${
        isOverdue ? 'ring-1 ring-amber-200 dark:ring-amber-800' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Gear image */}
        <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
          {rental.gear?.image_url ? (
            <img src={rental.gear.image_url} alt={rental.gear?.title} className="w-full h-full object-cover" />
          ) : (
            <Package size={20} className="text-slate-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
              {rental.gear?.title || `Gear #${rental.gear_id}`}
            </h3>
            <StatusBadge status={rental.status} />
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Owner:{' '}
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {rental.gear?.owner_name || rental.owner_name || `User #${rental.gear?.owner_id}`}
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-2.5">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar size={12} />
              {formatDate(rental.rent_date)} → {formatDate(rental.return_date)}
            </span>
            {(rental.status === 'active') && (
              <DaysCountdown returnDate={rental.return_date} overdue={isOverdue} />
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            {isPending && (
              <button
                onClick={() => onCancel(rental.id)}
                disabled={cancelling}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
              >
                {cancelling ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                Cancel Request
              </button>
            )}

            {isOverdue && ownerEmail && (
              <a
                href={`mailto:${ownerEmail}?subject=Overdue rental: ${rental.gear?.title}&body=Hi, I need to arrange returning the ${rental.gear?.title} (due ${formatDate(rental.return_date)}).`}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
              >
                <Mail size={12} />
                Contact Owner
              </a>
            )}
          </div>
        </div>
      </div>

      {isOverdue && (
        <div className="mt-3 pt-3 border-t border-amber-100 dark:border-amber-900/30 flex items-start gap-2">
          <AlertTriangle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            This rental is overdue. Please contact the owner to arrange its return as soon as possible.
          </p>
        </div>
      )}
    </div>
  );
}

export default function MyRentals() {
  const dispatch = useDispatch();
  const { myRentals, myRentalsStatus } = useSelector((s) => s.rentals);
  const { user } = useSelector((s) => s.auth);

  const [activeTab, setActiveTab] = useState('active');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (user?.id) dispatch(fetchMyRentals());
  }, [dispatch, user]);

  const loading = myRentalsStatus === 'loading';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const grouped = {
    active: myRentals.filter(
      (r) => r.status === 'active' && (!r.return_date || new Date(r.return_date) >= today)
    ),
    pending: myRentals.filter((r) => r.status === 'pending'),
    completed: myRentals.filter((r) => ['returned', 'completed', 'cancelled', 'declined'].includes(r.status)),
    overdue: myRentals.filter(
      (r) => r.status === 'active' && r.return_date && new Date(r.return_date) < today
    ),
  };

  const handleCancel = async (id) => {
    setCancellingId(id);
    await dispatch(cancelRentalRequest(id));
    setCancellingId(null);
    setCancelTarget(null);
  };

  const displayedRentals = grouped[activeTab] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">My Rentals</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track all your gear rental requests and active rentals.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full overflow-x-auto">
        {TABS.map((tab) => {
          const count = grouped[tab.key]?.length || 0;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 min-w-max flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              } ${tab.key === 'overdue' && grouped.overdue.length > 0 ? 'text-amber-600 dark:text-amber-400' : ''}`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab.key
                    ? 'bg-primary/10 text-primary'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                } ${tab.key === 'overdue' && count > 0 ? '!bg-amber-100 !text-amber-700 dark:!bg-amber-900/30 dark:!text-amber-400' : ''}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : displayedRentals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package size={40} className="text-slate-200 dark:text-slate-700 mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">No {activeTab} rentals</p>
          <p className="text-slate-400 text-sm mt-1">
            {activeTab === 'pending' ? 'Browse gear and submit a request to get started.' :
             activeTab === 'active'  ? 'No active rentals at the moment.' :
             activeTab === 'overdue' ? 'Great — no overdue rentals! 🎉' :
             'Your completed rentals will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedRentals.map((rental) => (
            <RentalCard
              key={rental.id}
              rental={rental}
              onCancel={(id) => setCancelTarget(id)}
              cancelling={cancellingId === rental.id}
            />
          ))}
        </div>
      )}

      {/* Cancel confirm dialog */}
      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancel Rental Request"
        message="Are you sure you want to cancel this rental request? This action cannot be undone."
        confirmLabel="Cancel Request"
        confirmVariant="danger"
        onConfirm={() => handleCancel(cancelTarget)}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
}
