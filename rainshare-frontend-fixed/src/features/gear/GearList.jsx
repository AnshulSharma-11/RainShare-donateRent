import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Package, Heart, X } from 'lucide-react';
import { fetchGears } from '../../store/gearSlice';
import { addToWishlist, removeFromWishlist } from '../../store/rentalSlice';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

function GearCard({ gear, isWishlisted, onWishlist, onView, isRenter }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden group flex flex-col">
      {/* Image */}
      <div className="relative h-44 bg-slate-100 dark:bg-slate-700">
        {gear.image_url ? (
          <img
            src={gear.image_url}
            alt={gear.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={32} className="text-slate-300" />
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <StatusBadge status={gear.available !== false ? 'available' : 'unavailable'} />
        </div>
        {/* Wishlist heart — shown for all logged-in users, styled for renters */}
        {onWishlist && (
          <button
            onClick={(e) => { e.stopPropagation(); onWishlist(gear.id); }}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow ${
              isWishlisted
                ? 'bg-rose-500 text-white scale-110'
                : 'bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:text-rose-500 hover:scale-110'
            }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-primary font-medium mb-1">{gear.category || 'Gear'}</p>
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-snug line-clamp-2 flex-1">
          {gear.title}
        </h3>
        {gear.description && (
          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{gear.description}</p>
        )}
        <button
          onClick={() => onView(gear.id)}
          className="mt-3 w-full py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          {isRenter ? 'View & Request' : 'View Details'}
        </button>
      </div>
    </div>
  );
}

export default function GearList() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user, role } = useSelector((s) => s.auth);
  const { items, status } = useSelector((s) => s.gear);
  const { wishlist } = useSelector((s) => s.rentals);

  const [search, setSearch]   = useState('');
  const [category, setCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const isRenter = role === 'renter';

  useEffect(() => {
    dispatch(fetchGears({ available: true }));
  }, [dispatch]);

  const categories = [...new Set(items.map((g) => g.category).filter(Boolean))];

  const filtered = items.filter((g) => {
    const matchSearch   = !search   || g.title?.toLowerCase().includes(search.toLowerCase()) ||
                          g.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !category || g.category === category;
    return matchSearch && matchCategory;
  });

  const handleWishlist = (gearId) => {
    if (!user) { navigate('/login'); return; }
    const numId = Number(gearId) || gearId;
    if (wishlist.includes(numId)) {
      dispatch(removeFromWishlist(numId));
      toast('Removed from wishlist', { icon: '💔' });
    } else {
      dispatch(addToWishlist(numId));
      toast.success('Added to wishlist!');
    }
  };

  const loading = status === 'loading';

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Browse Gear</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {filtered.length} item{filtered.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
            showFilters
              ? 'bg-primary text-white border-primary'
              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal size={15} />
          Filters
        </button>
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search gear…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>

        {showFilters && categories.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCategory('')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                !category
                  ? 'bg-primary text-white border-primary'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat === category ? '' : cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                  category === cat
                    ? 'bg-primary text-white border-primary'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Renter wishlist hint */}
      {isRenter && (
        <p className="text-xs text-slate-400 flex items-center gap-1">
          <Heart size={12} className="text-rose-400" fill="currentColor" />
          Tap the heart on any gear card to save it to your wishlist.
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package size={40} className="text-slate-200 dark:text-slate-700 mb-3" />
          <p className="text-slate-500 font-medium">No gear found</p>
          <p className="text-slate-400 text-sm mt-1">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((gear) => (
            <GearCard
              key={gear.id}
              gear={gear}
              isWishlisted={wishlist.includes(Number(gear.id) || gear.id)}
              onWishlist={user ? handleWishlist : null}
              onView={(id) => navigate(`/gear/${id}`)}
              isRenter={isRenter}
            />
          ))}
        </div>
      )}
    </div>
  );
}
