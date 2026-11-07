import React from 'react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Target, CheckCircle2, HelpCircle, Award, Flame } from 'lucide-react';
import { useAppStore } from '@/state/store';

interface CourseProgressCardProps {
  completedLessons: number;
  totalLessons: number;
  completedQuizzes: number;
  totalQuizzes: number;
  onViewCertificate?: () => void;
}

export const CourseProgressCard: React.FC<CourseProgressCardProps> = ({
  completedLessons,
  totalLessons,
  completedQuizzes,
  totalQuizzes,
  onViewCertificate,
}) => {
  const { dailyGoalMinutes } = useAppStore();

  const progressPercent = Math.round(
    (completedLessons / (totalLessons || 1)) * 100
  );
  const remainingLessons = Math.max(0, totalLessons - completedLessons);

  // Mocking realistic user daily study for this session
  const todayStudiedMinutes = Math.min(dailyGoalMinutes, 15);
  const dailyGoalPercent = Math.round(
    (todayStudiedMinutes / (dailyGoalMinutes || 15)) * 100
  );

  return (
    <Card className="p-6 space-y-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Header and overall progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Overall Course Progress
            </h3>
          </div>
          <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
            {progressPercent}%
          </span>
        </div>

        <ProgressBar value={progressPercent} color="blue" size="md" />

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span>
            <strong className="text-slate-800 dark:text-slate-200">{completedLessons}</strong> of{' '}
            {totalLessons} lessons finished
          </span>
          <span>{remainingLessons} remaining</span>
        </div>
      </div>

      {/* 3 Detail Cards (Remaining, Quizzes, Daily Goal) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {/* Lessons Check */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Lessons</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-slate-100">
            {completedLessons}
            <span className="text-xs font-normal text-slate-400 ml-1">/ {totalLessons}</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {remainingLessons === 0 ? 'Course Completed!' : `${remainingLessons} left to unlock`}
          </p>
        </div>

        {/* Quizzes Check */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Quizzes</span>
            <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-slate-100">
            {completedQuizzes}
            <span className="text-xs font-normal text-slate-400 ml-1">/ {totalQuizzes}</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {totalQuizzes > 0
              ? `${Math.round((completedQuizzes / totalQuizzes) * 100)}% assessments passed`
              : 'Assessments pending'}
          </p>
        </div>

        {/* Daily Goal */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Daily Goal</span>
            <Flame className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-slate-100">
            {todayStudiedMinutes}
            <span className="text-xs font-normal text-slate-400 ml-1">
              / {dailyGoalMinutes} min
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden mt-1">
            <div
              className="bg-amber-500 h-full rounded-full transition-all"
              style={{ width: `${dailyGoalPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Certificate Teaser Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-900/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Award className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {progressPercent === 100
                ? 'Certificate of Completion Available! 🏅'
                : 'Accredited Certificate on Completion'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Complete all sections and evaluation quizzes to unlock your verified credential.
            </div>
          </div>
        </div>

        {onViewCertificate && (
          <button
            type="button"
            onClick={onViewCertificate}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-sm transition active:scale-95 flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            <span>View Certificate</span>
          </button>
        )}
      </div>
    </Card>
  );
};
