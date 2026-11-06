import React, { useState } from 'react';
import { ModuleHeader } from '@/components/layout/ModuleHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Trophy,
  Flame,
  Zap,
  Clock,
  ChevronUp,
} from 'lucide-react';
import { useAppStore } from '@/state/store';
import { useNavigate } from 'react-router-dom';

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  location: string;
  streakDays: number;
  xpPoints: number;
  isCurrentUser?: boolean;
}

const LEAGUES = [
  { id: 'bronze', name: 'Bronze League', icon: '🥉', minXp: 0, color: 'text-amber-700' },
  { id: 'silver', name: 'Silver League', icon: '🥈', minXp: 200, color: 'text-slate-400' },
  { id: 'gold', name: 'Gold League', icon: '🥇', minXp: 500, color: 'text-yellow-500' },
  { id: 'diamond', name: 'Diamond League', icon: '💎', minXp: 1000, color: 'text-cyan-400' },
];

export const LeaderboardPage: React.FC = () => {
  const { user } = useAppStore();
  const navigate = useNavigate();
  const [activeLeague, setActiveLeague] = useState('silver');

  const rankingList: LeaderboardUser[] = [
    { rank: 1, name: 'Aarav Patel', avatar: '👨‍🎓', location: 'Gujarat', streakDays: 16, xpPoints: 780 },
    { rank: 2, name: 'Sneha Kulkarni', avatar: '👩‍🏫', location: 'Karnataka', streakDays: 14, xpPoints: 690 },
    { rank: 3, name: 'Vikram Sethi', avatar: '🧑‍💻', location: 'Delhi', streakDays: 11, xpPoints: 610 },
    { rank: 4, name: 'Priya Sundaram', avatar: '👩‍⚕️', location: 'Tamil Nadu', streakDays: 9, xpPoints: 520 },
    {
      rank: 5,
      name: `${user?.name || 'You'} (Active)`,
      avatar: '🌟',
      location: 'India',
      streakDays: user?.streakDays ?? 5,
      xpPoints: user?.xpPoints ?? 340,
      isCurrentUser: true,
    },
    { rank: 6, name: 'Rohan Das', avatar: '👨‍🎨', location: 'West Bengal', streakDays: 6, xpPoints: 310 },
    { rank: 7, name: 'Ananya Nair', avatar: '👩‍🎤', location: 'Kerala', streakDays: 5, xpPoints: 290 },
    { rank: 8, name: 'Harpreet Singh', avatar: '👳‍♂️', location: 'Punjab', streakDays: 4, xpPoints: 250 },
    { rank: 9, name: 'Meera Deshmukh', avatar: '👩‍💻', location: 'Maharashtra', streakDays: 3, xpPoints: 210 },
    { rank: 10, name: 'Aditya Reddy', avatar: '👨‍💼', location: 'Telangana', streakDays: 2, xpPoints: 190 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <ModuleHeader
        title="Weekly Competitive Leagues"
        subtitle="Compete with learners across India. Top 3 gain promotion to Gold League!"
        icon={Trophy}
        badge="Season 12 Live"
      />

      {/* League Badge & Season Countdown Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-800 text-white shadow-xl shadow-blue-500/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 rounded-2xl bg-white/15 backdrop-blur-md">
              🥈
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Silver League</h2>
                <Badge variant="blue" className="bg-white/20 text-white border-0 text-[10px]">
                  Division 2
                </Badge>
              </div>
              <p className="text-xs text-blue-100 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Season ends in: <strong>2d 18h 42m</strong></span>
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="secondary"
            className="bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold py-1 px-3 h-auto shadow"
            onClick={() => navigate('/practice')}
          >
            Earn XP
          </Button>
        </div>

        {/* League Tier Pills */}
        <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-white/15 text-center">
          {LEAGUES.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLeague(l.id)}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition ${
                activeLeague === l.id
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <span className="block text-base leading-none mb-0.5">{l.icon}</span>
              <span className="truncate block">{l.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Promotion Zone Explanation */}
      <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ChevronUp className="w-4 h-4 text-emerald-500 shrink-0 animate-bounce" />
          <span><strong>Promotion Zone:</strong> Top 3 advance to Gold League this Sunday!</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          +150 Gems
        </span>
      </div>

      {/* Rankings Table */}
      <Card className="p-3 space-y-2">
        {rankingList.map((item) => {
          const isTop3 = item.rank <= 3;
          const isUser = item.isCurrentUser;

          return (
            <div
              key={item.rank}
              className={`p-3 rounded-2xl flex items-center justify-between transition-all ${
                isUser
                  ? 'bg-blue-50 dark:bg-blue-950/50 border-2 border-blue-500 shadow-sm ring-2 ring-blue-500/20 scale-[1.01]'
                  : isTop3
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border border-amber-300/40 dark:border-amber-800/40'
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800'
              }`}
            >
              {/* Rank & User Info */}
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-6 text-center font-black text-sm shrink-0 ${
                    item.rank === 1
                      ? 'text-yellow-500'
                      : item.rank === 2
                      ? 'text-slate-400'
                      : item.rank === 3
                      ? 'text-amber-600'
                      : 'text-slate-400'
                  }`}
                >
                  {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                </span>

                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl shrink-0 shadow-subtle">
                  {item.avatar}
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {item.name}
                    </h4>
                    {isUser && (
                      <Badge variant="blue" size="sm" className="text-[9px] px-1.5 py-0">
                        You
                      </Badge>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 flex items-center gap-2">
                    <span>{item.location}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                      <Flame className="w-2.5 h-2.5 fill-current" /> {item.streakDays}d
                    </span>
                  </p>
                </div>
              </div>

              {/* XP Points */}
              <div className="text-right shrink-0">
                <span className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1 justify-end">
                  <Zap className="w-3.5 h-3.5 text-blue-500 fill-current" />
                  {item.xpPoints}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  XP
                </span>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
};