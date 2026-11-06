import React, { useState } from 'react';
import { CourseData } from '../types/course-structure.types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Play,
  Bookmark,
  Share2,
  Download,
  Award,
  BookOpen,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  Globe2,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { SUPPORTED_LANGUAGES } from '@/config/constants';

interface CourseOverviewBannerProps {
  course: CourseData;
  isBookmarked: boolean;
  onResume: () => void;
  onToggleBookmark: () => void;
  onDownloadCourse: () => void;
  onShareCourse: () => void;
  onSelectLanguage: (code: string) => void;
}

export const CourseOverviewBanner: React.FC<CourseOverviewBannerProps> = ({
  course,
  isBookmarked,
  onResume,
  onToggleBookmark,
  onDownloadCourse,
  onShareCourse,
  onSelectLanguage,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const progressPercent = Math.round(
    (course.completedLessons / (course.totalLessons || 1)) * 100
  );

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition">
      {/* Top Gradient Header Area */}
      <div
        className={cn(
          'w-full p-6 sm:p-8 bg-gradient-to-r text-white relative overflow-hidden',
          course.bannerGradient
        )}
      >
        {/* Subtle Watermark Flag */}
        <div className="absolute right-4 -bottom-6 text-9xl select-none opacity-15 pointer-events-none">
          {course.flag}
        </div>

        {/* Language selector & Header controls */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
          {/* Language Switcher Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu((prev) => !prev)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition shadow-sm"
              title="Switch Language Course"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>{course.languageName} Course</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Language Dropdown Menu */}
            {showLangMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLangMenu(false)}
                />
                <div className="absolute left-0 mt-2 w-56 max-h-64 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-1.5 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Course
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
                        lang.code === course.languageCode
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                      {lang.code === course.languageCode && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleBookmark}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition active:scale-95"
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Course'}
            >
              <Bookmark
                className={cn('w-4 h-4', isBookmarked && 'fill-amber-300 text-amber-300')}
              />
            </button>
            <button
              type="button"
              onClick={onDownloadCourse}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition active:scale-95"
              title="Download Course Offline"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onShareCourse}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition active:scale-95"
              title="Share Course"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Title & Script */}
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {course.languageName}
            </h1>
            <span className="text-xl sm:text-2xl font-bold text-white/90">
              ({course.nativeName})
            </span>
            <Badge variant="neutral" className="bg-white/20 text-white border-0">
              {course.difficulty} Level
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
            {course.description}
          </p>
        </div>
      </div>

      {/* Metrics Row & Primary CTA Bar */}
      <div className="p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-t border-slate-100 dark:border-slate-800">
        {/* Course Statistics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {course.totalLessons} Lessons
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {course.completedLessons} completed
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                ~{course.estimatedHours} Hours
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Self-paced CEFR
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {course.earnedXp} XP
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                of {course.totalXp} Total XP
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Certificate
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {progressPercent === 100 ? 'Earned' : 'Upon Completion'}
              </div>
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            size="lg"
            variant="primary"
            onClick={onResume}
            rightIcon={<Play className="w-4 h-4 fill-current" />}
            className="w-full sm:w-auto shadow-md"
          >
            {course.completedLessons > 0 ? 'Resume Learning' : 'Start Course'}
          </Button>
        </div>
      </div>
    </div>
  );
};
