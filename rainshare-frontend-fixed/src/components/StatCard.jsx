import React from 'react';

export default function StatCard({ label, value, icon: Icon, trend, color = 'primary', className = '' }) {
  const colorMap = {
    primary: 'bg-primary-light text-primary dark:bg-primary/20',
    secondary: 'bg-secondary-light text-secondary dark:bg-secondary/20',
    accent: 'bg-accent-light text-accent-dark dark:bg-accent/20',
    success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20',
    danger: 'bg-red-50 text-red-500 dark:bg-red-900/20',
  };
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-card p-5 flex items-center gap-4 ${className}`}>
      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
          <Icon size={22} />
        </div>
      )}
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value ?? '—'}</p>
        {trend && <p className="text-xs text-emerald-500 mt-0.5">{trend}</p>}
      </div>
    </div>
  );
}
