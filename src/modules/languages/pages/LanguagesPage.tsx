import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/state/store';
import { useNotification } from '@/context/NotificationContext';
import { StorageService } from '@/utils/storage';
import { STORAGE_KEYS } from '@/config/constants';

import {
  INITIAL_LANGUAGE_CATALOG,
} from '../data/languages.data';
import type {
  LanguageCatalogItem,
  LanguageCategory,
  LanguageFilter,
  LanguageSort,
  ViewMode,
} from '../types/language-catalog.types';

import { LanguageHeader } from '../components/LanguageHeader';
import { LanguageFiltersBar } from '../components/LanguageFiltersBar';
import { LanguageCard } from '../components/LanguageCard';
import { LanguageDetailModal } from '../components/LanguageDetailModal';
import { LanguagesSkeleton } from '../components/LanguagesSkeleton';
import { SearchX, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const LanguagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeLanguageCode, setActiveLanguageCode } = useAppStore();
  const { notify } = useNotification();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [activeCategory, setActiveCategory] = useState<LanguageCategory>('all');
  const [activeFilter, setActiveFilter] = useState<LanguageFilter>('all');
  const [activeSort, setActiveSort] = useState<LanguageSort>('popular');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCatalogItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load favorites from StorageService on mount
  useEffect(() => {
    const savedFavorites = StorageService.getItem<string[]>(
      STORAGE_KEYS.FAVORITE_LANGUAGES,
      ['kn', 'hi', 'en']
    );
    setFavorites(savedFavorites);

    // Initial loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // Save favorites to StorageService
  const handleToggleFavorite = useCallback(
    (code: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setFavorites((prev) => {
        const isFav = prev.includes(code);
        const updated = isFav ? prev.filter((c) => c !== code) : [...prev, code];
        StorageService.setItem(STORAGE_KEYS.FAVORITE_LANGUAGES, updated);

        const targetLang = INITIAL_LANGUAGE_CATALOG.find((l: LanguageCatalogItem) => l.code === code);
        const langName = targetLang?.name || code.toUpperCase();

        notify({
          type: 'info',
          title: isFav ? 'Removed from Favorites' : 'Added to Favorites',
          message: `${langName} is ${isFav ? 'no longer' : 'now'} in your favorite languages list.`,
        });

        return updated;
      });
    },
    [notify]
  );

  // Manual refresh / pull to refresh action
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      notify({
        type: 'success',
        title: 'Catalog Refreshed',
        message: 'All language courses and curriculum data are up to date.',
      });
    }, 500);
  }, [notify]);

  // Navigate to course structure
  const handleStartCourse = useCallback(
    (lang: LanguageCatalogItem, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setActiveLanguageCode(lang.code);
      setSelectedLanguage(null);
      notify({
        type: 'success',
        title: `Switched to ${lang.name}`,
        message: `Now loading course structure and curriculum for ${lang.name}...`,
      });
      navigate('/courses');
    },
    [setActiveLanguageCode, navigate, notify]
  );

  // Filter and sort catalog
  const filteredLanguages = useMemo(() => {
    let list = [...INITIAL_LANGUAGE_CATALOG];

    // 1. Search Query filter (by name, native script, code, description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.nativeName.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.shortDescription.toLowerCase().includes(q) ||
          item.fullDescription.toLowerCase().includes(q)
      );
    }

    // 2. Category filter
    if (activeCategory === 'indian') {
      list = list.filter((item) => item.category === 'Indian');
    } else if (activeCategory === 'international') {
      list = list.filter((item) => item.category === 'International');
    }

    // 3. Status/Difficulty Filter
    if (activeFilter === 'beginner') {
      list = list.filter((item) => item.difficulty === 'Beginner');
    } else if (activeFilter === 'intermediate') {
      list = list.filter((item) => item.difficulty === 'Intermediate');
    } else if (activeFilter === 'advanced') {
      list = list.filter((item) => item.difficulty === 'Advanced');
    } else if (activeFilter === 'completed') {
      list = list.filter((item) => item.completedLessons >= item.totalLessons);
    } else if (activeFilter === 'favorites') {
      list = list.filter((item) => favorites.includes(item.code));
    }

    // 4. Sorting
    list.sort((a, b) => {
      if (activeSort === 'az') {
        return a.name.localeCompare(b.name);
      }
      if (activeSort === 'recent') {
        return b.addedAt.localeCompare(a.addedAt);
      }
      if (activeSort === 'continue') {
        const aPercent = a.completedLessons / a.totalLessons;
        const bPercent = b.completedLessons / b.totalLessons;
        return bPercent - aPercent;
      }
      // 'popular'
      return a.popularityRank - b.popularityRank;
    });

    return list;
  }, [searchQuery, activeCategory, activeFilter, activeSort, favorites]);

  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setActiveFilter('all');
    setActiveSort('popular');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-7xl mx-auto">
      {/* Header with Search, Filter toggle and Profile */}
      <LanguageHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((prev) => !prev)}
        totalLanguages={INITIAL_LANGUAGE_CATALOG.length}
      />

      {/* Filter and Control Bar (Collapsible via showFilters) */}
      {showFilters && (
        <LanguageFiltersBar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          activeSort={activeSort}
          onSortChange={setActiveSort}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          favoritesCount={favorites.length}
        />
      )}

      {/* Main Content Area */}
      {isLoading || isRefreshing ? (
        <LanguagesSkeleton viewMode={viewMode} count={viewMode === 'grid' ? 6 : 5} />
      ) : filteredLanguages.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center text-amber-500">
            <SearchX className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              No matching languages found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {searchQuery
                ? `We couldn't find any languages matching "${searchQuery}". Try checking your spelling or adjusting your filters.`
                : 'No languages match the selected filters. Try broadening your criteria.'}
            </p>
          </div>
          <Button variant="secondary" onClick={resetFilters} className="mt-2">
            Reset All Filters
          </Button>
        </div>
      ) : (
        /* Language Cards Grid / List */
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
              : 'space-y-3'
          }
        >
          {filteredLanguages.map((language) => (
            <LanguageCard
              key={language.code}
              language={language}
              viewMode={viewMode}
              isActiveLanguage={language.code === activeLanguageCode}
              isFavorite={favorites.includes(language.code)}
              onToggleFavorite={(code, e) => handleToggleFavorite(code, e)}
              onSelect={(lang) => setSelectedLanguage(lang)}
              onStartOrContinue={(lang, e) => handleStartCourse(lang, e)}
            />
          ))}
        </div>
      )}

      {/* Quick Category Summary Footer Banner */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border border-blue-200/50 dark:border-blue-900/40 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Can't find your dialect or language?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              LangLearn AI generates real-time personalized lessons across 140+ regional dialects on demand.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/translator')}
          className="shrink-0"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Try AI Translator
        </Button>
      </div>

      {/* Language Details Preview Modal */}
      <LanguageDetailModal
        language={selectedLanguage}
        isOpen={Boolean(selectedLanguage)}
        isFavorite={selectedLanguage ? favorites.includes(selectedLanguage.code) : false}
        onClose={() => setSelectedLanguage(null)}
        onToggleFavorite={(code) => handleToggleFavorite(code)}
        onStartCourse={(lang) => handleStartCourse(lang)}
      />
    </div>
  );
};
