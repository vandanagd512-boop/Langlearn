import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/state/store';
import { useNotification } from '@/context/NotificationContext';
import { StorageService } from '@/utils/storage';

import { getCourseDataForLanguage } from '../data/course-sections.data';
import type {
  CourseSection,
  LessonSummary,
  SectionFilter,
  ViewTab,
} from '../types/course-structure.types';

import { CourseOverviewBanner } from '../components/CourseOverviewBanner';
import { CourseProgressCard } from '../components/CourseProgressCard';
import { CourseSectionCard } from '../components/CourseSectionCard';
import { LearningPathRoadmap } from '../components/LearningPathRoadmap';
import { CourseFiltersBar } from '../components/CourseFiltersBar';
import { CoursesSkeleton } from '../components/CoursesSkeleton';

import { SearchX, ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const BOOKMARKED_COURSES_KEY = 'bookmarked_courses';

export const CoursesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeLanguageCode, setActiveLanguageCode } = useAppStore();
  const { notify } = useNotification();

  // Determine current language from query param or store
  const langQuery = searchParams.get('lang');
  const effectiveLangCode = (langQuery || activeLanguageCode || 'kn').toLowerCase();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SectionFilter>('all');
  const [viewTab, setViewTab] = useState<ViewTab>('sections');
  const [bookmarkedCourses, setBookmarkedCourses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookmarks & simulate initial load
  useEffect(() => {
    const savedBookmarks = StorageService.getItem<string[]>(BOOKMARKED_COURSES_KEY, ['kn', 'hi']);
    setBookmarkedCourses(savedBookmarks);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  // Sync if query param changed
  useEffect(() => {
    if (langQuery && langQuery !== activeLanguageCode) {
      setActiveLanguageCode(langQuery);
    }
  }, [langQuery, activeLanguageCode, setActiveLanguageCode]);

  // Retrieve complete course data for this language
  const courseData = useMemo(() => {
    return getCourseDataForLanguage(effectiveLangCode);
  }, [effectiveLangCode]);

  // Handle switching language
  const handleSelectLanguage = useCallback(
    (code: string) => {
      setActiveLanguageCode(code);
      setSearchParams({ lang: code });
      notify({
        type: 'info',
        title: 'Course Switched',
        message: `Now viewing the complete syllabus and curriculum for ${code.toUpperCase()}.`,
      });
    },
    [setActiveLanguageCode, setSearchParams, notify]
  );

  // Bookmark toggle
  const isBookmarked = bookmarkedCourses.includes(effectiveLangCode);
  const handleToggleBookmark = useCallback(() => {
    setBookmarkedCourses((prev) => {
      const exists = prev.includes(effectiveLangCode);
      const updated = exists
        ? prev.filter((c) => c !== effectiveLangCode)
        : [...prev, effectiveLangCode];
      StorageService.setItem(BOOKMARKED_COURSES_KEY, updated);

      notify({
        type: 'success',
        title: exists ? 'Course Removed' : 'Course Bookmarked',
        message: `${courseData.languageName} course ${
          exists ? 'removed from' : 'saved to'
        } your bookmarked courses.`,
      });
      return updated;
    });
  }, [effectiveLangCode, courseData.languageName, notify]);

  // Download course syllabus (UI simulation)
  const handleDownloadCourse = useCallback(() => {
    notify({
      type: 'info',
      title: 'Preparing Offline Course Syllabus',
      message: `Downloading ${courseData.languageName} audio, flashcards, and lesson packs...`,
    });

    setTimeout(() => {
      notify({
        type: 'success',
        title: 'Offline Course Ready',
        message: `${courseData.languageName} course material is now stored locally for offline practice!`,
      });
    }, 1200);
  }, [courseData.languageName, notify]);

  // Share course
  const handleShareCourse = useCallback(() => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: `Learn ${courseData.languageName} on LangLearn`,
          text: `Check out the complete ${courseData.languageName} course curriculum on LangLearn!`,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareUrl);
      notify({
        type: 'success',
        title: 'Link Copied',
        message: 'Course link copied to clipboard! Share it with your friends.',
      });
    }
  }, [courseData.languageName, notify]);

  // Resume or start learning (finds next incomplete lesson and navigates to /lessons)
  const handleResumeOrStart = useCallback(() => {
    // Find first incomplete or current lesson
    let targetLesson: LessonSummary | undefined;
    let targetSection: CourseSection | undefined;

    for (const section of courseData.sections) {
      if (!section.isLocked) {
        const found = section.lessons.find(
          (l) => l.status === 'current' || l.status === 'locked'
        );
        if (found) {
          targetLesson = found;
          targetSection = section;
          break;
        }
      }
    }

    if (!targetLesson && courseData.sections.length > 0) {
      targetSection = courseData.sections[0];
      targetLesson = targetSection.lessons[0];
    }

    notify({
      type: 'success',
      title: 'Launching Lesson',
      message: `Opening: ${targetLesson?.title || 'Next Lesson'}...`,
    });

    navigate(`/lessons?course=${effectiveLangCode}&lesson=${targetLesson?.id || 'les-1'}`);
  }, [courseData, effectiveLangCode, navigate, notify]);

  // Navigate to a specific lesson
  const handleSelectLesson = useCallback(
    (section: CourseSection, lesson?: LessonSummary) => {
      const lesId = lesson?.id || section.lessons[0]?.id || 'les-1';
      const lesTitle = lesson?.title || section.title;

      notify({
        type: 'success',
        title: 'Entering Lesson',
        message: `Opening ${lesTitle}...`,
      });

      navigate(`/lessons?course=${effectiveLangCode}&section=${section.id}&lesson=${lesId}`);
    },
    [effectiveLangCode, navigate, notify]
  );

  // Filter sections by search and status
  const filteredSections = useMemo(() => {
    let list = [...courseData.sections];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (sec) =>
          sec.title.toLowerCase().includes(q) ||
          (sec.nativeTitle && sec.nativeTitle.toLowerCase().includes(q)) ||
          sec.shortDescription.toLowerCase().includes(q) ||
          sec.lessons.some((l) => l.title.toLowerCase().includes(q))
      );
    }

    // Filter pills
    if (activeFilter === 'in_progress') {
      list = list.filter((s) => s.status === 'in_progress');
    } else if (activeFilter === 'completed') {
      list = list.filter((s) => s.status === 'completed');
    } else if (activeFilter === 'locked') {
      list = list.filter((s) => s.isLocked);
    } else if (activeFilter === 'quiz') {
      list = list.filter((s) => s.isQuiz);
    }

    return list;
  }, [courseData.sections, searchQuery, activeFilter]);

  if (isLoading) {
    return <CoursesSkeleton />;
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-7xl mx-auto">
      {/* Top back navigation button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/languages')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Languages</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate('/languages')}
            className="text-xs text-slate-500"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Browse Other Languages
          </Button>
        </div>
      </div>

      {/* Course Overview Banner */}
      <CourseOverviewBanner
        course={courseData}
        isBookmarked={isBookmarked}
        onResume={handleResumeOrStart}
        onToggleBookmark={handleToggleBookmark}
        onDownloadCourse={handleDownloadCourse}
        onShareCourse={handleShareCourse}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* Progress & Milestone Summary Card */}
      <CourseProgressCard
        completedLessons={courseData.completedLessons}
        totalLessons={courseData.totalLessons}
        completedQuizzes={courseData.completedQuizzes}
        totalQuizzes={courseData.totalQuizzes}
      />

      {/* Filter and View Switcher */}
      <CourseFiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        viewTab={viewTab}
        onViewTabChange={setViewTab}
        totalSections={courseData.sections.length}
        filteredCount={filteredSections.length}
      />

      {/* View Tab Switch: Curriculum Sections vs Learning Path Roadmap */}
      {viewTab === 'roadmap' ? (
        <LearningPathRoadmap
          course={courseData}
          onSelectLesson={(sec, les) => handleSelectLesson(sec, les)}
        />
      ) : filteredSections.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center text-amber-500">
            <SearchX className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              No matching sections found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {searchQuery
                ? `No lessons or sections match "${searchQuery}". Check your spelling or try another keyword.`
                : 'No sections match the current filter criteria.'}
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        /* Sections List */
        <div className="space-y-4">
          {filteredSections.map((section) => (
            <CourseSectionCard
              key={section.id}
              section={section}
              onStartOrContinue={(sec, les) => handleSelectLesson(sec, les)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
