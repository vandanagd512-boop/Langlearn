import React, { useState, useEffect, useRef } from 'react';
import { SpeechService } from '@/services/speech/speech.service';
import { Play, Pause, RotateCcw, Volume2, Gauge } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LessonAudioPlayerProps {
  textToSpeak: string;
  langCode: string;
}

export const LessonAudioPlayer: React.FC<LessonAudioPlayerProps> = ({
  textToSpeak,
  langCode,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<0.75 | 1.0>(1.0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stop previous speech if textToSpeak changes
  useEffect(() => {
    SpeechService.stop();
    setIsPlaying(false);
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [textToSpeak]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      SpeechService.stop();
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setIsPlaying(true);
    setProgress(15);

    // Animate progress smoothly
    timerRef.current = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 15));
    }, 180);

    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = langCode || 'en-US';
        utterance.rate = playbackRate;
        utterance.pitch = 1.0;

        utterance.onend = () => {
          setIsPlaying(false);
          setProgress(100);
          if (timerRef.current) clearInterval(timerRef.current);
          setTimeout(() => setProgress(0), 400);
        };

        utterance.onerror = () => {
          setIsPlaying(false);
          setProgress(0);
          if (timerRef.current) clearInterval(timerRef.current);
        };

        window.speechSynthesis.speak(utterance);
      } else {
        await SpeechService.speak(textToSpeak, langCode);
        setIsPlaying(false);
        setProgress(100);
      }
    } catch {
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const handleReplay = () => {
    SpeechService.stop();
    setIsPlaying(false);
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => {
      handlePlayPause();
    }, 100);
  };

  const toggleRate = () => {
    const newRate = playbackRate === 1.0 ? 0.75 : 1.0;
    setPlaybackRate(newRate);
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-inner">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Play & Control Buttons */}
        <div className="flex items-center gap-2">
          {/* Main Play/Pause Button */}
          <button
            type="button"
            onClick={handlePlayPause}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition active:scale-95 select-none"
            title={isPlaying ? 'Pause audio' : 'Play pronunciation audio'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Listen Audio</span>
              </>
            )}
          </button>

          {/* Replay Button */}
          <button
            type="button"
            onClick={handleReplay}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold transition active:scale-95"
            title="Replay pronunciation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Slow Playback Toggle */}
          <button
            type="button"
            onClick={toggleRate}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border select-none',
              playbackRate === 0.75
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100'
            )}
            title="Toggle normal or slow playback speed"
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>{playbackRate === 0.75 ? '0.75x Slow' : '1.0x Normal'}</span>
          </button>
        </div>

        {/* Audio Visualizer Waves Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Volume2 className={cn('w-4 h-4', isPlaying ? 'text-blue-600 animate-pulse' : 'text-slate-400')} />
          <span>Native TTS Audio</span>
          <div className="flex items-center gap-1 ml-1 h-3">
            <span
              className={cn(
                'w-1 bg-blue-500 rounded-full transition-all duration-150',
                isPlaying ? 'h-3 animate-bounce' : 'h-1'
              )}
            />
            <span
              className={cn(
                'w-1 bg-blue-500 rounded-full transition-all duration-150 delay-75',
                isPlaying ? 'h-4 animate-bounce' : 'h-1'
              )}
            />
            <span
              className={cn(
                'w-1 bg-blue-500 rounded-full transition-all duration-150 delay-150',
                isPlaying ? 'h-2 animate-bounce' : 'h-1'
              )}
            />
          </div>
        </div>
      </div>

      {/* Audio Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
