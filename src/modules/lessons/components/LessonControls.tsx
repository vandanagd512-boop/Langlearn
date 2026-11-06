import React from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, RotateCcw } from 'lucide-react';

interface LessonControlsProps {
  currentIndex: number;
  totalItems: number;
  isCompleted: boolean;
  onPrev: () => void;
  onNext: () => void;
  onMarkComplete: () => void;
  onNextLesson: () => void;
  hasNextLesson: boolean;
  hasPrevLesson: boolean;
}

export const LessonControls: React.FC<LessonControlsProps> = ({
  currentIndex,
  totalItems,
  isCompleted,
  onPrev,
  onNext,
  onMarkComplete,
  onNextLesson,
  hasNextLesson,
}) => {
  const isLastItem = currentIndex === totalItems - 1;
  const isFirstItem = currentIndex === 0;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left: Previous step */}
      <div className="w-full sm:w-auto">
        <Button
          variant="outline"
          size="md"
          disabled={isFirstItem}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={onPrev}
          className="w-full sm:w-auto text-xs font-semibold"
        >
          Previous Word
        </Button>
      </div>

      {/* Center: Step indicators */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalItems }).map((_, index) => (
          <span
            key={index}
            className={`h-2 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'w-6 bg-blue-600'
                : index < currentIndex
                ? 'w-2 bg-emerald-500'
                : 'w-2 bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Right Action: Next Word OR Mark Complete / Next Lesson */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {!isLastItem ? (
          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={onNext}
            className="w-full sm:w-auto text-xs font-semibold shadow-md"
          >
            Next Word
          </Button>
        ) : !isCompleted ? (
          <Button
            variant="primary"
            size="md"
            rightIcon={<CheckCircle2 className="w-4 h-4" />}
            onClick={onMarkComplete}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-xs font-bold shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Mark Lesson Complete
          </Button>
        ) : hasNextLesson ? (
          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={onNextLesson}
            className="w-full sm:w-auto text-xs font-bold shadow-md"
          >
            Go to Next Lesson
          </Button>
        ) : (
          <Button
            variant="outline"
            size="md"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={() => onPrev()}
            className="w-full sm:w-auto text-xs"
          >
            Review Lesson
          </Button>
        )}
      </div>
    </div>
  );
};
