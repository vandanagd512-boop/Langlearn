import React from 'react';

export const HomeSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-4">
        <div className="space-y-2">
          <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="w-64 h-8 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>
      </div>

      {/* Featured Continue Learning Skeleton */}
      <div className="w-full h-44 bg-slate-200 dark:bg-slate-800/80 rounded-3xl" />

      {/* 4 Daily Activity Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl p-5 space-y-3">
            <div className="w-16 h-3 bg-slate-300 dark:bg-slate-700 rounded" />
            <div className="w-24 h-6 bg-slate-300 dark:bg-slate-700 rounded-lg" />
            <div className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-full" />
          </div>
        ))}
      </div>

      {/* Quick Access Skeletons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        ))}
      </div>

      {/* Popular Languages Skeletons */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-36 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        ))}
      </div>
    </div>
  );
};
