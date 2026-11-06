import React from 'react';

export const LessonSkeleton: React.FC = () => {
  return (
    <div
      className="space-y-6 animate-pulse max-w-4xl mx-auto"
      role="status"
      aria-label="Loading Lesson Content"
    >
      {/* Header Skeleton */}
      <div className="space-y-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="flex gap-2">
          <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>
        <div className="h-8 w-80 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-4 w-full max-w-lg bg-slate-100 dark:bg-slate-800/60 rounded" />
      </div>

      {/* Progress Bar Skeleton */}
      <div className="h-28 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3">
        <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="h-3 w-64 bg-slate-100 dark:bg-slate-800/60 rounded" />
      </div>

      {/* Main Content Card Skeleton */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden space-y-6">
        <div className="h-48 bg-slate-200 dark:bg-slate-800" />
        <div className="p-6 space-y-4">
          <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
          <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
          <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
