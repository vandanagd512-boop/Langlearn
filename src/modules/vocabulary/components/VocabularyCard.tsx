import React, { useState } from 'react';
import { VocabularyWord, VocabViewMode } from '../types/vocabulary.types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SpeechService } from '@/services/speech/speech.service';
import { Volume2, Bookmark, Heart, ChevronDown, ChevronUp, Quote } from 'lucide-react';
import { cn } from '@/utils/cn';

interface VocabularyCardProps {
  word: VocabularyWord;
  viewMode: VocabViewMode;
  isBookmarked: boolean;
  isFavorite: boolean;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const VocabularyCard: React.FC<VocabularyCardProps> = ({
  word,
  viewMode,
  isBookmarked,
  isFavorite,
  onToggleBookmark,
  onToggleFavorite,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word.word);
        utterance.lang = word.audioLangCode || 'en-US';
        utterance.rate = 0.95;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      } else {
        await SpeechService.speak(word.word, word.audioLangCode);
        setIsPlaying(false);
      }
    } catch {
      setIsPlaying(false);
    }
  };

  const masteryVariant =
    word.masteryStatus === 'mastered'
      ? 'green'
      : word.masteryStatus === 'learning'
      ? 'blue'
      : word.masteryStatus === 'review_due'
      ? 'amber'
      : 'neutral';

  if (viewMode === 'list') {
    return (
      <Card
        className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200/80 dark:border-slate-800 transition hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
      >
        <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
          {/* Audio Button */}
          <button
            type="button"
            onClick={handleSpeak}
            className={cn(
              'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition active:scale-95 shadow-sm',
              isPlaying
                ? 'bg-blue-600 text-white animate-pulse'
                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100'
            )}
            title="Listen to pronunciation"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          {/* Word, Romanized & Meaning */}
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                {word.word}
              </h3>
              <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">
                ({word.romanized})
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                {word.phonetic}
              </span>
              <Badge variant={masteryVariant} size="sm">
                {word.masteryStatus.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
              {word.meaning}
            </p>
          </div>
        </div>

        {/* Right side: Example sentence summary & actions */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition select-none"
          >
            <span>Example</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => onToggleBookmark(word.id, e)}
              className="p-2 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition active:scale-95"
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
            >
              <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-amber-500 text-amber-500')} />
            </button>
            <button
              type="button"
              onClick={(e) => onToggleFavorite(word.id, e)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition active:scale-95"
              title={isFavorite ? 'Remove Favorite' : 'Favorite'}
            >
              <Heart className={cn('w-4 h-4', isFavorite && 'fill-rose-500 text-rose-500')} />
            </button>
          </div>
        </div>

        {/* Collapsible Example row in List mode */}
        {isExpanded && (
          <div className="w-full pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1 animate-fadeIn">
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              "{word.exampleSentence}"
            </div>
            {word.exampleRomanized && (
              <div className="text-[11px] text-slate-400">{word.exampleRomanized}</div>
            )}
            <div className="text-blue-600 dark:text-blue-400 font-medium">
              "{word.exampleTranslation}"
            </div>
          </div>
        )}
      </Card>
    );
  }

  // Grid Mode Card
  return (
    <Card className="p-5 flex flex-col justify-between space-y-4 border border-slate-200/80 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-sm relative group">
      <div className="space-y-3">
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="blue" size="sm">
              {word.categoryLabel}
            </Badge>
            <Badge variant={masteryVariant} size="sm">
              {word.masteryStatus.replace('_', ' ')}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => onToggleBookmark(word.id, e)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition active:scale-95"
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
            >
              <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-amber-500 text-amber-500')} />
            </button>
            <button
              type="button"
              onClick={(e) => onToggleFavorite(word.id, e)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition active:scale-95"
              title={isFavorite ? 'Remove Favorite' : 'Favorite'}
            >
              <Heart className={cn('w-4 h-4', isFavorite && 'fill-rose-500 text-rose-500')} />
            </button>
          </div>
        </div>

        {/* Word Display & Pronunciation */}
        <div className="space-y-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {word.word}
            </h3>
            <button
              type="button"
              onClick={handleSpeak}
              className={cn(
                'p-2 rounded-xl transition active:scale-95 shrink-0',
                isPlaying
                  ? 'bg-blue-600 text-white animate-pulse'
                  : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100'
              )}
              title="Play pronunciation"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {word.romanized}
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {word.phonetic}
          </span>
        </div>

        {/* Meaning Box */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Meaning
          </span>
          <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
            {word.meaning}
          </div>
        </div>

        {/* Example Sentence Section */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50/20 dark:from-slate-900 dark:to-indigo-950/20 border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-500">
            <Quote className="w-3 h-3" />
            <span>Example</span>
          </div>
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
            {word.exampleSentence}
          </div>
          {word.exampleRomanized && (
            <div className="text-[11px] text-slate-400">{word.exampleRomanized}</div>
          )}
          <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            "{word.exampleTranslation}"
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span className="capitalize">{word.partOfSpeech}</span>
        {word.learnedAt && <span>Learned {word.learnedAt}</span>}
      </div>
    </Card>
  );
};
