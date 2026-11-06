import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Flame, Zap, Volume2, Trophy, Sparkles } from 'lucide-react';
import { DailyWord } from '../types/home.types';
import { SpeechService } from '@/services/speech/speech.service';
import { useNotification } from '@/context/NotificationContext';

interface DailyActivityGridProps {
  streakDays: number;
  xpPoints: number;
  dailyGoalMinutes: number;
  completedMinutesToday: number;
  todayWord: DailyWord;
}

export const DailyActivityGrid: React.FC<DailyActivityGridProps> = ({
  streakDays,
  xpPoints,
  dailyGoalMinutes,
  completedMinutesToday,
  todayWord,
}) => {
  const { notify } = useNotification();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const goalProgressPercent = Math.min(
    100,
    Math.round((completedMinutesToday / (dailyGoalMinutes || 15)) * 100)
  );

  const handlePronounce = async () => {
    try {
      setIsPlayingAudio(true);
      await SpeechService.speak(todayWord.term, todayWord.languageCode);
    } catch {
      notify({
        type: 'warning',
        message: 'Speech synthesis not supported on this device/browser.',
      });
    } finally {
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* 1. Daily Streak Card */}
      <Card className="p-4 flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Streak
          </span>
          <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Flame className="w-4 h-4 fill-amber-500 animate-pulse" />
          </div>
        </div>

        <div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">
            {streakDays} <span className="text-xs font-bold text-slate-400">Days</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Top 10% active
          </p>
        </div>

        <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-50/70 dark:bg-amber-950/40 px-2 py-1.5 rounded-xl flex items-center gap-1">
          <Sparkles className="w-3 h-3 shrink-0" />
          <span className="truncate">Aim for {streakDays + 1} days!</span>
        </div>
      </Card>

      {/* 2. Today's Word Card */}
      <Card className="p-4 flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Word of Day
          </span>
          <button
            type="button"
            onClick={handlePronounce}
            disabled={isPlayingAudio}
            className="p-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded-full hover:scale-105 transition"
            title="Listen to pronunciation"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
          </button>
        </div>

        <div>
          <div className="text-base font-extrabold text-slate-900 dark:text-slate-100 truncate">
            {todayWord.term}
          </div>
          <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold truncate">
            {todayWord.translation}
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-mono truncate bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-lg">
          {todayWord.phonetic}
        </div>
      </Card>

      {/* 3. Daily Goal Progress Card */}
      <Card className="p-4 flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Daily Goal
          </span>
          <Badge variant={goalProgressPercent >= 100 ? 'green' : 'blue'} size="sm" className="text-[9px] px-1.5 py-0.5">
            {completedMinutesToday}/{dailyGoalMinutes}m
          </Badge>
        </div>

        <div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">
            {goalProgressPercent}%
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {goalProgressPercent >= 100
              ? 'Goal reached! 🎉'
              : `${Math.max(0, dailyGoalMinutes - completedMinutesToday)}m left`}
          </p>
        </div>

        <ProgressBar
          value={goalProgressPercent}
          color={goalProgressPercent >= 100 ? 'green' : 'gradient'}
          size="sm"
        />
      </Card>

      {/* 4. Total XP Points Card */}
      <Card className="p-4 flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total XP
          </span>
          <div className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Zap className="w-4 h-4 fill-current animate-pulse" />
          </div>
        </div>

        <div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">
            {xpPoints} <span className="text-xs font-bold text-slate-400">XP</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            Level 2 Polyglot
          </p>
        </div>

        <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/70 dark:bg-blue-950/40 px-2 py-1.5 rounded-xl flex items-center gap-1">
          <Trophy className="w-3 h-3 shrink-0" />
          <span className="truncate">League #4</span>
        </div>
      </Card>
    </div>
  );
};