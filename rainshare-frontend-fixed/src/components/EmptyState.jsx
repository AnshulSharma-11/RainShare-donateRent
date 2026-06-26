import React from 'react';
import { CloudRain } from 'lucide-react';
import Button from './Button';

export default function EmptyState({ icon: Icon = CloudRain, title = 'Nothing here yet', description, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-primary-light dark:bg-primary/20 flex items-center justify-center mb-4">
        <Icon size={36} className="text-primary opacity-60" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      {description && <p className="text-sm text-slate-400 mt-1 max-w-xs">{description}</p>}
      {action && actionLabel && (
        <Button onClick={action} className="mt-6">{actionLabel}</Button>
      )}
    </div>
  );
}
