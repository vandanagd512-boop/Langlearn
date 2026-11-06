import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const criteria = useMemo(() => {
    return [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'Contains a number (0-9)', met: /\d/.test(password) },
      { label: 'Contains an uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'Contains a special symbol', met: /[^A-Za-z0-9]/.test(password) },
    ];
  }, [password]);

  const score = useMemo(() => {
    if (!password) return 0;
    return criteria.filter((c) => c.met).length;
  }, [password, criteria]);

  const strengthLabel = useMemo(() => {
    if (score === 0) return { text: '', color: '' };
    if (score === 1) return { text: 'Weak', color: 'text-rose-500' };
    if (score === 2) return { text: 'Fair', color: 'text-amber-500' };
    if (score === 3) return { text: 'Good', color: 'text-blue-500' };
    return { text: 'Strong', color: 'text-emerald-500' };
  }, [score]);

  if (!password) return null;

  return (
    <div className="space-y-2 pt-1 animate-fadeIn">
      {/* Segmented bar */}
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4].map((level) => {
          const isActive = score >= level;
          const barColor =
            score === 1
              ? 'bg-rose-500'
              : score === 2
              ? 'bg-amber-500'
              : score === 3
              ? 'bg-blue-500'
              : 'bg-emerald-500';

          return (
            <div
              key={level}
              className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 transition-colors"
            >
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  isActive ? barColor : 'w-0'
                )}
              />
            </div>
          );
        })}
        <span className={cn('text-[11px] font-bold w-12 text-right', strengthLabel.color)}>
          {strengthLabel.text}
        </span>
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
        {criteria.map((c) => (
          <div
            key={c.label}
            className={cn(
              'flex items-center gap-1.5 transition-colors',
              c.met ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'
            )}
          >
            {c.met ? (
              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
            ) : (
              <X className="w-3 h-3 text-slate-300 dark:text-slate-700 shrink-0" />
            )}
            <span className="truncate">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
