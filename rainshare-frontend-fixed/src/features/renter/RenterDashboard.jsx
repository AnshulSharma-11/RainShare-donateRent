import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Clipboard, CheckCircle2, AlertTriangle, Heart,
  ArrowRight, Package, Search,
} from 'lucide-react';
import { fetchMyRentals } from '../../store/rentalSlice';
import { fetchGears } from '../../store/gearSlice';
import { addToWishlist, removeFromWishlist } from '../../store/rentalSlice';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/helpers';

function StatCard({ icon: Icon, label, value, color, loading, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-card flex items-start gap-4 w-full text-left transition-transform hover:-translate-y-0.5 active:translate-y-0 ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
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
    </button>
  );
}

function GearQuickCard({ gear, isWishlisted, onToggleWishlist, onRequest }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden flex-shrink-0 w-48">
      <div className="relative h-28 bg-slate-100 dark:bg-slate-700">
        {gear.image_url ? (
          <img src={gear.image_url} alt={gear.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={28} className="text-slate-300" />
          </div>
        )}
        <button
          onClick={() => onToggleWishlist(gear.id)}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow ${
            isWishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 text-slate-400 hover:text-rose-500'
          }`}
        >
          <Heart size={13} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{gear.title}</p>
        <p className="text-xs text-slate-400 mt-0.5 truncate">{gear.category || 'Gear'}</p>
        <button
          onClick={() => onRequest(gear)}
          className="mt-2.5 w-full py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors"
        >
          Request to Rent
        </button>
      </div>
    </div>
  );
}

export default function RenterDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { myRentals, myRentalsStatus, wishlist } = useSelector((s) => s.rentals);
  const { items: gearItems, status: gearStatus } = useSelector((s) => s.gear);

  const loading = myRentalsStatus === 'loading';
  const gearLoading = gearStatus === 'loading';

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchMyRentals());
      dispatch(fetchGears({ available: true, _limit: 4, _sort: 'created_at', _order: 'desc' }));
    }
  }, [dispatch, user]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeRentals  = myRentals.filter((r) => r.status === 'active');
  const pastRentals    = myRentals.filter((r) => ['returned', 'completed'].includes(r.status));
  const overdueRentals = activeRentals.filter((r) => {
    if (!r.return_date) return false;
    return new Date(r.return_date) < today;
  });

  const newestGear = gearItems.slice(0, 4);

  const handleToggleWishlist = (gearId) => {
    if (wishlist.includes(gearId)) {
      dispatch(removeFromWishlist(gearId));
    } else {
      dispatch(addToWishlist(gearId));
    }
  };

  const handleRequestFromCard = (gear) => {
    navigate(`/gear/${gear.id}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your rentals.</p>
      </div>

      {/* Overdue alert banner */}
      {overdueRentals.length > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
          <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              {overdueRentals.length} overdue rental{overdueRentals.length > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
              Please contact the gear owners to arrange returns.
            </p>
            <ul className="mt-2 space-y-1">
              {overdueRentals.map((r) => (
                <li key={r.id} className="text-xs text-amber-600 dark:text-amber-500 flex items-center gap-1.5">
                  <span className="font-medium">{r.gear?.title || `Gear #${r.gear_id}`}</span>
                  <span>— due {formatDate(r.return_date)}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => navigate('/renter/rentals')}
            className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline flex-shrink-0"
          >
            View all →
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Clipboard}
          label="Active Rentals"
          value={activeRentals.length}
          color="bg-emerald-500"
          loading={loading}
          onClick={() => navigate('/renter/rentals')}
        />
        <StatCard
          icon={CheckCircle2}
          label="Past Rentals"
          value={pastRentals.length}
          color="bg-slate-400"
          loading={loading}
          onClick={() => navigate('/renter/rentals')}
        />
        <StatCard
          icon={AlertTriangle}
          label="Overdue"
          value={overdueRentals.length}
          color={overdueRentals.length > 0 ? 'bg-amber-500' : 'bg-slate-300'}
          loading={loading}
          onClick={overdueRentals.length > 0 ? () => navigate('/renter/rentals') : undefined}
        />
        <StatCard
          icon={Heart}
          label="Wishlist Items"
          value={wishlist.length}
          color="bg-rose-500"
          loading={false}
          onClick={() => navigate('/renter/wishlist')}
        />
      </div>

      {/* Quick browse strip */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Recently Added Gear</h2>
          <button
            onClick={() => navigate('/browse')}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Browse all <ArrowRight size={14} />
          </button>
        </div>

        {gearLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-48 h-52 rounded-2xl bg-slate-100 dark:bg-slate-700 animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : newestGear.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search size={32} className="text-slate-300 mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No gear available right now. Check back soon!</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {newestGear.map((gear) => (
              <GearQuickCard
                key={gear.id}
                gear={gear}
                isWishlisted={wishlist.includes(gear.id)}
                onToggleWishlist={handleToggleWishlist}
                onRequest={handleRequestFromCard}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recent rental activity */}
      {myRentals.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Recent Activity</h2>
            <button
              onClick={() => navigate('/renter/rentals')}
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {[...myRentals]
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 3)
              .map((rental) => (
                <div
                  key={rental.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {rental.gear?.image_url ? (
                      <img src={rental.gear.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Package size={16} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {rental.gear?.title || `Gear #${rental.gear_id}`}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(rental.rent_date)} → {formatDate(rental.return_date)}</p>
                  </div>
                  <StatusBadge status={rental.status} />
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
