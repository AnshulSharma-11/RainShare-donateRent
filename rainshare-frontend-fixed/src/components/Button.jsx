import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-primary hover:bg-primary-dark text-white shadow-sm',
  secondary: 'bg-secondary hover:bg-secondary-dark text-white shadow-sm',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm',
  ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200',
  outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
  'outline-danger': 'border border-red-400 text-red-500 hover:bg-red-500 hover:text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium
        transition-all duration-150 focus:outline-none focus:ring-2
        focus:ring-primary focus:ring-offset-2 disabled:opacity-50
        disabled:cursor-not-allowed active:scale-95
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
    </button>
  );
}
