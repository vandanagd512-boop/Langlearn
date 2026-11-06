import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Trophy, Flame, Zap, Award, Target, ChevronRight } from 'lucide-react';
import { UserAchievementSummary } from '../types/home.types';
import { useNavigate } from 'react-router-dom';

interface AchievementsPreviewProps {
  summary: UserAchievementSummary;
}

export const AchievementsPreview: React.FC<AchievementsPreviewProps> = ({ summary }) => {
  const navigate = useNavigate();

  const achievements = [
    {
      id: 'streak',
      title: `${summary.streakDays}-Day Streak`,
      desc: 'Consistent daily immersion',
      icon: Flame,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50',
      badge: 'Active',
      badgeVariant: 'amber' as const,
    },
    {
      id: 'xp',
      title: `${summary.totalXp} Total XP`,
      desc: 'Experience across all courses',
      icon: Zap,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/50',
      badge: 'Level 2',
      badgeVariant: 'blue' as const,
    },
    {
      id: 'lessons',
      title: `${summary.completedLessonsCount} Lessons Done`,
      desc: 'Bite-sized units mastered',
      icon: Award,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50',
      badge: 'Rising',
      badgeVariant: 'green' as const,
    },
    {
      id: 'time',
      title: `${summary.totalLearningMinutes} Mins Invested`,
      desc: 'High active recall time',
      icon: Target,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/50',
      badge: summary.rankTitle,
      badgeVariant: 'purple' as const,
    },
  ];

  return (
    <Card className="p-6 space-y-5 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900/60 dark:to-blue-950/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 shadow-sm">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Achievements & League Standing
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranked in the <strong>Polyglot Silver League</strong> this week
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/leaderboard')}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <span>View League</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {achievements.map((ach) => {
          const Icon = ach.icon;
          return (
            <div
              key={ach.id}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-2 shadow-subtle"
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${ach.color}`}>
                  <Icon className="w-4 h-4 fill-current" />
                </div>
                <Badge variant={ach.badgeVariant} size="sm" className="text-[9px] px-1.5 py-0.5">
                  {ach.badge}
                </Badge>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {ach.title}
                </h4>
                <p className="text-[10px] text-slate-400 truncate">{ach.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
