import React from 'react';
import { Search, Globe2, SlidersHorizontal } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { useAppStore } from '@/state/store';
import { useNavigate } from 'react-router-dom';

interface LanguageHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  totalLanguages: number;
}

export const LanguageHeader: React.FC<LanguageHeaderProps> = ({
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters,
  totalLanguages,
}) => {
  const navigate = useNavigate();
  const { user } = useAppStore();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
      {/* Title & Subtitle */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Globe2 className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            Languages
          </h1>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {totalLanguages}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Explore regional and international curricula tailored with native script and cultural fluency
        </p>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex items-center gap-2.5 sm:max-w-md w-full sm:w-auto">
        {/* Search Bar */}
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Kannada, Hindi, Tamil..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          type="button"
          onClick={onToggleFilters}
          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
            showFilters
              ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
          title="Filter and Sort"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden md:inline">Filters</span>
        </button>

        {/* Profile Avatar Icon */}
        <div
          onClick={() => navigate('/profile')}
          className="p-1 rounded-xl cursor-pointer hover:opacity-85 active:scale-95 transition shrink-0"
          title="My Profile"
        >
          <Avatar
            name={user?.name || 'Learner'}
            src={user?.avatarUrl}
            size="sm"
            status="online"
          />
        </div>
      </div>
    </div>
  );
};
