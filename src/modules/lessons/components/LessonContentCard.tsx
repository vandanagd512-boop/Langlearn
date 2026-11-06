import React from 'react';
import { LessonItem } from '../types/lesson.types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LessonAudioPlayer } from './LessonAudioPlayer';
import { BookOpen, Lightbulb, MessageSquare, Quote, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LessonContentCardProps {
  item: LessonItem;
}

export const LessonContentCard: React.FC<LessonContentCardProps> = ({ item }) => {
  return (
    <Card className="overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm transition space-y-6">
      {/* Top Banner with Illustration & Tag */}
      <div
        className={cn(
          'w-full p-6 sm:p-8 bg-gradient-to-r text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden',
          item.illustrationGradient
        )}
      >
        {/* Giant Watermark Symbol */}
        <div className="absolute right-4 -bottom-6 text-9xl select-none opacity-20 pointer-events-none">
          {item.illustrationSymbol}
        </div>

        <div className="relative z-10 space-y-2">
          <Badge variant="neutral" className="bg-white/20 text-white border-0 text-[11px] font-bold">
            {item.categoryTag}
          </Badge>
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {item.targetText}
            </h2>
            <div className="text-lg sm:text-xl font-bold text-white/90">
              {item.romanizedText}
            </div>
          </div>
        </div>

        <div className="relative z-10 self-start sm:self-center">
          <span className="px-3.5 py-1.5 rounded-2xl bg-black/20 backdrop-blur-md text-white/90 font-mono text-xs sm:text-sm border border-white/10 shadow-sm">
            {item.pronunciation}
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 pt-0 space-y-6">
        {/* Audio Player Component */}
        <LessonAudioPlayer
          textToSpeak={item.targetText}
          langCode={item.audioLangCode}
        />

        {/* Meaning Box */}
        <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <BookOpen className="w-4 h-4" />
            <span>Meaning & Definition</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            {item.meaning}
          </div>
        </div>

        {/* Explanation & Cultural Context */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <span>Contextual Explanation</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            {item.explanation}
          </p>
        </div>

        {/* Example Sentence & Translation */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/20 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <MessageSquare className="w-4 h-4" />
              <span>Real-Life Example Sentence</span>
            </div>
            <Quote className="w-5 h-5 text-indigo-300 dark:text-indigo-700 opacity-60" />
          </div>

          <div className="space-y-1 pl-2 border-l-2 border-indigo-500">
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              {item.exampleSentence}
            </div>
            {item.exampleRomanized && (
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {item.exampleRomanized}
              </div>
            )}
            <div className="text-xs sm:text-sm font-semibold text-indigo-700 dark:text-indigo-300 pt-1">
              "{item.exampleTranslation}"
            </div>
          </div>
        </div>

        {/* Notes / Tips Callout */}
        {item.notes && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="font-bold">Linguistic Tip:</strong> {item.notes}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
