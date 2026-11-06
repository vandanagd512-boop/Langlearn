import React, { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  hoverEffect = false,
  glass = false,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-200',
        glass
          ? 'glass-panel border-white/40 dark:border-slate-800/60 shadow-card'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm',
        hoverEffect &&
          'hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
