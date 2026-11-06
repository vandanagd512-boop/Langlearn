import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LanguageCatalogItem, ViewMode } from '../types/language-catalog.types';
import { Heart, Users, BookOpen, Play, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface LanguageCardProps {
  language: LanguageCatalogItem;
  viewMode: ViewMode;
  isActiveLanguage: boolean;
  isFavorite: boolean;
  onSelect: (lang: LanguageCatalogItem) => void;
  onToggleFavorite: (code: string, e: React.MouseEvent) => void;
  onStartOrContinue: (lang: LanguageCatalogItem, e: React.MouseEvent) => void;
}

export const LanguageCard: React.FC<LanguageCardProps> = ({
  language,
  viewMode,
  isActiveLanguage,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onStartOrContinue,
}) => {
  const progressPercent = Math.round(
    (language.completedLessons / (language.totalLessons || 1)) * 100
  );

  const isCompleted = progressPercent >= 100;

  const difficultyVariant =
    language.difficulty === 'Beginner'
      ? 'green'
      : language.difficulty === 'Intermediate'
      ? 'blue'
      : 'purple';

  if (viewMode === 'list') {
    return (
      <Card
        hoverEffect
        onClick={() => onSelect(language)}
        className={cn(
          'p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-2 transition-all cursor-pointer group',
          isActiveLanguage
            ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20'
            : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
        )}
      >
        {/* Left Side: Flag + Title + Script + Description */}
        <div className="flex items-start gap-4 min-w-0 max-w-xl">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl select-none shrink-0 shadow-inner group-hover:scale-105 transition-transform">
            {language.flag}
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {language.name}
              </h3>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                • {language.nativeName}
              </span>
              <Badge variant={difficultyVariant} size="sm">
                {language.difficulty}
              </Badge>
              {isActiveLanguage && (
                <Badge variant="blue" size="sm" dot>
                  Active Course
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
              {language.shortDescription}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{language.learnersCount}</span>
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{language.totalLessons} Lessons</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Progress & Actions */}
        <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
          {/* Progress bar */}
          <div className="w-32 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <ProgressBar value={progressPercent} color={isActiveLanguage ? 'blue' : 'gradient'} size="sm" />
          </div>

          {/* Favorite button */}
          <button
            type="button"
            onClick={(e) => onToggleFavorite(language.code, e)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={cn('w-4 h-4 transition-colors', isFavorite && 'fill-rose-500 text-rose-500')}
            />
          </button>

          {/* Action button */}
          <Button
            size="sm"
            variant={language.isStarted ? 'primary' : 'outline'}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={(e) => onStartOrContinue(language, e)}
          >
            {language.isStarted ? 'Continue' : 'Start Learning'}
          </Button>
        </div>
      </Card>
    );
  }

  // Grid Mode Card
  return (
    <Card
      hoverEffect
      onClick={() => onSelect(language)}
      className={cn(
        'p-5 flex flex-col justify-between space-y-4 border-2 transition-all cursor-pointer group select-none relative',
        isActiveLanguage
          ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 shadow-card'
          : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform shadow-inner">
            {language.flag}
          </div>

          <div className="flex items-center gap-1.5">
            {isActiveLanguage && (
              <Badge variant="blue" size="sm" dot>
                Active
              </Badge>
            )}
            <Badge variant={difficultyVariant} size="sm">
              {language.difficulty}
            </Badge>
            <button
              type="button"
              onClick={(e) => onToggleFavorite(language.code, e)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={cn('w-4 h-4 transition-colors', isFavorite && 'fill-rose-500 text-rose-500')}
              />
            </button>
          </div>
        </div>

        {/* Title, Native Script, Description */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {language.name}
            </h3>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              • {language.nativeName}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {language.shortDescription}
          </p>
        </div>

        {/* Metrics */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language.totalLessons} Lessons</span>
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{language.learnersCount}</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <ProgressBar value={progressPercent} color={isActiveLanguage ? 'blue' : 'gradient'} size="sm" />
        </div>
      </div>

      {/* Button Actions */}
      <div className="pt-2">
        <Button
          size="sm"
          variant={language.isStarted ? 'primary' : 'outline'}
          rightIcon={
            isCompleted ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : language.isStarted ? (
              <Play className="w-3 h-3 fill-current" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )
          }
          onClick={(e) => onStartOrContinue(language, e)}
          className="w-full text-xs font-semibold shadow-sm"
        >
          {isCompleted ? 'Review Course' : language.isStarted ? 'Continue' : 'Start Learning'}
        </Button>
      </div>
    </Card>
  );
};
