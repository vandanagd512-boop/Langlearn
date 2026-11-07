import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Video,
  BookOpen,
  Mic,
  HelpCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '@/state/store';
import {
  LearningAnalyticsService,
  AnalyticsSummary,
  ActivityLogEntry,
} from '@/services/analytics/learning-analytics.service';
import { useNavigate } from 'react-router-dom';

type TimeRange = 'week' | 'month' | 'all';

export const ProgressPage: React.FC = () => {
  const { activeLanguageCode } = useAppStore();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(() => {
    // Default to today's day of week (0=Mon...6=Sun)
    const day = (new Date().getDay() + 6) % 7;
    return day;
  });

  // Real-time analytics state derived directly from activity logs
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(() =>
    LearningAnalyticsService.getAnalyticsSummary(timeRange, activeLanguageCode)
  );

  const [recentActivities, setRecentActivities] = useState<ActivityLogEntry[]>(() =>
    LearningAnalyticsService.getActivities().slice(0, 10)
  );

  // Sync and listen for live activity events across app
  const refreshLiveAnalytics = useCallback(() => {
    setAnalytics(LearningAnalyticsService.getAnalyticsSummary(timeRange, activeLanguageCode));
    setRecentActivities(LearningAnalyticsService.getActivities().slice(0, 10));
  }, [timeRange, activeLanguageCode]);

  useEffect(() => {
    refreshLiveAnalytics();

    const handleActivityLogged = () => {
      refreshLiveAnalytics();
    };

    window.addEventListener('learning_activity_logged', handleActivityLogged);
    return () => {
      window.removeEventListener('learning_activity_logged', handleActivityLogged);
    };
  }, [refreshLiveAnalytics]);

  // Max minutes across week for proportional chart scaling
  const maxWeeklyMinutes = useMemo(() => {
    const maxVal = Math.max(15, ...analytics.weeklyBreakdown.map((d) => d.minutes));
    return maxVal;
  }, [analytics.weeklyBreakdown]);

  const activeDayData = analytics.weeklyBreakdown[selectedDayIdx] || analytics.weeklyBreakdown[0];

  // Format task duration in human-readable format
  const formatTaskDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  // Get activity badge & icon
  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'video':
        return { icon: Video, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/60', label: 'Video Masterclass' };
      case 'speaking':
        return { icon: Mic, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/60', label: 'Speaking Practice' };
      case 'lesson':
        return { icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/60', label: 'Course Lesson' };
      case 'quiz':
        return { icon: HelpCircle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/60', label: 'Knowledge Quiz' };
      case 'vocabulary':
      default:
        return { icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/60', label: 'Vocabulary' };
    }
  };

  // Metrics cards data
  const metrics = [
    {
      label: 'Active Streak',
      value: `${analytics.streakDays} ${analytics.streakDays === 1 ? 'Day' : 'Days'}`,
      sub: analytics.streakDays > 0 ? 'Consecutive days practiced 🔥' : 'Practice today to ignite streak!',
      icon: Flame,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Experience Points',
      value: `${analytics.totalXp} XP`,
      sub: analytics.todayXp > 0 ? `+${analytics.todayXp} XP earned today` : 'Earn XP by completing tasks',
      icon: Zap,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Words Mastered',
      value: `${analytics.wordsMastered} Words`,
      sub: analytics.wordsMastered > 0 ? `Retention rate: ${analytics.memoryHealth.retentionRate}%` : 'Practice vocabulary cards',
      icon: Brain,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Actual Study Time',
      value: analytics.totalStudyHoursFormatted,
      sub: `${analytics.todayMinutes} mins practiced today`,
      icon: Clock,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
  ];

  const handleShare = () => {
    const text = `🏆 I have a ${analytics.streakDays}-day streak, studied ${analytics.totalStudyHoursFormatted}, and earned ${analytics.totalXp} XP on LangLearn!`;
    if (navigator.share) {
      navigator.share({
        title: 'My LangLearn Analytics',
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      notify({
        type: 'success',
        title: 'Summary Copied 📋',
        message: 'Your real progress stats were copied to clipboard!',
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <ModuleHeader
        title="Learning Analytics"
        subtitle="Live real-time tracking of your actual study time, task logs, and fluency progress."
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

      {/* 4 Real-Time Metric Cards */}
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

      {/* Real Daily Practice Breakdown Chart (Mon - Sun) */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Daily Practice Breakdown
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {activeDayData.day}: {activeDayData.minutes} mins (+{activeDayData.xp} XP • {activeDayData.tasksCount} {activeDayData.tasksCount === 1 ? 'task' : 'tasks'})
          </span>
        </div>

        {/* Bar distribution */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {analytics.weeklyBreakdown.map((item, idx) => {
            const heightPercent =
              item.minutes > 0
                ? Math.max(18, Math.round((item.minutes / maxWeeklyMinutes) * 100))
                : 6;
            const isSelected = selectedDayIdx === idx;

            return (
              <button
                key={item.day}
                onClick={() => setSelectedDayIdx(idx)}
                className="flex flex-col items-center gap-2 group focus:outline-none cursor-pointer"
              >
                <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-xl h-28 flex items-end p-1 transition border border-transparent hover:border-blue-400/30">
                  <div
                    className={`w-full rounded-lg transition-all duration-300 ${
                      item.minutes > 0
                        ? isSelected
                          ? 'bg-gradient-to-t from-blue-600 to-indigo-500 ring-2 ring-blue-400 shadow-sm'
                          : 'bg-gradient-to-t from-blue-500 to-indigo-500/80 group-hover:from-blue-600 group-hover:to-indigo-500'
                        : isSelected
                        ? 'bg-slate-300 dark:bg-slate-700 ring-2 ring-slate-400'
                        : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span
                    className={`text-[11px] font-bold ${
                      isSelected
                        ? 'text-blue-600 dark:text-blue-400 font-extrabold'
                        : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}
                  >
                    {item.day}
                  </span>
                  {item.isToday && (
                    <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Real Task Activity Log Feed (Live History of Every Completed Task) */}
      <Card className="p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Task Activity Log ({analytics.totalTasksCompleted} Completed)
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">Real-time duration tracking</span>
        </div>

        {recentActivities.length > 0 ? (
          <div className="space-y-2">
            {recentActivities.map((act) => {
              const badge = getActivityBadge(act.type);
              const Icon = badge.icon;
              const dateObj = new Date(act.timestamp);
              const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={act.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-3 transition hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${badge.bg} ${badge.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate">
                        {act.title}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{badge.label}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-500 dark:text-slate-300 font-bold flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {formatTaskDuration(act.durationSeconds)}
                        </span>
                        {typeof act.accuracyScore === 'number' && act.accuracyScore > 0 && (
                          <>
                            <span>•</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              Accuracy: {act.accuracyScore}% ⭐
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-amber-500 block">
                      +{act.xpEarned} XP
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {timeString}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Clean Empty State when user hasn't completed any task yet */
          <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Your Learning Dashboard is Ready!
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                No tasks completed yet. Complete a video masterclass or course lesson to track your exact study minutes, XP, and streaks live!
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-1">
              <Button
                size="sm"
                variant="primary"
                leftIcon={<Video className="w-3.5 h-3.5" />}
                onClick={() => navigate('/videos')}
              >
                Watch Flowing Video
              </Button>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<BookOpen className="w-3.5 h-3.5" />}
                onClick={() => navigate('/courses')}
              >
                Start Lesson
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* CEFR Skills Competency (Derived from actual task completions) */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Proficiency Competencies
            </h3>
          </div>
          <Badge variant="blue">
            {analytics.totalTasksCompleted > 10 ? 'CEFR A2 Track' : 'CEFR A1 Foundations'}
          </Badge>
        </div>

        <div className="space-y-3">
          {analytics.skillsBreakdown.map((s) => (
            <div key={s.skill} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {s.skill}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">{s.countLabel}</span>
                  <span className="text-slate-700 dark:text-slate-300 font-bold">{s.percent}%</span>
                </div>
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

      {/* Spaced Repetition (SRS) Memory Health */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Spaced Repetition Memory Health
            </h3>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            {analytics.memoryHealth.retentionRate}% Retention
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="p-2.5 rounded-xl bg-emerald-500/10">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">
              {analytics.memoryHealth.matureWords}
            </span>
            <span className="text-[10px] text-slate-500">Mature Words</span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 block">
              {analytics.memoryHealth.inLearning}
            </span>
            <span className="text-[10px] text-slate-500">In Learning</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 block">
              {analytics.memoryHealth.dueForReview}
            </span>
            <span className="text-[10px] text-slate-500">Due for Review</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
