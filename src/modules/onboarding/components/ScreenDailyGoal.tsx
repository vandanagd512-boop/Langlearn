import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Check, Clock, Zap, Sparkles, Trophy } from 'lucide-react';
import { DAILY_GOAL_OPTIONS, GoalOption } from '../data/onboarding.data';
import { cn } from '@/utils/cn';

interface ScreenDailyGoalProps {
  selectedMinutes: number;
  onSelect: (minutes: number) => void;
  onFinish: () => void;
  isSubmitting?: boolean;
}

export const ScreenDailyGoal: React.FC<ScreenDailyGoalProps> = ({
  selectedMinutes,
  onSelect,
  onFinish,
  isSubmitting = false,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col space-y-6 animate-fadeIn">
      {/* Header Info */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 3 of 3: Habit & Commitment</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
          Set your daily learning goal
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Consistency is the secret to fluency. You can adjust your pace anytime in settings.
        </p>
      </div>

      {/* Goal Cards List */}
      <div className="space-y-3">
        {DAILY_GOAL_OPTIONS.map((goal: GoalOption) => {
          const isSelected = selectedMinutes === goal.minutes;

          return (
            <Card
              key={goal.minutes}
              hoverEffect
              onClick={() => onSelect(goal.minutes)}
              className={cn(
                'p-4 sm:p-5 flex items-center justify-between border-2 transition-all cursor-pointer select-none',
                isSelected
                  ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/40 shadow-sm'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              )}
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Time Badge Icon */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold shrink-0 transition-colors',
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  )}
                >
                  <span className="text-base leading-none font-black">{goal.minutes}</span>
                  <span className="text-[10px] uppercase font-semibold leading-tight opacity-80">
                    min
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {goal.title}
                    </span>
                    {goal.isRecommended && (
                      <Badge variant="blue" size="sm">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {goal.tagline}
                  </p>
                </div>
              </div>

              {/* XP Bonus & Checkmark */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  {goal.xpPerDay}
                </span>

                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all',
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : 'border-slate-300 dark:border-slate-700 bg-transparent'
                  )}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Habit Advice Card */}
      <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 shrink-0">
          <Trophy className="w-5 h-5" />
        </div>
        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          <strong>Tip:</strong> Learners who spend just <strong>{selectedMinutes} minutes/day</strong> achieve 3.4x faster recall than those doing irregular weekend study sessions.
        </p>
      </div>

      {/* Finish Action Button */}
      <div className="pt-2">
        <Button
          size="lg"
          variant="primary"
          isLoading={isSubmitting}
          rightIcon={<Clock className="w-4 h-4" />}
          onClick={onFinish}
          className="w-full shadow-md"
        >
          Finish & Create Account
        </Button>
      </div>
    </div>
  );
};
