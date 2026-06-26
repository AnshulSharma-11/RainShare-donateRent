import React from 'react';

export default function Card({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={`
        bg-surface-card dark:bg-surface-card-dark rounded-2xl shadow-card
        ${hover ? 'hover:shadow-card-hover transition-shadow duration-200 cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
