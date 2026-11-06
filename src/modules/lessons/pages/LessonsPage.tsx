import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/state/store';
import { useNotification } from '@/context/NotificationContext';
import { StorageService } from '@/utils/storage';

import { getLessonDetail } from '../data/lessons.data';
import { LessonHeader } from '../components/LessonHeader';
import { LessonProgressBar } from '../components/LessonProgressBar';
import { LessonContentCard } from '../components/LessonContentCard';
import { LessonControls } from '../components/LessonControls';
import { LessonQuickActions } from '../components/LessonQuickActions';
import { LessonSkeleton } from '../components/LessonSkeleton';
import { SUPPORTED_LANGUAGES } from '@/config/constants';

const COMPLETED_LESSONS_KEY = 'completed_lessons';
const BOOKMARKED_LESSONS_KEY = 'bookmarked_lessons';
const FAVORITE_LESSONS_KEY = 'favorite_lessons';
const LAST_LESSON_KEY = 'last_lesson_id';

export const LessonsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeLanguageCode } = useAppStore();
  const { notify } = useNotification();

  // Params
  const courseParam = searchParams.get('course') || activeLanguageCode || 'kn';
  const lessonParam = searchParams.get('lesson') || 'les-1';

  // State
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [bookmarkedLessons, setBookmarkedLessons] = useState<string[]>([]);
  const [favoriteLessons, setFavoriteLessons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load lesson detail
  const lesson = useMemo(() => {
    return getLessonDetail(courseParam, lessonParam);
  }, [courseParam, lessonParam]);

  // Current language meta
  const currentLang = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === courseParam) || {
        name: courseParam.toUpperCase(),
        flag: '🌐',
      }
    );
  }, [courseParam]);

  // Load stored state on mount
  useEffect(() => {
    const savedCompleted = StorageService.getItem<string[]>(COMPLETED_LESSONS_KEY, ['kn-les-0']);
    const savedBookmarks = StorageService.getItem<string[]>(BOOKMARKED_LESSONS_KEY, []);
    const savedFavorites = StorageService.getItem<string[]>(FAVORITE_LESSONS_KEY, []);

    setCompletedLessons(savedCompleted);
    setBookmarkedLessons(savedBookmarks);
    setFavoriteLessons(savedFavorites);

    // Save as last active lesson for auto-resume
    StorageService.setItem(LAST_LESSON_KEY, `${courseParam}:${lessonParam}`);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [courseParam, lessonParam]);

  // Reset item index if lesson changes
  useEffect(() => {
    setCurrentItemIndex(0);
  }, [lessonParam]);

  const lessonKey = `${courseParam}-${lesson.id}`;
  const isLessonCompleted = completedLessons.includes(lessonKey);
  const isBookmarked = bookmarkedLessons.includes(lessonKey);
  const isFavorite = favoriteLessons.includes(lessonKey);

  // Handlers
  const handleToggleBookmark = useCallback(() => {
    setBookmarkedLessons((prev) => {
      const exists = prev.includes(lessonKey);
      const updated = exists ? prev.filter((id) => id !== lessonKey) : [...prev, lessonKey];
      StorageService.setItem(BOOKMARKED_LESSONS_KEY, updated);

      notify({
        type: 'info',
        title: exists ? 'Bookmark Removed' : 'Lesson Bookmarked',
        message: `${lesson.title} has been ${exists ? 'removed from' : 'saved to'} your bookmarks.`,
      });

      return updated;
    });
  }, [lessonKey, lesson.title, notify]);

  const handleToggleFavorite = useCallback(() => {
    setFavoriteLessons((prev) => {
      const exists = prev.includes(lessonKey);
      const updated = exists ? prev.filter((id) => id !== lessonKey) : [...prev, lessonKey];
      StorageService.setItem(FAVORITE_LESSONS_KEY, updated);

      notify({
        type: 'success',
        title: exists ? 'Removed from Favorites' : 'Added to Favorites',
        message: `${lesson.title} has been ${exists ? 'removed from' : 'added to'} your favorites.`,
      });

      return updated;
    });
  }, [lessonKey, lesson.title, notify]);

  const handleShareLesson = useCallback(() => {
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: `${lesson.title} - LangLearn`,
          text: `Check out this lesson on ${lesson.title} in ${currentLang.name}!`,
          url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      notify({
        type: 'success',
        title: 'Lesson Link Copied',
        message: 'Share link copied to clipboard!',
      });
    }
  }, [lesson.title, currentLang.name, notify]);

  const handleMarkComplete = useCallback(() => {
    if (!completedLessons.includes(lessonKey)) {
      const updated = [...completedLessons, lessonKey];
      setCompletedLessons(updated);
      StorageService.setItem(COMPLETED_LESSONS_KEY, updated);

      notify({
        type: 'success',
        title: '🎉 Lesson Completed!',
        message: `Outstanding! You mastered "${lesson.title}" and earned +${lesson.xpReward} XP!`,
      });
    }
  }, [completedLessons, lessonKey, lesson.title, lesson.xpReward, notify]);

  const handleNextLesson = useCallback(() => {
    const nextOrder = lesson.order + 1;
    const nextLessonId = `les-${nextOrder}`;

    notify({
      type: 'info',
      title: 'Loading Next Lesson',
      message: `Moving forward to Lesson ${nextOrder}...`,
    });

    setSearchParams({
      course: courseParam,
      lesson: nextLessonId,
    });
  }, [lesson.order, courseParam, setSearchParams, notify]);

  const handleBackToCourse = useCallback(() => {
    navigate(`/courses?lang=${courseParam}`);
  }, [navigate, courseParam]);

  if (isLoading) {
    return <LessonSkeleton />;
  }

  const activeItem = lesson.items[currentItemIndex] || lesson.items[0];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-4xl mx-auto">
      {/* Lesson Header */}
      <LessonHeader
        courseName={currentLang.name}
        sectionTitle={lesson.sectionTitle}
        lessonTitle={lesson.title}
        lessonSubtitle={lesson.subtitle}
        category={lesson.category}
        difficulty={lesson.difficulty}
        estimatedMinutes={lesson.estimatedMinutes}
        xpReward={lesson.xpReward}
        isBookmarked={isBookmarked}
        isFavorite={isFavorite}
        onBackToCourse={handleBackToCourse}
        onToggleBookmark={handleToggleBookmark}
        onToggleFavorite={handleToggleFavorite}
        onShareLesson={handleShareLesson}
      />

      {/* Progress Card */}
      <LessonProgressBar
        currentLessonOrder={lesson.order}
        totalLessons={lesson.totalLessons}
        currentItemIndex={currentItemIndex}
        totalItems={lesson.items.length}
        xpReward={lesson.xpReward}
        isCompleted={isLessonCompleted}
      />

      {/* Core Lesson Content Card */}
      <LessonContentCard item={activeItem} />

      {/* Controls: Prev / Next / Mark Complete */}
      <LessonControls
        currentIndex={currentItemIndex}
        totalItems={lesson.items.length}
        isCompleted={isLessonCompleted}
        onPrev={() => setCurrentItemIndex((prev) => Math.max(0, prev - 1))}
        onNext={() =>
          setCurrentItemIndex((prev) => Math.min(lesson.items.length - 1, prev + 1))
        }
        onMarkComplete={handleMarkComplete}
        onNextLesson={handleNextLesson}
        hasNextLesson={lesson.order < lesson.totalLessons}
        hasPrevLesson={lesson.order > 1}
      />

      {/* Quick Action Cards: Practice, Quiz, Vocabulary, Translator */}
      <LessonQuickActions
        courseCode={courseParam}
        lessonId={lesson.id}
        sampleWord={activeItem.targetText}
      />
    </div>
  );
};
