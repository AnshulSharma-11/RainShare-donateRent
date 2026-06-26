import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Package, Gift, ArrowUpRight, Clock, Plus, TrendingUp } from 'lucide-react';
import { fetchGears } from '../../store/gearSlice';
import { fetchMyDonations } from '../../store/donationSlice';
import { fetchRentalRequestsForMyGear } from '../../store/rentalSlice';
import AddEditGearModal from './AddEditGearModal';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/helpers';

function StatCard({ icon: Icon, label, value, color, loading }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-card flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
        {loading ? (
          <div className="h-7 w-12 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse mt-1" />
        ) : (
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">{value}</p>
        )}
      </div>
    </div>
  );
}

export default function DonorDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { items: gearItems, status: gearStatus } = useSelector((s) => s.gear);
  const { donations, status: donationStatus } = useSelector((s) => s.donations);
  const { rentals, status: rentalStatus } = useSelector((s) => s.rentals);
  const [modalOpen, setModalOpen] = useState(false);

  const loading = gearStatus === 'loading' || donationStatus === 'loading' || rentalStatus === 'loading';

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchGears({ owner_id: user.id, limit: 100 }));
      dispatch(fetchMyDonations());
      dispatch(fetchRentalRequestsForMyGear());
    }
  }, [dispatch, user]);

  // Derived stats
  const totalListed    = gearItems.length;
  const totalDonated   = donations.length;
  const currentlyRented = rentals.filter((r) => r.status === 'active').length;
  const pendingRequests = rentals.filter((r) => r.status === 'pending').length;

  // Activity feed: combine recent rentals + donations, sort by date, take 5
  const activityItems = [
    ...rentals.map((r) => ({
      id: `rental-${r.id}`,
      type: 'rental',
      title: r.gear?.title || 'Unknown Gear',
      label: r.renter_name || 'Renter',
      status: r.status,
      date: r.created_at,
    })),
    ...donations.map((d) => ({
      id: `donation-${d.id}`,
      type: 'donation',
      title: d.gear?.title || 'Unknown Gear',
      label: d.recipient_name || '—',
      status: d.status,
      date: d.created_at,
    })),
  ]
    .filter((a) => a.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Welcome back, {user?.full_name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Here's what's happening with your gear.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Gear
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Package}     label="Gear Listed"        value={totalListed}    color="bg-primary"       loading={loading} />
          <StatCard icon={Gift}        label="Total Donated"      value={totalDonated}   color="bg-emerald-500"   loading={loading} />
          <StatCard icon={TrendingUp}  label="Currently Rented"   value={currentlyRented} color="bg-violet-500"   loading={loading} />
          <StatCard icon={Clock}       label="Pending Requests"   value={pendingRequests} color="bg-amber-500"    loading={loading} />
        </div>

        {/* Activity feed */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">Recent Activity</h2>
            <button
              onClick={() => navigate('/donor/rental-requests')}
              className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
            >
              View all <ArrowUpRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                  <div className="w-9 h-9 bg-slate-100 dark:bg-slate-700 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-48" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-28" />
                  </div>
                  <div className="h-5 bg-slate-100 dark:bg-slate-700 rounded-full w-20" />
                </div>
              ))}
            </div>
          ) : activityItems.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-slate-400 text-sm">No activity yet — add your first gear item!</p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-3 text-primary text-sm font-medium hover:underline"
              >
                Add gear now →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {activityItems.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    item.type === 'rental' ? 'bg-violet-100 dark:bg-violet-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'
                  }`}>
                    {item.type === 'rental'
                      ? <Package size={16} className="text-violet-600 dark:text-violet-400" />
                      : <Gift size={16} className="text-emerald-600 dark:text-emerald-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.type === 'rental' ? `Renter: ${item.label}` : `Recipient: ${item.label}`}
                      {item.date && ` · ${formatDate(item.date)}`}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Manage My Gear',       path: '/donor/my-gear',         color: 'border-primary/30 hover:bg-primary/5' },
            { label: 'View Donations',        path: '/donor/donations',       color: 'border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10' },
            { label: 'Rental Requests',       path: '/donor/rental-requests', color: 'border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/10' },
          ].map(({ label, path, color }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`text-left px-5 py-4 rounded-2xl border-2 bg-white dark:bg-slate-800 transition-colors ${color}`}
            >
              <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{label}</p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">Go to page <ArrowUpRight size={12} /></p>
            </button>
          ))}
        </div>
      </div>

      <AddEditGearModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
