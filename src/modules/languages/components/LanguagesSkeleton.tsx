import React from 'react';
import type { ViewMode } from '../types/language-catalog.types';

interface LanguagesSkeletonProps {
  viewMode?: ViewMode;
  count?: number;
}

export const LanguagesSkeleton: React.FC<LanguagesSkeletonProps> = ({
  viewMode = 'grid',
  count = 6,
}) => {
  if (viewMode === 'list') {
    return (
      <div className="space-y-3" role="status" aria-label="Loading languages">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl animate-pulse"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="space-y-2 flex-1 max-w-md">
                <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="h-3 w-64 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-8 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      role="status"
      aria-label="Loading languages"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 animate-pulse shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>

          <div className="space-y-2 pt-1">
            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800/60 rounded-md" />
            <div className="h-3.5 w-3/4 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
              <div className="h-3 w-10 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};
