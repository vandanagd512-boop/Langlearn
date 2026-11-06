import React, { useState } from 'react';
import { VocabularyWord } from '../types/vocabulary.types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SpeechService } from '@/services/speech/speech.service';
import {
  Sparkles,
  Volume2,
  Bookmark,
  Heart,
  Quote,
  Lightbulb,
  Flame,
  CheckCircle2,
  Gauge,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface DailyVocabularyCardProps {
  word: VocabularyWord;
  isBookmarked: boolean;
  isFavorite: boolean;
  onToggleBookmark: () => void;
  onToggleFavorite: () => void;
  onMarkLearned: () => void;
}

export const DailyVocabularyCard: React.FC<DailyVocabularyCardProps> = ({
  word,
  isBookmarked,
  isFavorite,
  onToggleBookmark,
  onToggleFavorite,
  onMarkLearned,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<0.75 | 1.0>(1.0);

  const handleSpeak = async () => {
    setIsPlaying(true);
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word.word);
        utterance.lang = word.audioLangCode || 'en-US';
        utterance.rate = playbackRate;
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

  const toggleRate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaybackRate((prev) => (prev === 1.0 ? 0.75 : 1.0));
  };

  return (
    <Card className="relative overflow-hidden border-2 border-amber-300/80 dark:border-amber-700/60 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-rose-950/20 shadow-md">
      {/* Decorative badge top ribbon */}
      <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-4 py-1 rounded-bl-2xl shadow-sm flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Word of the Day</span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Header tags & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="amber" size="sm">
              Daily Vocabulary
            </Badge>
            <Badge variant="blue" size="sm">
              {word.categoryLabel}
            </Badge>
            <span className="text-xs font-semibold text-slate-500 capitalize">
              • {word.partOfSpeech}
            </span>
            {word.streakDays && word.streakDays > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                <Flame className="w-3.5 h-3.5 fill-current" />
                {word.streakDays} Day Streak
              </span>
            )}
          </div>

          {/* Bookmark & Favorite buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleBookmark}
              className="p-2 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-white dark:hover:bg-slate-800 transition active:scale-95"
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Word'}
            >
              <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-amber-500 text-amber-500')} />
            </button>
            <button
              type="button"
              onClick={onToggleFavorite}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 transition active:scale-95"
              title={isFavorite ? 'Remove Favorite' : 'Favorite Word'}
            >
              <Heart className={cn('w-4 h-4', isFavorite && 'fill-rose-500 text-rose-500')} />
            </button>
          </div>
        </div>

        {/* Word Display & Audio Controls */}
        <div className="space-y-3 pb-2">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight break-words">
                {word.word}
              </h2>
              {word.romanized !== word.word && (
                <span className="text-base sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                  ({word.romanized})
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                {word.phonetic}
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                = {word.meaning}
              </span>
            </div>
          </div>

          {/* Audio Playback Controls */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <button
              type="button"
              onClick={handleSpeak}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition active:scale-95 select-none"
              title="Play Pronunciation"
            >
              <Volume2 className={cn('w-4 h-4', isPlaying && 'animate-pulse')} />
              <span>{isPlaying ? 'Speaking...' : 'Pronounce'}</span>
            </button>

            <button
              type="button"
              onClick={toggleRate}
              className="px-2.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 transition"
              title="Toggle Slow / Normal Speed"
            >
              <Gauge className="w-3.5 h-3.5 inline mr-1" />
              <span>{playbackRate === 1.0 ? '1.0x' : '0.75x'}</span>
            </button>
          </div>
        </div>

        {/* Example Sentence Box */}
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Example in Context</span>
            <Quote className="w-4 h-4 text-slate-300 dark:text-slate-700" />
          </div>
          <div className="space-y-1">
            <div className="text-base font-bold text-slate-900 dark:text-slate-100">
              {word.exampleSentence}
            </div>
            {word.exampleRomanized && (
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {word.exampleRomanized}
              </div>
            )}
            <div className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">
              "{word.exampleTranslation}"
            </div>
          </div>
        </div>

        {/* Cultural Note Callout */}
        {word.culturalNote && (
          <div className="flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200 bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200/50 dark:border-amber-900/30">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong>Cultural Context:</strong> {word.culturalNote}
            </span>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-amber-200/40 dark:border-amber-900/40">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Added to Spaced Repetition Flashcards Deck</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={onMarkLearned}
            className="w-full sm:w-auto text-xs"
          >
            Mark as Practiced Today
          </Button>
        </div>
      </div>
    </Card>
  );
};
