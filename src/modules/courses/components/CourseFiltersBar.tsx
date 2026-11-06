import React from 'react';
import { SectionFilter, ViewTab } from '../types/course-structure.types';
import { Search, LayoutList, GitCommit, HelpCircle, Lock, CheckCircle2, Play } from 'lucide-react';

interface CourseFiltersBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: SectionFilter;
  onFilterChange: (filter: SectionFilter) => void;
  viewTab: ViewTab;
  onViewTabChange: (tab: ViewTab) => void;
  totalSections: number;
  filteredCount: number;
}

export const CourseFiltersBar: React.FC<CourseFiltersBarProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  viewTab,
  onViewTabChange,
  totalSections,
  filteredCount,
}) => {
  const filterPills: Array<{ id: SectionFilter; label: string; icon?: React.ReactNode }> = [
    { id: 'all', label: `All Sections (${totalSections})` },
    {
      id: 'in_progress',
      label: 'In Progress',
      icon: <Play className="w-3 h-3 fill-current text-blue-500 mr-1 inline" />,
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: <CheckCircle2 className="w-3 h-3 text-emerald-500 mr-1 inline" />,
    },
    {
      id: 'locked',
      label: 'Locked',
      icon: <Lock className="w-3 h-3 text-slate-400 mr-1 inline" />,
    },
    {
      id: 'quiz',
      label: 'Quizzes',
      icon: <HelpCircle className="w-3 h-3 text-purple-500 mr-1 inline" />,
    },
  ];

  return (
    <div className="space-y-4 pt-2">
      {/* Top Bar: View Mode Switcher + Live Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* View Mode Tabs (Sections List vs Learning Path Roadmap) */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onViewTabChange('sections')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 select-none ${
              viewTab === 'sections'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Curriculum Sections</span>
          </button>
          <button
            type="button"
            onClick={() => onViewTabChange('roadmap')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 select-none ${
              viewTab === 'roadmap'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>Learning Path Roadmap</span>
          </button>
        </div>

        {/* Live Search Input */}
        <div className="relative sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search lessons or topics..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips Bar (Visible when in Sections list view) */}
      {viewTab === 'sections' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterPills.map((pill) => {
            const isSelected = activeFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => onFilterChange(pill.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {pill.icon}
                <span>{pill.label}</span>
              </button>
            );
          })}
          {searchQuery && (
            <span className="text-xs text-slate-400 ml-auto whitespace-nowrap">
              Found {filteredCount} matching
            </span>
          )}
        </div>
      )}
    </div>
  );
};
