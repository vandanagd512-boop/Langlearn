import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { History, CheckCircle2, Calendar, Zap, BookOpen } from 'lucide-react';
import { RecentActivityItem } from '../types/home.types';
import { useNavigate } from 'react-router-dom';

interface RecentActivitySectionProps {
  activities: RecentActivityItem[];
}

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({ activities }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-500" />
            <span>Recent Activity</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track your latest lesson submissions and mastery ratings
          </p>
        </div>
        <button
          onClick={() => navigate('/progress')}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Detailed History
        </button>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-2.5">
          {activities.map((item) => (
            <Card
              key={item.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-subtle transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                      {item.lessonTitle}
                    </h4>
                    <Badge variant="green" size="sm">
                      {item.scorePercent}% Score
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>{item.courseTitle}</span>
                    <span>•</span>
                    <span>{item.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 text-xs shrink-0">
                <span className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  +{item.xpEarned} XP
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.completedAt}</span>
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="p-8 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              No lessons completed yet
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
              Complete your first interactive dialogue lesson to start recording your activity log.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
