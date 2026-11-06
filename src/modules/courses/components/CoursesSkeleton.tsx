import React from 'react';

export const CoursesSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse max-w-7xl mx-auto" role="status" aria-label="Loading Course">
      {/* Banner Skeleton */}
      <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800 p-8 space-y-4">
        <div className="h-6 w-32 bg-slate-300 dark:bg-slate-700 rounded-lg" />
        <div className="h-10 w-72 bg-slate-300 dark:bg-slate-700 rounded-xl" />
        <div className="h-4 w-full max-w-md bg-slate-300/80 dark:bg-slate-700/80 rounded" />
      </div>

      {/* Progress Card Skeleton */}
      <div className="h-44 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* Sections Skeleton */}
      <div className="space-y-4 pt-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-2">
                  <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-3.5 w-72 bg-slate-100 dark:bg-slate-800/60 rounded" />
                </div>
              </div>
              <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
