import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load content',
  message = 'Please check your connection and try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
