import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Heart, Package, Loader2, Search } from 'lucide-react';
import { removeFromWishlist, requestRental } from '../../store/rentalSlice';
import api from '../../api/axios';
import toast from 'react-hot-toast';

function RainCloudIllustration() {
  return (
    <svg width="120" height="90" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="60" cy="42" rx="34" ry="24" fill="#E2E8F0" />
      <ellipse cx="42" cy="50" rx="22" ry="18" fill="#CBD5E1" />
      <ellipse cx="78" cy="48" rx="20" ry="16" fill="#CBD5E1" />
      <ellipse cx="60" cy="54" rx="30" ry="18" fill="#E2E8F0" />
      {/* Rain drops */}
      {[36, 50, 64, 44, 58, 72].map((x, i) => (
        <line
          key={i}
          x1={x} y1={74 + (i % 2) * 4}
          x2={x - 3} y2={84 + (i % 2) * 4}
          stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"
        />
      ))}
      <Heart
        x="46" y="36" width="28" height="28"
        fill="#FDA4AF" stroke="none"
      />
    </svg>
  );
}

function WishlistCard({ gear, onRemove, onRequest, requesting }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden group">
      {/* Image */}
      <div className="relative h-40 bg-slate-100 dark:bg-slate-700">
        {gear.image_url ? (
          <img src={gear.image_url} alt={gear.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={32} className="text-slate-300" />
          </div>
        )}
        {/* Availability chip */}
        <div className="absolute top-2 left-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            gear.available !== false
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
              : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
          }`}>
            {gear.available !== false ? 'Available' : 'Unavailable'}
          </span>
        </div>
        {/* Remove from wishlist */}
        <button
          onClick={() => onRemove(gear.id)}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 dark:bg-slate-800/90 flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors shadow"
          title="Remove from wishlist"
        >
          <Heart size={13} fill="currentColor" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">{gear.title}</h3>
        <p className="text-xs text-slate-400 mt-0.5 truncate">{gear.category || 'Gear'}</p>
        {gear.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">{gear.description}</p>
        )}

        <button
          onClick={() => onRequest(gear)}
          disabled={gear.available === false || requesting}
          className="mt-3 w-full py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {requesting ? <Loader2 size={14} className="animate-spin" /> : null}
          {gear.available === false ? 'Currently Unavailable' : 'Request to Rent'}
        </button>
      </div>
    </div>
  );
}

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist, requestStatus } = useSelector((s) => s.rentals);
  const { user } = useSelector((s) => s.auth);

  const [gearItems, setGearItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestingId, setRequestingId] = useState(null);

  // Fetch full gear objects for all wishlist IDs
  useEffect(() => {
    if (wishlist.length === 0) {
      setGearItems([]);
      return;
    }
    setLoading(true);
    const params = wishlist.map((id) => `id=${id}`).join('&');
    api.get(`/rain_gear?${params}`)
      .then((res) => setGearItems(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [wishlist]);

  const handleRemove = (gearId) => {
    dispatch(removeFromWishlist(gearId));
  };

  const handleRequest = async (gear) => {
    // Navigate to gear detail for full request form
    navigate(`/gear/${gear.id}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Wishlist</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gear you've saved for later.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(wishlist.length || 3)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Wishlist</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {wishlist.length > 0
              ? `${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} saved`
              : "Gear you've saved for later."}
          </p>
        </div>
        {wishlist.length > 0 && (
          <button
            onClick={() => navigate('/browse')}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <Search size={15} />
            Browse more
          </button>
        )}
      </div>

      {/* Empty state */}
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <RainCloudIllustration />
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mt-6 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-slate-400 text-sm max-w-xs">
            Save gear you like by tapping the{' '}
            <Heart size={12} className="inline text-rose-400" fill="currentColor" />{' '}
            heart icon while browsing. We'll keep it here for when you're ready.
          </p>
          <button
            onClick={() => navigate('/browse')}
            className="mt-6 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Browse Gear
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {gearItems.map((gear) => (
            <WishlistCard
              key={gear.id}
              gear={gear}
              onRemove={handleRemove}
              onRequest={handleRequest}
              requesting={requestingId === gear.id && requestStatus === 'loading'}
            />
          ))}
          {/* Show placeholders for IDs not yet fetched */}
          {wishlist
            .filter((id) => !gearItems.find((g) => g.id === id))
            .map((id) => (
              <div key={id} className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
        </div>
      )}
    </div>
  );
}
