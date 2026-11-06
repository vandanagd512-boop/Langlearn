import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/utils/cn';

interface OnboardingProgressProps {
  currentStep: number; // 1, 2, 3, 4
  totalSteps?: number;
  onBack?: () => void;
  onSkip?: () => void;
  showBack?: boolean;
  showSkip?: boolean;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps = 4,
  onBack,
  onSkip,
  showBack = true,
  showSkip = true,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto flex items-center justify-between gap-4 py-2 select-none">
      {/* Back button */}
      <div className="w-16 flex items-center">
        {showBack && onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Previous step"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
        ) : null}
      </div>

      {/* Segmented Step Bar */}
      <div className="flex-1 max-w-xs flex items-center gap-1.5">
        {Array.from({ length: totalSteps }, (_, idx) => {
          const stepNumber = idx + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={stepNumber}
              className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-200/80 dark:bg-slate-800 transition-all duration-300"
            >
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500 ease-out',
                  isCompleted || isCurrent
                    ? 'w-full bg-blue-600 dark:bg-blue-500 shadow-sm'
                    : 'w-0'
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Skip button */}
      <div className="w-16 flex items-center justify-end">
        {showSkip && onSkip ? (
          <button
            type="button"
            onClick={onSkip}
            className="text-xs font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition p-1.5 rounded-lg"
          >
            Skip
          </button>
        ) : null}
      </div>
    </div>
  );
};
