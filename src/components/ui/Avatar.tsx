import React, { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy';
}

export const Avatar: React.FC<AvatarProps> = ({
  className,
  src,
  name = 'User',
  size = 'md',
  status,
  ...props
}) => {
  const getInitials = (str: string) => {
    return str
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg font-semibold',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-400',
    busy: 'bg-rose-500',
  };

  return (
    <div className={cn('relative inline-block select-none', className)} {...props}>
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center font-medium bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm',
          sizes[size]
        )}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900',
            statusColors[status]
          )}
        />
      )}
    </div>
  );
};
