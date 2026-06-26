import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Gift, Loader2 } from 'lucide-react';
import { fetchMyDonations, cancelDonation } from '../../store/donationSlice';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatDate } from '../../utils/helpers';

const TABS = [
  { key: 'all',       label: 'All'       },
  { key: 'pending',   label: 'Pending'   },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
];

export default function DonationsList() {
  const dispatch = useDispatch();
  const { donations, status } = useSelector((s) => s.donations);
  const [activeTab, setActiveTab]   = useState('all');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling,   setCancelling]   = useState(false);

  useEffect(() => {
    dispatch(fetchMyDonations());
  }, [dispatch]);

  const filtered = activeTab === 'all'
    ? donations
    : donations.filter((d) => d.status === activeTab);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    await dispatch(cancelDonation(cancelTarget.id));
    setCancelling(false);
    setCancelTarget(null);
  };

  const loading = status === 'loading';

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Donations</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track gear you've donated or listed as free.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
          {TABS.map(({ key, label }) => {
            const count = key === 'all' ? donations.length : donations.filter((d) => d.status === key).length;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${activeTab === key
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
              >
                {label}
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold
                  ${activeTab === key ? 'bg-primary/10 text-primary' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden">
          {/* Desktop header */}
          <div className="hidden md:grid grid-cols-[1fr_160px_160px_110px_100px] gap-4 px-6 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70">
            {['Gear', 'Donated On', 'Recipient', 'Status', ''].map((h) => (
              <span key={h} className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</span>
            ))}
          </div>

          {loading ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                  <div className="w-9 h-9 bg-slate-100 dark:bg-slate-700 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-48" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-28" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Gift size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-400 text-sm">
                {activeTab === 'all' ? 'No donations yet.' : `No ${activeTab} donations.`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map((donation) => (
                <div
                  key={donation.id}
                  className="flex flex-col md:grid md:grid-cols-[1fr_160px_160px_110px_100px] gap-2 md:gap-4 items-start md:items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  {/* Gear title */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                      <Gift size={16} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">
                        {donation.gear?.title || `Gear #${donation.gear_id}`}
                      </p>
                      <p className="text-xs text-slate-400 md:hidden">
                        {formatDate(donation.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <span className="hidden md:block text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(donation.created_at)}
                  </span>

                  {/* Recipient */}
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {donation.recipient_name || <span className="text-slate-300 dark:text-slate-600">—</span>}
                  </span>

                  {/* Status */}
                  <StatusBadge status={donation.status} />

                  {/* Cancel */}
                  {donation.status === 'pending' && (
                    <button
                      onClick={() => setCancelTarget(donation)}
                      className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancel Donation?"
        message={`Cancel the donation for "${cancelTarget?.gear?.title || 'this gear'}"? This cannot be undone.`}
        confirmLabel={cancelling ? 'Cancelling…' : 'Cancel Donation'}
        destructive
        loading={cancelling}
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </>
  );
}
