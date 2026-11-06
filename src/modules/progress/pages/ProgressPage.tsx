import React, { useState } from 'react';
import { ModuleHeader } from '@/components/layout/ModuleHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/context/NotificationContext';
import {
  Activity,
  Flame,
  Zap,
  Calendar,
  Clock,
  TrendingUp,
  Brain,
  Share2,
} from 'lucide-react';
import { useAppStore } from '@/state/store';

type TimeRange = 'week' | 'month' | 'all';

export const ProgressPage: React.FC = () => {
  const { user } = useAppStore();
  const { notify } = useNotification();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [activeDayIdx, setActiveDayIdx] = useState<number>(3); // default Thursday

  const weekDays = [
    { day: 'Mon', minutes: 18, xp: 45 },
    { day: 'Tue', minutes: 25, xp: 60 },
    { day: 'Wed', minutes: 15, xp: 35 },
    { day: 'Thu', minutes: 30, xp: 80 },
    { day: 'Fri', minutes: 22, xp: 55 },
    { day: 'Sat', minutes: 12, xp: 30 },
    { day: 'Sun', minutes: 28, xp: 70 },
  ];

  const maxMinutes = 30;

  const metrics = [
    {
      label: 'Active Streak',
      value: `${user?.streakDays ?? 5} Days`,
      sub: 'Top 5% of learners',
      icon: Flame,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Experience Points',
      value: `${user?.xpPoints ?? 340} XP`,
      sub: '+85 XP this week',
      icon: Zap,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Words Mastered',
      value: '86 Words',
      sub: 'Retention rate 94%',
      icon: Brain,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Study Time',
      value: '4.8 Hours',
      sub: '82% of weekly goal',
      icon: Clock,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
  ];

  const skillsBreakdown = [
    { skill: 'Vocabulary & Phrases', level: 'Level A2', percent: 78, color: 'bg-blue-600' },
    { skill: 'Listening Comprehension', level: 'Level A2', percent: 85, color: 'bg-indigo-600' },
    { skill: 'Speaking & Pronunciation', level: 'Level A1', percent: 62, color: 'bg-emerald-500' },
    { skill: 'Grammar & Syntax', level: 'Level A1', percent: 70, color: 'bg-purple-600' },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'LangLearn Progress',
        text: `I have a ${user?.streakDays ?? 5}-day streak and earned ${user?.xpPoints ?? 340} XP on LangLearn!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`I have a ${user?.streakDays ?? 5}-day streak and earned ${user?.xpPoints ?? 340} XP on LangLearn!`);
      notify({
        type: 'success',
        title: 'Summary Copied',
        message: 'Progress stats copied to clipboard!',
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <ModuleHeader
        title="Learning Analytics"
        subtitle="Track retention rates, time spent, and CEFR skill balance."
        icon={Activity}
        badge="Live Metrics"
        actions={
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
            onClick={handleShare}
          >
            Share
          </Button>
        }
      />

      {/* Time Range Selector */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs">
          {(['week', 'month', 'all'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-4 py-1.5 rounded-xl font-bold capitalize transition ${
                timeRange === r
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {r === 'week' ? 'This Week' : r === 'month' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {m.label}
                </span>
                <div className={`p-1.5 rounded-xl ${m.bg}`}>
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {m.value}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">{m.sub}</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Interactive Activity Chart */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Daily Practice Breakdown
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {weekDays[activeDayIdx].day}: {weekDays[activeDayIdx].minutes} mins (+{weekDays[activeDayIdx].xp} XP)
          </span>
        </div>

        {/* Bar distribution */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {weekDays.map((item, idx) => {
            const heightPercent = Math.round((item.minutes / maxMinutes) * 100);
            const isSelected = activeDayIdx === idx;
            return (
              <button
                key={item.day}
                onClick={() => setActiveDayIdx(idx)}
                className="flex flex-col items-center gap-2 group focus:outline-none"
              >
                <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-xl h-28 flex items-end p-1 transition">
                  <div
                    className={`w-full rounded-lg transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-t from-blue-600 to-indigo-500 ring-2 ring-blue-400'
                        : 'bg-gradient-to-t from-slate-400 to-slate-300 dark:from-slate-700 dark:to-slate-600 group-hover:from-blue-500 group-hover:to-indigo-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span
                  className={`text-[11px] font-bold ${
                    isSelected
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                  }`}
                >
                  {item.day}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* CEFR Skills Competency */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Proficiency Competencies
            </h3>
          </div>
          <Badge variant="blue">CEFR A2 Track</Badge>
        </div>

        <div className="space-y-3">
          {skillsBreakdown.map((s) => (
            <div key={s.skill} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {s.skill}
                </span>
                <span className="text-slate-500 font-bold">{s.percent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${s.color} transition-all duration-500`}
                  style={{ width: `${s.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Spaced Repetition (SRS) Memory Curve */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Spaced Repetition Memory Health
            </h3>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            94% Retention
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="p-2.5 rounded-xl bg-emerald-500/10">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">
              64
            </span>
            <span className="text-[10px] text-slate-500">Mature Words</span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 block">
              22
            </span>
            <span className="text-[10px] text-slate-500">In Learning</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 block">
              8
            </span>
            <span className="text-[10px] text-slate-500">Due for Review</span>
          </div>
        </div>
      </Card>
    </div>
  );
};