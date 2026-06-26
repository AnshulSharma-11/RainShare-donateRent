import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Tag, ArrowRight } from 'lucide-react';
import Badge from '../../components/Badge';

const CONDITION_COLOR = {
  new:  'success',
  good: 'primary',
  fair: 'warning',
};

export default function GearCard({ gear }) {
  const [imgError, setImgError] = useState(false);
  const isDonation = gear.rent_price === 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-700">
        {!imgError ? (
          <img
            src={gear.image_url}
            alt={gear.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-5xl">
            🌧️
          </div>
        )}
        {/* Donation ribbon */}
        {isDonation && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            Free • Donation
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-snug line-clamp-2 flex-1">
            {gear.title}
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge variant={CONDITION_COLOR[gear.condition] || 'default'} size="sm">
            {gear.condition}
          </Badge>
          <Badge variant="default" size="sm">
            <Tag size={10} className="mr-1" />
            Cat #{gear.category_id}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
          <User size={12} />
          <span>Owner #{gear.owner_id}</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className={`font-bold text-base ${isDonation ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-slate-100'}`}>
            {isDonation ? 'Free' : `₹${gear.rent_price}/day`}
          </span>
          <Link
            to={`/gear/${gear.id}`}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all"
          >
            View Details <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
