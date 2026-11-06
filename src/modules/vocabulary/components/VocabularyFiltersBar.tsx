import React, { useState } from 'react';
import {
  VocabCategory,
  VocabMastery,
  VocabViewMode,
} from '../types/vocabulary.types';
import {
  Search,
  LayoutGrid,
  List,
  Heart,
  Bookmark,
  Sparkles,
  ChevronDown,
  Globe2,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { SUPPORTED_LANGUAGES } from '@/config/constants';

interface VocabularyFiltersBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCategory: VocabCategory;
  onCategoryChange: (c: VocabCategory) => void;
  activeMastery: VocabMastery;
  onMasteryChange: (m: VocabMastery) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  showBookmarksOnly: boolean;
  onToggleBookmarksOnly: () => void;
  showRecentlyLearnedOnly: boolean;
  onToggleRecentlyLearnedOnly: () => void;
  viewMode: VocabViewMode;
  onViewModeChange: (m: VocabViewMode) => void;
  currentLangCode: string;
  onSelectLanguage: (code: string) => void;
  favoritesCount: number;
  bookmarksCount: number;
}

export const VocabularyFiltersBar: React.FC<VocabularyFiltersBarProps> = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  activeMastery,
  onMasteryChange,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  showBookmarksOnly,
  onToggleBookmarksOnly,
  showRecentlyLearnedOnly,
  onToggleRecentlyLearnedOnly,
  viewMode,
  onViewModeChange,
  currentLangCode,
  onSelectLanguage,
  favoritesCount,
  bookmarksCount,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === currentLangCode) || {
    name: currentLangCode.toUpperCase(),
    flag: '🌐',
  };

  const categories: Array<{ id: VocabCategory; label: string; icon?: string }> = [
    { id: 'all', label: 'All Categories' },
    { id: 'greetings', label: 'Greetings', icon: '🙏' },
    { id: 'food', label: 'Food & Dining', icon: '🍲' },
    { id: 'travel', label: 'Travel & Transit', icon: '🚗' },
    { id: 'family', label: 'Family & Relations', icon: '👨‍👩‍👧' },
    { id: 'verbs', label: 'Common Verbs', icon: '⚡' },
    { id: 'numbers', label: 'Numbers & Time', icon: '🔢' },
    { id: 'daily_phrases', label: 'Everyday Courtesy', icon: '💬' },
  ];

  return (
    <div className="space-y-4 pt-1">
      {/* Top row: Language switcher, search bar, view switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Language Switcher Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLangMenu((prev) => !prev)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition shadow-sm hover:bg-slate-50 select-none"
            title="Switch Language Deck"
          >
            <Globe2 className="w-4 h-4 text-blue-600" />
            <span>
              {currentLang.flag} {currentLang.name} Vocabulary
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {showLangMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowLangMenu(false)}
              />
              <div className="absolute left-0 mt-2 w-56 max-h-64 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-1.5 space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Select Language Deck
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSelectLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition text-left',
                      lang.code === currentLangCode
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                    {lang.code === currentLangCode && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Search Bar & View Mode Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md justify-end">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search words, meanings, phonetics..."
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

          {/* View Mode Toggle */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={cn(
                'p-1.5 rounded-lg transition',
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              )}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={cn(
                'p-1.5 rounded-lg transition',
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              )}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap select-none border',
              activeCategory === cat.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
            )}
          >
            {cat.icon && <span>{cat.icon}</span>}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Filter Chips Bar (Mastery, Favorites, Bookmarks, Recently Learned) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
        <button
          onClick={() => onMasteryChange('all')}
          className={cn(
            'px-3 py-1 rounded-xl text-xs font-semibold transition border select-none',
            activeMastery === 'all' && !showFavoritesOnly && !showBookmarksOnly && !showRecentlyLearnedOnly
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-transparent shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800'
          )}
        >
          All
        </button>

        <button
          onClick={() => onMasteryChange('mastered')}
          className={cn(
            'px-3 py-1 rounded-xl text-xs font-semibold transition border select-none',
            activeMastery === 'mastered'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800'
          )}
        >
          <CheckCircle2 className="w-3 h-3 inline mr-1 text-emerald-500" />
          Mastered
        </button>

        <button
          onClick={() => onMasteryChange('learning')}
          className={cn(
            'px-3 py-1 rounded-xl text-xs font-semibold transition border select-none',
            activeMastery === 'learning'
              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800'
          )}
        >
          <Sparkles className="w-3 h-3 inline mr-1 text-blue-500" />
          Learning
        </button>

        <button
          onClick={() => onMasteryChange('review_due')}
          className={cn(
            'px-3 py-1 rounded-xl text-xs font-semibold transition border select-none',
            activeMastery === 'review_due'
              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800'
          )}
        >
          Review Due
        </button>

        {/* Favorites Filter */}
        <button
          onClick={onToggleFavoritesOnly}
          className={cn(
            'px-3 py-1 rounded-xl text-xs font-semibold transition border select-none',
            showFavoritesOnly
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800'
          )}
        >
          <Heart className={cn('w-3 h-3 inline mr-1', showFavoritesOnly ? 'fill-rose-500 text-rose-500' : 'text-slate-400')} />
          Favorites ({favoritesCount})
        </button>

        {/* Bookmarks Filter */}
        <button
          onClick={onToggleBookmarksOnly}
          className={cn(
            'px-3 py-1 rounded-xl text-xs font-semibold transition border select-none',
            showBookmarksOnly
              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800 shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800'
          )}
        >
          <Bookmark className={cn('w-3 h-3 inline mr-1', showBookmarksOnly ? 'fill-amber-500 text-amber-500' : 'text-slate-400')} />
          Bookmarked ({bookmarksCount})
        </button>

        {/* Recently Learned Filter */}
        <button
          onClick={onToggleRecentlyLearnedOnly}
          className={cn(
            'px-3 py-1 rounded-xl text-xs font-semibold transition border select-none',
            showRecentlyLearnedOnly
              ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-800 shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800'
          )}
        >
          <Clock className="w-3 h-3 inline mr-1 text-purple-500" />
          Recently Learned
        </button>
      </div>
    </div>
  );
};
