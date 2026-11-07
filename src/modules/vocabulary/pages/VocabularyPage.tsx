import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/state/store';
import { useNotification } from '@/context/NotificationContext';
import { StorageService } from '@/utils/storage';
import { LearningAnalyticsService } from '@/services/analytics/learning-analytics.service';
import { ModuleHeader } from '@/components/layout/ModuleHeader';
import { Button } from '@/components/ui/Button';

import {
  getVocabularyForLanguage,
  getDailyVocabularyWord,
} from '../data/vocabulary.data';
import type {
  VocabCategory,
  VocabMastery,
  VocabViewMode,
} from '../types/vocabulary.types';

import { DailyVocabularyCard } from '../components/DailyVocabularyCard';
import { VocabularyFiltersBar } from '../components/VocabularyFiltersBar';
import { VocabularyCard } from '../components/VocabularyCard';
import { RecentlyLearnedSection } from '../components/RecentlyLearnedSection';
import { VocabularySkeleton } from '../components/VocabularySkeleton';

import { BookMarked, SearchX, Sparkles, Layers } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/config/constants';

const FAVORITES_STORAGE_KEY = 'favorite_vocab';
const BOOKMARKS_STORAGE_KEY = 'bookmarked_vocab';
const PRACTICED_STORAGE_KEY = 'practiced_vocab_ids';

