import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Heart, Package, ArrowLeft, CalendarDays, Loader2, CheckCircle,
} from 'lucide-react';
import api from '../../api/axios';
import { addToWishlist, removeFromWishlist, requestRental } from '../../store/rentalSlice';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function GearDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, role } = useSelector((s) => s.auth);
  const { wishlist, requestStatus } = useSelector((s) => s.rentals);

  const [gear, setGear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rentDate, setRentDate]     = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isWishlisted = wishlist.includes(Number(id) || id);
  const isRenter = role === 'renter';

  useEffect(() => {
    setLoading(true);
    api.get(`/rain_gear/${id}`)
      .then((res) => setGear(res.data))
      .catch(() => toast.error('Could not load gear details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleWishlistToggle = () => {
    if (!user) { navigate('/login'); return; }
    const gearId = Number(id) || id;
    if (isWishlisted) {
      dispatch(removeFromWishlist(gearId));
      toast('Removed from wishlist', { icon: '💔' });
    } else {
      dispatch(addToWishlist(gearId));
      toast.success('Added to wishlist!');
    }
  };

  const handleRequestRental = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!rentDate || !returnDate) {
      toast.error('Please select both rent and return dates.');
      return;
    }
    if (new Date(returnDate) <= new Date(rentDate)) {
      toast.error('Return date must be after rent date.');
      return;
    }

    const result = await dispatch(requestRental({
      gear_id:     Number(id) || id,
      rent_date:   rentDate,
      return_date: returnDate,
      owner_id:    gear.owner_id,
    }));

    if (!result.error) {
      setSubmitted(true);
      toast.success('Rental request sent!');
    } else {
      toast.error('Failed to submit request. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!gear) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <p className="text-slate-500">Gear not found.</p>
        <button onClick={() => navigate('/browse')} className="mt-4 text-primary hover:underline">
          Back to Browse
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 px-4">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Main card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden">
        {/* Image */}
        <div className="relative h-64 bg-slate-100 dark:bg-slate-700">
          {gear.image_url ? (
            <img src={gear.image_url} alt={gear.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={48} className="text-slate-300" />
            </div>
          )}

          {/* Wishlist heart — visible to all logged-in users, prominent for renters */}
          {user && (
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                isWishlisted
                  ? 'bg-rose-500 text-white scale-110'
                  : 'bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:text-rose-500 hover:scale-110'
              }`}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          )}

          <div className="absolute bottom-4 left-4">
            <StatusBadge status={gear.available !== false ? 'available' : 'unavailable'} />
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{gear.title}</h1>
              {gear.category && (
                <p className="text-sm text-primary font-medium mt-1">{gear.category}</p>
              )}
            </div>
          </div>

          {gear.description && (
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{gear.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
            {gear.condition && (
              <span>Condition: <span className="font-medium text-slate-700 dark:text-slate-300">{gear.condition}</span></span>
            )}
            {gear.size && (
              <span>Size: <span className="font-medium text-slate-700 dark:text-slate-300">{gear.size}</span></span>
            )}
            {gear.location && (
              <span>Location: <span className="font-medium text-slate-700 dark:text-slate-300">{gear.location}</span></span>
            )}
          </div>
        </div>
      </div>

      {/* Request to Rent panel — only for renters (or logged-out users who are prompted to log in) */}
      {isRenter && gear.available !== false && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <CalendarDays size={18} className="text-primary" />
            Request to Rent
          </h2>

          {submitted ? (
            <div className="flex flex-col items-center text-center py-6 gap-3">
              <CheckCircle size={40} className="text-emerald-500" />
              <p className="font-semibold text-slate-800 dark:text-slate-100">Request submitted!</p>
              <p className="text-sm text-slate-500">The gear owner will review your request shortly.</p>
              <button
                onClick={() => navigate('/renter/rentals')}
                className="mt-2 px-5 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                View My Rentals
              </button>
            </div>
          ) : (
            <form onSubmit={handleRequestRental} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Rent date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={rentDate}
                    onChange={(e) => setRentDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Return date
                  </label>
                  <input
                    type="date"
                    required
                    min={rentDate || new Date().toISOString().split('T')[0]}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={requestStatus === 'loading'}
                className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {requestStatus === 'loading' ? (
                  <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                ) : (
                  'Submit Rental Request'
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Prompt non-logged-in users */}
      {!user && gear.available !== false && (
        <div className="bg-primary/5 dark:bg-primary/10 rounded-3xl border border-primary/20 p-6 text-center">
          <p className="text-slate-700 dark:text-slate-300 font-medium mb-3">
            Sign in to request this gear or save it to your wishlist
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  );
}
