import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Bookmark, Heart, Share2, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LessonHeaderProps {
  courseName: string;
  sectionTitle: string;
  lessonTitle: string;
  lessonSubtitle: string;
  category: string;
  difficulty: string;
  estimatedMinutes: number;
  xpReward: number;
  isBookmarked: boolean;
  isFavorite: boolean;
  onBackToCourse: () => void;
  onToggleBookmark: () => void;
  onToggleFavorite: () => void;
  onShareLesson: () => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  courseName,
  sectionTitle,
  lessonTitle,
  lessonSubtitle,
  category,
  difficulty,
  estimatedMinutes,
  xpReward,
  isBookmarked,
  isFavorite,
  onBackToCourse,
  onToggleBookmark,
  onToggleFavorite,
  onShareLesson,
}) => {
  const difficultyVariant =
    difficulty === 'Beginner' ? 'green' : difficulty === 'Intermediate' ? 'blue' : 'purple';

  return (
    <div className="space-y-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
      {/* Top Breadcrumb and Actions */}
      <div className="flex items-center justify-between gap-3">
        {/* Back Link */}
        <button
          type="button"
          onClick={onBackToCourse}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition group py-1"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>
            {courseName} • {sectionTitle}
          </span>
        </button>

        {/* Action Buttons (Bookmark, Favorite, Share) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleBookmark}
            className="p-2 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition active:scale-95"
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Lesson'}
          >
            <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-amber-500 text-amber-500')} />
          </button>

          <button
            type="button"
            onClick={onToggleFavorite}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition active:scale-95"
            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            <Heart className={cn('w-4 h-4', isFavorite && 'fill-rose-500 text-rose-500')} />
          </button>

          <button
            type="button"
            onClick={onShareLesson}
            className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition active:scale-95"
            title="Share Lesson"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lesson Title, Subtitle, Badges */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="blue" size="sm">
            {category}
          </Badge>
          <Badge variant={difficultyVariant} size="sm">
            {difficulty}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>~{estimatedMinutes} mins</span>
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+{xpReward} XP</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {lessonTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          {lessonSubtitle}
        </p>
      </div>
    </div>
  );
};