export const VocabularyPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeLanguageCode, setActiveLanguageCode } = useAppStore();
  const { notify } = useNotification();

  // Language code from query param or store
  const langQuery = searchParams.get('lang');
  const effectiveLangCode = (langQuery || activeLanguageCode || 'kn').toLowerCase();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<VocabCategory>('all');
  const [activeMastery, setActiveMastery] = useState<VocabMastery>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [showRecentlyLearnedOnly, setShowRecentlyLearnedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<VocabViewMode>('grid');

  const [favorites, setFavorites] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [practicedIds, setPracticedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites & bookmarks on mount
  useEffect(() => {
    const savedFavorites = StorageService.getItem<string[]>(FAVORITES_STORAGE_KEY, [
      'kn-v-1',
      'hi-v-1',
      'en-v-1',
      'en-v-2',
    ]);
    const savedBookmarks = StorageService.getItem<string[]>(BOOKMARKS_STORAGE_KEY, [
      'kn-v-2',
      'hi-v-2',
      'en-v-3',
    ]);
    const savedPracticed = StorageService.getItem<string[]>(PRACTICED_STORAGE_KEY, []);

    setFavorites(savedFavorites);
    setBookmarks(savedBookmarks);
    setPracticedIds(savedPracticed);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Sync if query param changed
  useEffect(() => {
    if (langQuery && langQuery !== activeLanguageCode) {
      setActiveLanguageCode(langQuery);
    }
  }, [langQuery, activeLanguageCode, setActiveLanguageCode]);

  // Current language meta
  const currentLang = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === effectiveLangCode) || {
        name: effectiveLangCode.toUpperCase(),
        flag: '🌐',
      }
    );
  }, [effectiveLangCode]);

  // Load words dataset with practiced status applied
  const allWords = useMemo(() => {
    const rawList = getVocabularyForLanguage(effectiveLangCode);
    return rawList.map((w) => {
      if (practicedIds.includes(w.id)) {
        return {
          ...w,
          masteryStatus: 'mastered' as const,
          learnedAt: 'Today',
        };
      }
      return w;
    });
  }, [effectiveLangCode, practicedIds]);

  // Daily word
  const dailyWord = useMemo(() => {
    return getDailyVocabularyWord(effectiveLangCode);
  }, [effectiveLangCode]);

  // Recently learned words
  const recentlyLearnedWords = useMemo(() => {
    return allWords.filter(
      (w) =>
        w.learnedAt === 'Today' ||
        w.learnedAt === 'Yesterday' ||
        w.learnedAt === '2 days ago' ||
        practicedIds.includes(w.id)
    );
  }, [allWords, practicedIds]);

  // Language switcher
  const handleSelectLanguage = useCallback(
    (code: string) => {
      setActiveLanguageCode(code);
      setSearchParams({ lang: code });
      resetFilters();
      notify({
        type: 'info',
        title: 'Language Deck Changed',
        message: `Now viewing ${code.toUpperCase()} vocabulary bank.`,
      });
    },
    [setActiveLanguageCode, setSearchParams, notify]
  );

  // Favorite toggle
  const handleToggleFavorite = useCallback(
    (id: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setFavorites((prev) => {
        const isFav = prev.includes(id);
        const updated = isFav ? prev.filter((item) => item !== id) : [...prev, id];
        StorageService.setItem(FAVORITES_STORAGE_KEY, updated);

        const targetWord = allWords.find((w) => w.id === id);
        notify({
          type: 'success',
          title: isFav ? 'Removed from Favorites' : 'Added to Favorites',
          message: `${targetWord?.word || 'Word'} is ${isFav ? 'no longer' : 'now'} in your favorites.`,
        });

        return updated;
      });
    },
    [allWords, notify]
  );

  // Bookmark toggle
  const handleToggleBookmark = useCallback(
    (id: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setBookmarks((prev) => {
        const isBookmarked = prev.includes(id);
        const updated = isBookmarked ? prev.filter((item) => item !== id) : [...prev, id];
        StorageService.setItem(BOOKMARKS_STORAGE_KEY, updated);

        const targetWord = allWords.find((w) => w.id === id);
        notify({
          type: 'info',
          title: isBookmarked ? 'Bookmark Removed' : 'Word Bookmarked',
          message: `${targetWord?.word || 'Word'} ${isBookmarked ? 'removed from' : 'saved to'} your bookmarks.`,
        });

        return updated;
      });
    },
    [allWords, notify]
  );

  // Mark word learned / practiced
  const handleMarkDailyLearned = useCallback(() => {
    setPracticedIds((prev) => {
      const updated = Array.from(new Set([...prev, dailyWord.id]));
      StorageService.setItem(PRACTICED_STORAGE_KEY, updated);
      return updated;
    });

    // Record real vocabulary practice analytics
    LearningAnalyticsService.recordActivity({
      type: 'vocabulary',
      title: `Practiced Word: "${dailyWord.word}"`,
      durationSeconds: 45,
      xpEarned: 15,
      wordsCount: 1,
      languageCode: effectiveLangCode,
    });

    notify({
      type: 'success',
      title: 'Word of the Day Practiced!',
      message: `You earned +15 XP for practicing "${dailyWord.word}" today. Keep up the streak!`,
    });
  }, [dailyWord.id, dailyWord.word, effectiveLangCode, notify]);

  // Filtered vocabulary list with smart relaxation to avoid empty states
  const filteredWords = useMemo(() => {
    let list = [...allWords];

    // 1. Search Query (matches native word, romanized, meaning, or category)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter(
        (item) =>
          item.word.toLowerCase().includes(q) ||
          item.romanized.toLowerCase().includes(q) ||
          item.meaning.toLowerCase().includes(q) ||
          item.categoryLabel.toLowerCase().includes(q) ||
          item.exampleSentence.toLowerCase().includes(q)
      );
    }

    // 2. Toggled Primary Filters (Favorites, Bookmarks, Recently Learned)
    if (showFavoritesOnly) {
      const favList = list.filter((item) => favorites.includes(item.id));
      if (favList.length > 0) return favList;
      return list; // fallback so user always sees cards
    }

    if (showBookmarksOnly) {
      const bmList = list.filter((item) => bookmarks.includes(item.id));
      if (bmList.length > 0) return bmList;
      return list;
    }

    if (showRecentlyLearnedOnly) {
      const recList = list.filter(
        (item) =>
          item.learnedAt === 'Today' ||
          item.learnedAt === 'Yesterday' ||
          item.learnedAt === '2 days ago' ||
          practicedIds.includes(item.id)
      );
      if (recList.length > 0) return recList;
      return list;
    }

    // 3. Category Filter
    if (activeCategory !== 'all') {
      const catList = list.filter((item) => item.category === activeCategory);
      if (catList.length > 0) {
        list = catList;
      }
    }

    // 4. Mastery Filter
    if (activeMastery !== 'all') {
      const masteryList = list.filter((item) => item.masteryStatus === activeMastery);
      if (masteryList.length > 0) {
        list = masteryList;
      }
    }

    return list;
  }, [
    allWords,
    searchQuery,
    activeCategory,
    activeMastery,
    showFavoritesOnly,
    showBookmarksOnly,
    showRecentlyLearnedOnly,
    favorites,
    bookmarks,
    practicedIds,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setActiveMastery('all');
    setShowFavoritesOnly(false);
    setShowBookmarksOnly(false);
    setShowRecentlyLearnedOnly(false);
  };

  if (isLoading) {
    return <VocabularySkeleton viewMode={viewMode} />;
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-7xl mx-auto">
      {/* Module Header with Quick SRS Review CTA */}
      <ModuleHeader
        title={`${currentLang.name} Vocabulary Bank`}
        subtitle={`Master high-frequency vocabulary, pronunciation, and colloquial phrases with spaced repetition.`}
        icon={BookMarked}
        badge={`${allWords.length} Words in Deck`}
        actions={
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={() => navigate(`/practice?course=${effectiveLangCode}&mode=flashcards`)}
            >
              Start SRS Review ({allWords.length})
            </Button>
          </div>
        }
      />

      {/* Daily Vocabulary Featured Card */}
      <DailyVocabularyCard
        word={dailyWord}
        isBookmarked={bookmarks.includes(dailyWord.id)}
        isFavorite={favorites.includes(dailyWord.id)}
        onToggleBookmark={() => handleToggleBookmark(dailyWord.id)}
        onToggleFavorite={() => handleToggleFavorite(dailyWord.id)}
        onMarkLearned={handleMarkDailyLearned}
      />

      {/* Recently Learned Words Strip */}
      {!showRecentlyLearnedOnly && recentlyLearnedWords.length > 0 && (
        <RecentlyLearnedSection
          words={recentlyLearnedWords}
          onSelectWord={(w) => {
            setSearchQuery(w.word);
            notify({
              type: 'info',
              title: 'Viewing Word',
              message: `Viewing details for ${w.word} (${w.romanized}).`,
            });
          }}
        />
      )}

      {/* Filter and Search Bar */}
      <VocabularyFiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activeMastery={activeMastery}
        onMasteryChange={(m) => {
          setActiveMastery(m);
          setShowFavoritesOnly(false);
          setShowBookmarksOnly(false);
          setShowRecentlyLearnedOnly(false);
        }}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => {
          setShowFavoritesOnly((prev) => !prev);
          setShowBookmarksOnly(false);
          setShowRecentlyLearnedOnly(false);
          setActiveMastery('all');
        }}
        showBookmarksOnly={showBookmarksOnly}
        onToggleBookmarksOnly={() => {
          setShowBookmarksOnly((prev) => !prev);
          setShowFavoritesOnly(false);
          setShowRecentlyLearnedOnly(false);
          setActiveMastery('all');
        }}
        showRecentlyLearnedOnly={showRecentlyLearnedOnly}
        onToggleRecentlyLearnedOnly={() => {
          setShowRecentlyLearnedOnly((prev) => !prev);
          setShowFavoritesOnly(false);
          setShowBookmarksOnly(false);
          setActiveMastery('all');
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        currentLangCode={effectiveLangCode}
        onSelectLanguage={handleSelectLanguage}
        favoritesCount={favorites.length}
        bookmarksCount={bookmarks.length}
      />

      {/* Word Cards Grid or List */}
      {filteredWords.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center text-amber-500">
            <SearchX className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              No matching vocabulary found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {searchQuery
                ? `No words matched "${searchQuery}". Check your spelling or try another keyword.`
                : 'No words match the selected category or mastery filters.'}
            </p>
          </div>
          <Button variant="secondary" onClick={resetFilters}>
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }
        >
          {filteredWords.map((word) => (
            <VocabularyCard
              key={word.id}
              word={word}
              viewMode={viewMode}
              isBookmarked={bookmarks.includes(word.id)}
              isFavorite={favorites.includes(word.id)}
              onToggleBookmark={(id, e) => handleToggleBookmark(id, e)}
              onToggleFavorite={(id, e) => handleToggleFavorite(id, e)}
            />
          ))}
        </div>
      )}

      {/* Spaced Repetition Advice Footer */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-900/40 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              SuperMemo SM-2 Interval Engine Active
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Words are scheduled automatically for review right before your brain forgets them for 95%+ long-term retention.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(`/practice?course=${effectiveLangCode}&mode=flashcards`)}
          className="shrink-0"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Practice Flashcards
        </Button>
      </div>
    </div>
  );
};
