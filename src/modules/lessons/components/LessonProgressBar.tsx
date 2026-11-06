import React from 'react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Flame, Sparkles, BookOpen, Target } from 'lucide-react';
import { useAppStore } from '@/state/store';

interface LessonProgressBarProps {
  currentLessonOrder: number;
  totalLessons: number;
  currentItemIndex: number;
  totalItems: number;
  xpReward: number;
  isCompleted: boolean;
}

export const LessonProgressBar: React.FC<LessonProgressBarProps> = ({
  currentLessonOrder,
  totalLessons,
  currentItemIndex,
  totalItems,
  xpReward,
  isCompleted,
}) => {
  const { dailyGoalMinutes } = useAppStore();

  const itemStepPercent = Math.round(((currentItemIndex + 1) / totalItems) * 100);
  const courseOverallPercent = Math.round((currentLessonOrder / (totalLessons || 1)) * 100);

  // Daily goal mock for session
  const studiedMinutesToday = 15;
  const dailyGoalPercent = Math.min(100, Math.round((studiedMinutesToday / (dailyGoalMinutes || 15)) * 100));

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      {/* Top metrics row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Lesson Progress Status */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              Lesson {currentLessonOrder}
            </span>
            <span className="text-slate-400 font-normal ml-1">of {totalLessons}</span>
          </div>
        </div>

        {/* Card Step Indicator */}
        <div className="text-slate-500 font-medium">
          Step <strong className="text-blue-600 dark:text-blue-400">{currentItemIndex + 1}</strong> of {totalItems}
        </div>

        {/* XP and Daily Goal Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 font-bold text-[11px] border border-amber-200/60 dark:border-amber-900/40">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{isCompleted ? 'Earned' : 'Reward'}: +{xpReward} XP</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 font-bold text-[11px] border border-rose-200/60 dark:border-rose-900/40">
            <Flame className="w-3 h-3 text-rose-500" />
            <span>Goal: {studiedMinutesToday}/{dailyGoalMinutes}m ({dailyGoalPercent}%)</span>
          </div>
        </div>
      </div>

      {/* Item Step Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
          <span>Lesson Content Completion</span>
          <span>{itemStepPercent}%</span>
        </div>
        <ProgressBar value={itemStepPercent} color="blue" size="sm" />
      </div>

      {/* Bottom Course Micro Bar */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
        <span className="flex items-center gap-1">
          <Target className="w-3 h-3 text-blue-500" />
          Overall Course: {courseOverallPercent}% Complete
        </span>
        <span>{totalLessons - currentLessonOrder} Lessons Remaining</span>
      </div>
    </div>
  );
};
