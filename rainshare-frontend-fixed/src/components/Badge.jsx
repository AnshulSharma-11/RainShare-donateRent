import React from 'react';
import { statusColors, conditionColors, conditionLabels } from '../utils/helpers';

export default function Badge({ label, type = 'status', className = '' }) {
  const colorMap = type === 'condition' ? conditionColors : statusColors;
  const displayLabel = type === 'condition' ? (conditionLabels[label] || label) : label;
  const colorClass = colorMap[label] || 'bg-slate-100 text-slate-600';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass} ${className}`}>
      {displayLabel}
    </span>
  );
}
