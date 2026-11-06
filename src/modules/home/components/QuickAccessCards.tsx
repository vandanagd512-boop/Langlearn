import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Compass, Languages, MessageSquare, Video, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickAccessCards: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'learn',
      title: 'Learn',
      subtitle: 'Skill roadmap & lessons',
      icon: Compass,
      path: '/learn',
      badge: 'Path',
      color: 'blue' as const,
      gradient: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'translator',
      title: 'Translator',
      subtitle: 'Live neural AI engine',
      icon: Languages,
      path: '/translator',
      badge: 'Live',
      color: 'green' as const,
      gradient: 'from-emerald-600 to-teal-600',
    },
    {
      id: 'videos',
      title: 'Videos',
      subtitle: '2m, 5m, 10m masterclasses',
      icon: Video,
      path: '/videos',
      badge: 'Academy',
      color: 'purple' as const,
      gradient: 'from-purple-600 to-pink-600',
    },
    {
      id: 'conversation',
      title: 'AI Roleplay',
      subtitle: 'Native conversation partner',
      icon: MessageSquare,
      path: '/conversation',
      badge: 'AI Coach',
      color: 'amber' as const,
      gradient: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Quick Actions
        </h3>
        <span className="text-[11px] text-slate-400">One-tap learning access</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Card
              key={act.id}
              hoverEffect
              onClick={() => navigate(act.path)}
              className="p-4 flex flex-col justify-between space-y-3 cursor-pointer group active:scale-95 transition-all"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${act.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <Badge variant={act.color} size="sm" className="text-[10px] px-1.5 py-0.5">
                  {act.badge}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {act.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {act.subtitle}
                </p>
              </div>

              <div className="flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 gap-1 pt-0.5">
                <span>Open</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};