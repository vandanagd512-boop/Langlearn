import React, { useState } from 'react';
import { CourseSection, LessonSummary } from '../types/course-structure.types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  Compass,
  SpellCheck,
  Volume2,
  Sparkles,
  MessageCircle,
  Hash,
  Users,
  UtensilsCrossed,
  MessageSquareText,
  BookCheck,
  HelpCircle,
  Lock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  BookOpen,
  Play,
  ArrowRight,
  Headphones,
  Award,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface CourseSectionCardProps {
  section: CourseSection;
  onStartOrContinue: (section: CourseSection, lesson?: LessonSummary) => void;
}

export const CourseSectionCard: React.FC<CourseSectionCardProps> = ({
  section,
  onStartOrContinue,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const progressPercent = Math.round(
    (section.completedLessons / (section.totalLessons || 1)) * 100
  );
  const isCompleted = section.status === 'completed' || progressPercent === 100;
  const isLocked = section.isLocked;

  // Icon mapping
  const renderIcon = () => {
    const props = { className: 'w-6 h-6' };
    switch (section.iconName) {
      case 'Compass':
        return <Compass {...props} />;
      case 'SpellCheck':
        return <SpellCheck {...props} />;
      case 'Volume2':
        return <Volume2 {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'MessageCircle':
        return <MessageCircle {...props} />;
      case 'Hash':
        return <Hash {...props} />;
      case 'Users':
        return <Users {...props} />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed {...props} />;
      case 'MessageSquareText':
        return <MessageSquareText {...props} />;
      case 'BookCheck':
        return <BookCheck {...props} />;
      case 'HelpCircle':
        return <HelpCircle {...props} />;
      default:
        return <BookOpen {...props} />;
    }
  };

  const getLessonIcon = (type: LessonSummary['type']) => {
    switch (type) {
      case 'speaking':
        return <Headphones className="w-3.5 h-3.5" />;
      case 'quiz':
        return <Award className="w-3.5 h-3.5" />;
      default:
        return <BookOpen className="w-3.5 h-3.5" />;
    }
  };

  return (
    <Card
      className={cn(
        'border-2 transition-all duration-200 overflow-hidden',
        isLocked
          ? 'opacity-75 border-slate-200/60 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/40'
          : isCompleted
          ? 'border-emerald-200/80 dark:border-emerald-900/40 bg-white dark:bg-slate-900 shadow-sm'
          : 'border-blue-500/80 bg-white dark:bg-slate-900 shadow-card ring-1 ring-blue-500/20'
      )}
    >
      <div className="p-5 sm:p-6 space-y-5">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Section Icon Box */}
            <div
              className={cn(
                'w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform',
                isCompleted
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                  : isLocked
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
              )}
            >
              {renderIcon()}
            </div>

            {/* Title, Native Title, Badge */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Section {section.sectionNumber}
                </span>
                {isCompleted ? (
                  <Badge variant="green" size="sm">
                    <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Completed
                  </Badge>
                ) : isLocked ? (
                  <Badge variant="neutral" size="sm">
                    <Lock className="w-3 h-3 mr-1 inline" /> Locked
                  </Badge>
                ) : (
                  <Badge variant="blue" size="sm" dot>
                    In Progress
                  </Badge>
                )}
                {section.isQuiz && (
                  <Badge variant="purple" size="sm">
                    Milestone Quiz
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  {section.title}
                </h3>
                {section.nativeTitle && (
                  <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">
                    • {section.nativeTitle}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                {section.shortDescription}
              </p>
            </div>
          </div>

          {/* Action Button & Lock Status */}
          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
            {isLocked ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Locked</span>
              </div>
            ) : (
              <Button
                size="sm"
                variant={isCompleted ? 'outline' : 'primary'}
                rightIcon={
                  isCompleted ? (
                    <ArrowRight className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3 h-3 fill-current" />
                  )
                }
                onClick={() => onStartOrContinue(section)}
              >
                {isCompleted ? 'Review' : section.completedLessons > 0 ? 'Continue' : 'Start'}
              </Button>
            )}
          </div>
        </div>

        {/* Section Metrics Strip & Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <strong>{section.totalLessons}</strong> Lessons
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                ~{section.estimatedMinutes} mins
              </span>
            </div>

            <div className="flex items-center gap-2 font-semibold">
              <span className={isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}>
                {section.completedLessons} / {section.totalLessons} ({progressPercent}%)
              </span>
            </div>
          </div>

          <ProgressBar
            value={progressPercent}
            color={isCompleted ? 'green' : 'blue'}
            size="sm"
          />
        </div>

        {/* Expand/Collapse Accordion Header */}
        <div className="pt-1 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-xs font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 flex items-center gap-1.5 transition select-none"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Hide Lessons ({section.lessons.length})</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>View Lessons Breakdown ({section.lessons.length})</span>
              </>
            )}
          </button>

          <span className="text-[11px] text-slate-400">
            {isLocked ? 'Prerequisite: Complete previous section' : `${section.completedLessons} of ${section.totalLessons} finished`}
          </span>
        </div>

        {/* Collapsible Lessons List */}
        {isExpanded && (
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
            {section.lessons.map((lesson, idx) => {
              const isLesCompleted = lesson.status === 'completed';
              const isLesCurrent = lesson.status === 'current';
              const isLesLocked = lesson.status === 'locked' || isLocked;

              return (
                <div
                  key={lesson.id}
                  onClick={() => !isLesLocked && onStartOrContinue(section, lesson)}
                  className={cn(
                    'p-3 rounded-2xl flex items-center justify-between gap-3 text-xs transition border',
                    isLesCurrent
                      ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 cursor-pointer shadow-sm'
                      : isLesCompleted
                      ? 'border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer hover:border-slate-300'
                      : 'border-slate-100 dark:border-slate-800/50 opacity-60 bg-transparent cursor-not-allowed'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-7 h-7 rounded-xl flex items-center justify-center font-bold text-[11px] shrink-0',
                        isLesCompleted
                          ? 'bg-emerald-500 text-white'
                          : isLesCurrent
                          ? 'bg-blue-600 text-white animate-pulse'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                      )}
                    >
                      {isLesCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isLesLocked ? (
                        <Lock className="w-3 h-3" />
                      ) : (
                        idx + 1
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span>{lesson.title}</span>
                        {lesson.nativeTitle && (
                          <span className="text-slate-400 font-normal">
                            ({lesson.nativeTitle})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          {getLessonIcon(lesson.type)}
                          <span className="capitalize">{lesson.type}</span>
                        </span>
                        <span>•</span>
                        <span>{lesson.durationMinutes} mins</span>
                        <span>•</span>
                        <span className="text-amber-600 font-semibold">+{lesson.xpReward} XP</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isLesCurrent ? (
                      <span className="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-bold text-[10px]">
                        Start Now
                      </span>
                    ) : isLesCompleted ? (
                      <span className="text-emerald-600 font-semibold text-[11px]">
                        Review
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};
