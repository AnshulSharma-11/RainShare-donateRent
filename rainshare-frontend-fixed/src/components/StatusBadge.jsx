import React from 'react';

const BADGE_STYLES = {
  // Gear statuses
  available:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  rented:      'bg-violet-100  text-violet-700  dark:bg-violet-900/30  dark:text-violet-400',
  unavailable: 'bg-slate-100   text-slate-500   dark:bg-slate-700      dark:text-slate-400',

  // Rental statuses
  pending:     'bg-amber-100   text-amber-700   dark:bg-amber-900/30   dark:text-amber-400',
  active:      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  returned:    'bg-slate-100   text-slate-500   dark:bg-slate-700      dark:text-slate-400',
  declined:    'bg-red-100     text-red-600     dark:bg-red-900/30     dark:text-red-400',
  cancelled:   'bg-red-100     text-red-600     dark:bg-red-900/30     dark:text-red-400',

  // Donation statuses
  confirmed:   'bg-blue-100    text-blue-700    dark:bg-blue-900/30    dark:text-blue-400',
  completed:   'bg-slate-100   text-slate-500   dark:bg-slate-700      dark:text-slate-400',
};

const LABELS = {
  available:   'Available',
  rented:      'Rented',
  unavailable: 'Unavailable',
  pending:     'Pending',
  active:      'Active',
  returned:    'Returned',
  declined:    'Declined',
  cancelled:   'Cancelled',
  confirmed:   'Confirmed',
  completed:   'Completed',
};

export default function StatusBadge({ status }) {
  const style = BADGE_STYLES[status] || 'bg-slate-100 text-slate-500';
  const label = LABELS[status] || (status ? status.charAt(0).toUpperCase() + status.slice(1) : '—');

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style}`}>
      {label}
    </span>
  );
}
