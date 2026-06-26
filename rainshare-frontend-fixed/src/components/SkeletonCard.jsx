import React from 'react';

export default function SkeletonCard({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-card overflow-hidden">
          <div className="skeleton h-48 w-full" />
          <div className="p-4 space-y-3">
            <div className="skeleton h-4 rounded w-3/4" />
            <div className="skeleton h-3 rounded w-1/2" />
            <div className="skeleton h-3 rounded w-full" />
            <div className="flex gap-2 pt-1">
              <div className="skeleton h-6 rounded-full w-16" />
              <div className="skeleton h-6 rounded-full w-16" />
            </div>
            <div className="skeleton h-9 rounded-xl w-full mt-2" />
          </div>
        </div>
      ))}
    </>
  );
}
