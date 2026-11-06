import React from 'react';
import { Badge } from '../ui/Badge';
import { LucideIcon } from 'lucide-react';

export interface ModuleHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  title,
  subtitle,
  badge,
  icon: Icon,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
      <div className="flex items-start gap-3.5">
        {Icon && (
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 shrink-0">
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h1>
            {badge && <Badge variant="blue">{badge}</Badge>}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            {subtitle}
          </p>
        </div>
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
};
