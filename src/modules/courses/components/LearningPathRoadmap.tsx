import React from 'react';
import { CourseData, LessonSummary, CourseSection } from '../types/course-structure.types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2,
  Lock,
  Play,
  Award,
  Sparkles,
  Headphones,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface LearningPathRoadmapProps {
  course: CourseData;
  onSelectLesson: (section: CourseSection, lesson: LessonSummary) => void;
}

export const LearningPathRoadmap: React.FC<LearningPathRoadmapProps> = ({
  course,
  onSelectLesson,
}) => {
  // Flatten all lessons with their parent section info for a clean linear path
  const flattenedRoadmap = course.sections.flatMap((section) =>
    section.lessons.map((lesson) => ({
      lesson,
      section,
    }))
  );

  const getLessonIcon = (type: LessonSummary['type']) => {
    switch (type) {
      case 'speaking':
        return <Headphones className="w-4 h-4" />;
      case 'quiz':
        return <Award className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Intro milestone note */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Interactive Learning Roadmap
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Follow the guided path from phonetics to full situational conversation.
            </p>
          </div>
        </div>
        <div className="text-xs font-bold text-slate-500">
          {course.completedLessons} / {course.totalLessons} Completed
        </div>
      </div>

      {/* Sequential Roadmap Tree */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {flattenedRoadmap.map(({ lesson, section }, index) => {
          const isCompleted = lesson.status === 'completed';
          const isCurrent = lesson.status === 'current';
          const isLocked = lesson.status === 'locked' || section.isLocked;

          return (
            <div key={lesson.id} className="relative flex items-start gap-4 sm:gap-6 group">
              {/* Timeline Node Badge */}
              <div
                className={cn(
                  'absolute -left-6 sm:-left-8 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm z-10',
                  isCompleted
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950/60'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950/80 animate-pulse scale-110'
                    : 'bg-white dark:bg-slate-800 text-slate-400 border-2 border-slate-200 dark:border-slate-700'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isLocked ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  index + 1
                )}
              </div>

              {/* Lesson Card */}
              <Card
                onClick={() => !isLocked && onSelectLesson(section, lesson)}
                className={cn(
                  'flex-1 p-4 sm:p-5 transition-all border-2 select-none',
                  isCurrent
                    ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 shadow-md cursor-pointer'
                    : isCompleted
                    ? 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer'
                    : 'border-slate-100 dark:border-slate-800/40 opacity-60 bg-transparent cursor-not-allowed'
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {section.title} • Lesson {lesson.order}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold animate-pulse">
                          Next Up
                        </span>
                      )}
                      {lesson.type === 'quiz' && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                          Quiz Milestone
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                        {lesson.title}
                      </h4>
                      {lesson.nativeTitle && (
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          ({lesson.nativeTitle})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        {getLessonIcon(lesson.type)}
                        <span className="capitalize">{lesson.type}</span>
                      </span>
                      <span>•</span>
                      <span>{lesson.durationMinutes} minutes</span>
                      <span>•</span>
                      <span className="text-amber-600 font-semibold">+{lesson.xpReward} XP</span>
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="shrink-0 self-end sm:self-center">
                    {isCurrent ? (
                      <Button
                        size="sm"
                        variant="primary"
                        rightIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLesson(section, lesson);
                        }}
                      >
                        Start Lesson
                      </Button>
                    ) : isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    ) : (
                      <div className="p-2 rounded-xl text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          );
        })}

        {/* Final Certification Node */}
        <div className="relative flex items-start gap-4 sm:gap-6 pt-2">
          <div className="absolute -left-6 sm:-left-8 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-md z-10">
            <Award className="w-4 h-4" />
          </div>

          <Card className="flex-1 p-5 border-2 border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Course Completion Goal
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {course.certificateTitle}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Upon finishing all 11 modules and scoring 80%+ on quizzes, claim your downloadable verified credential.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={course.completedLessons < course.totalLessons}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                {course.completedLessons >= course.totalLessons ? 'Claim Certificate' : 'Locked'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
