import React from 'react';
import { VocabViewMode } from '../types/vocabulary.types';

interface VocabularySkeletonProps {
  viewMode?: VocabViewMode;
  count?: number;
}

export const VocabularySkeleton: React.FC<VocabularySkeletonProps> = ({
  viewMode = 'grid',
  count = 6,
}) => {
  return (
    <div
      className="space-y-6 animate-pulse max-w-7xl mx-auto"
      role="status"
      aria-label="Loading Vocabulary Deck"
    >
      {/* Daily Vocabulary Skeleton */}
      <div className="h-56 rounded-3xl bg-slate-200 dark:bg-slate-800 p-6 space-y-4">
        <div className="h-4 w-32 bg-slate-300 dark:bg-slate-700 rounded" />
        <div className="h-10 w-64 bg-slate-300 dark:bg-slate-700 rounded-xl" />
        <div className="h-4 w-full max-w-md bg-slate-300/80 dark:bg-slate-700/80 rounded" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 flex gap-3">
        <div className="h-8 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-8 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-8 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>

      {/* Grid or List Skeleton */}
      {viewMode === 'list' ? (
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className="h-20 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-2">
                  <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-3 w-52 bg-slate-100 dark:bg-slate-800/60 rounded" />
                </div>
              </div>
              <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className="h-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3"
            >
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>
              <div className="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800/60 rounded" />
              <div className="h-16 w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
