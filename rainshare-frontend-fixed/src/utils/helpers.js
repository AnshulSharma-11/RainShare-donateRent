/**
 * Return the first letters of up to two words in a name.
 * e.g. "Jane Smith" → "JS", "Alice" → "A"
 */
export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
}

/**
 * Format an ISO date string to a human-readable short date.
 * e.g. "2024-03-15T10:00:00Z" → "15 Mar 2024"
 */
export function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day:   'numeric',
      month: 'short',
      year:  'numeric',
    });
  } catch {
    return '—';
  }
}

/**
 * Format a number as GBP currency.
 * e.g. 12.5 → "£12.50"
 */
export function formatCurrency(amount, currency = 'GBP') {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount ?? 0);
}

/**
 * Truncate a string to a max length with ellipsis.
 */
export function truncate(str = '', max = 80) {
  return str.length <= max ? str : `${str.slice(0, max)}…`;
}

export const statusColors = {
  pending:   'bg-amber-100 text-amber-700',
  approved:  'bg-emerald-100 text-emerald-700',
  active:    'bg-emerald-100 text-emerald-700',
  rejected:  'bg-rose-100 text-rose-700',
  cancelled: 'bg-slate-100 text-slate-600',
  completed: 'bg-sky-100 text-sky-700',
  returned:  'bg-sky-100 text-sky-700',
  available: 'bg-emerald-100 text-emerald-700',
  rented:    'bg-amber-100 text-amber-700',
  unavailable: 'bg-slate-100 text-slate-600',
};

export const conditionColors = {
  new:       'bg-emerald-100 text-emerald-700',
  excellent: 'bg-emerald-100 text-emerald-700',
  good:      'bg-sky-100 text-sky-700',
  fair:      'bg-amber-100 text-amber-700',
  poor:      'bg-rose-100 text-rose-700',
};

export const conditionLabels = {
  new:       'New',
  excellent: 'Excellent',
  good:      'Good',
  fair:      'Fair',
  poor:      'Poor',
};
