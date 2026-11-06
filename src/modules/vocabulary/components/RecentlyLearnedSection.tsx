import React, { useState } from 'react';
import { VocabularyWord } from '../types/vocabulary.types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SpeechService } from '@/services/speech/speech.service';
import { Clock, Volume2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface RecentlyLearnedSectionProps {
  words: VocabularyWord[];
  onSelectWord: (word: VocabularyWord) => void;
}

export const RecentlyLearnedSection: React.FC<RecentlyLearnedSectionProps> = ({
  words,
  onSelectWord,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!words || words.length === 0) return null;

  const handleSpeak = async (word: VocabularyWord, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingId(word.id);
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word.word);
        utterance.lang = word.audioLangCode || 'en-US';
        utterance.rate = 0.95;
        utterance.onend = () => setPlayingId(null);
        utterance.onerror = () => setPlayingId(null);
        window.speechSynthesis.speak(utterance);
      } else {
        await SpeechService.speak(word.word, word.audioLangCode);
        setPlayingId(null);
      }
    } catch {
      setPlayingId(null);
    }
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Clock className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Recently Practiced Words
          </h4>
        </div>
        <span className="text-[11px] text-slate-400">{words.length} Active in Memory</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {words.map((item) => (
          <Card
            key={item.id}
            hoverEffect
            onClick={() => onSelectWord(item)}
            className="p-3.5 min-w-[210px] sm:min-w-[240px] shrink-0 border border-slate-200/80 dark:border-slate-800 space-y-2 cursor-pointer transition select-none"
          >
            <div className="flex items-center justify-between gap-2">
              <Badge variant="blue" size="sm">
                {item.learnedAt || 'Recent'}
              </Badge>
              <button
                type="button"
                onClick={(e) => handleSpeak(item, e)}
                className={cn(
                  'p-1.5 rounded-lg transition active:scale-95',
                  playingId === item.id
                    ? 'bg-blue-600 text-white animate-pulse'
                    : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
                title="Pronounce"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                {item.word}
              </div>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {item.romanized}
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
              = {item.meaning}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};
