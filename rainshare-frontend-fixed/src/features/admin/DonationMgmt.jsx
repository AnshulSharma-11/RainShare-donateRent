import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchAllDonations, updateDonationStatus } from '../../store/donationSlice';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  confirmed: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

export default function DonationMgmt() {
  const dispatch = useDispatch();
  const { donations, donationsStatus } = useSelector((s) => s.donations) || {};

  useEffect(() => { dispatch(fetchAllDonations()); }, [dispatch]);

  const handleStatus = async (donation, status) => {
    const res = await dispatch(updateDonationStatus({ id: donation.id, status }));
    if (res.error) toast.error('Failed to update donation');
    else toast.success(`Donation marked as ${status}`);
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Donation Management</h1>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="text-left font-medium px-5 py-2.5">Gear</th>
                <th className="text-left font-medium px-5 py-2.5">Donor</th>
                <th className="text-left font-medium px-5 py-2.5">Date</th>
                <th className="text-left font-medium px-5 py-2.5">Status</th>
                <th className="text-right font-medium px-5 py-2.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {donationsStatus === 'loading' && (
                <tr><td colSpan={5} className="px-5 py-6 text-center text-slate-400">Loading donations…</td></tr>
              )}
              {(donations || []).map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">{d.gear_name || d.gear?.name}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{d.donor_name}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                    {d.created_at ? new Date(d.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLES[d.status] || ''}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right space-x-2">
                    {d.status === 'pending' && (
                      <button
                        onClick={() => handleStatus(d, 'confirmed')}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 dark:bg-sky-900/20 dark:text-sky-400"
                      >
                        Approve
                      </button>
                    )}
                    {d.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatus(d, 'completed')}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400"
                      >
                        Complete
                      </button>
                    )}
                    {d.status === 'completed' && (
                      <span className="text-xs text-slate-400">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
              {donationsStatus !== 'loading' && (!donations || donations.length === 0) && (
                <tr><td colSpan={5} className="px-5 py-6 text-center text-slate-400">No donations yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
