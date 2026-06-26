import React, { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, icon: Icon, className = '', type = 'text', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full rounded-xl border bg-white dark:bg-slate-800
            text-slate-800 dark:text-slate-100 placeholder-slate-400
            transition-all duration-150 text-sm
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 dark:border-slate-600'}
            ${Icon ? 'pl-9 pr-4 py-2.5' : 'px-4 py-2.5'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      )}
    </div>
  );
});

export default Input;
