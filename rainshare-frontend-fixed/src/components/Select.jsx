import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder = 'Select...', className = '', ...props },
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
        <select
          ref={ref}
          className={`
            w-full appearance-none rounded-xl border bg-white dark:bg-slate-800
            text-slate-800 dark:text-slate-100 px-4 py-2.5 pr-10 text-sm
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            transition-all duration-150
            ${error ? 'border-red-400' : 'border-slate-200 dark:border-slate-600'}
            ${className}
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
});

export default Select;
