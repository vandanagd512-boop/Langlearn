import React, { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'gradient';
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  className,
  value,
  size = 'md',
  color = 'blue',
  showLabel = false,
  ...props
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    purple: 'bg-purple-600',
    gradient: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500',
  };

  return (
    <div className={cn('w-full space-y-1', className)} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 dark:text-slate-400">
          <span>Progress</span>
          <span>{clampedValue}%</span>
        </div>
      )}
      <div className={cn('w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn('h-full transition-all duration-500 ease-out rounded-full', colors[color])}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
