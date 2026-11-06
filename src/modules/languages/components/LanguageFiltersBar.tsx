import React from 'react';
import {
  LanguageCategory,
  LanguageFilter,
  LanguageSort,
  ViewMode,
} from '../types/language-catalog.types';
import { LayoutGrid, List, RotateCcw, Heart } from 'lucide-react';

interface LanguageFiltersBarProps {
  activeCategory: LanguageCategory;
  onCategoryChange: (cat: LanguageCategory) => void;
  activeFilter: LanguageFilter;
  onFilterChange: (filt: LanguageFilter) => void;
  activeSort: LanguageSort;
  onSortChange: (sort: LanguageSort) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  favoritesCount: number;
}

export const LanguageFiltersBar: React.FC<LanguageFiltersBarProps> = ({
  activeCategory,
  onCategoryChange,
  activeFilter,
  onFilterChange,
  activeSort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  isRefreshing,
  favoritesCount,
}) => {
  const categories: Array<{ id: LanguageCategory; label: string; icon?: string }> = [
    { id: 'all', label: 'All Languages' },
    { id: 'indian', label: 'Indian Languages', icon: '🇮🇳' },
    { id: 'international', label: 'International Languages', icon: '🌐' },
  ];

  const filterTabs: Array<{ id: LanguageFilter; label: string; icon?: React.ReactNode }> = [
    { id: 'all', label: 'All' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'completed', label: 'Completed' },
    {
      id: 'favorites',
      label: `Favorites (${favoritesCount})`,
      icon: <Heart className="w-3 h-3 fill-rose-500 text-rose-500 inline mr-1" />,
    },
  ];

  return (
    <div className="space-y-4 pt-1">
      {/* Category Tabs & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pill Buttons */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 select-none ${
                activeCategory === cat.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat.icon && <span>{cat.icon}</span>}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* View Mode Toggle & Refresh Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Refresh / Pull-to-refresh action */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 shadow-sm transition"
            title="Refresh languages"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {/* Grid / List switcher */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Chips & Sorting Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filterTabs.map((filt) => {
            const isSelected = activeFilter === filt.id;
            return (
              <button
                key={filt.id}
                onClick={() => onFilterChange(filt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {filt.icon}
                <span>{filt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Sort by:
          </span>
          <select
            value={activeSort}
            onChange={(e) => onSortChange(e.target.value as LanguageSort)}
            className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold py-1.5 pl-3 pr-7 rounded-xl text-slate-800 dark:text-slate-200 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="popular">Most Popular</option>
            <option value="continue">Continue Learning</option>
            <option value="az">A–Z Alphabetical</option>
            <option value="recent">Recently Added</option>
          </select>
        </div>
      </div>
    </div>
  );
};
