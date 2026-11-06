import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Clock, Play, GraduationCap } from 'lucide-react';
import { RECOMMENDED_LESSONS_DATA } from '../data/home.data';
import { useNavigate } from 'react-router-dom';

export const RecommendedLessonsSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            <span>Recommended Lessons</span>
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Swipe to explore curated lessons
          </p>
        </div>
        <button
          onClick={() => navigate('/lessons')}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          View Map
        </button>
      </div>

      {/* Mobile-first horizontal scroll carousel */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none snap-x">
        {RECOMMENDED_LESSONS_DATA.map((lesson) => (
          <Card
            key={lesson.id}
            hoverEffect
            className="w-56 min-w-[14rem] flex-shrink-0 snap-start p-4 flex flex-col justify-between space-y-3 group cursor-pointer"
            onClick={() => navigate('/lessons')}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Badge variant="blue" size="sm" className="text-[10px] px-1.5 py-0.5">
                  {lesson.difficulty}
                </Badge>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{lesson.durationMinutes} min</span>
                </span>
              </div>

              {/* Lesson Banner / Visual */}
              <div
                className={`w-full h-20 rounded-xl bg-gradient-to-tr ${lesson.accentColor} text-white flex flex-col justify-between p-3 shadow-md group-hover:scale-[1.02] transition-transform`}
              >
                <span className="text-[9px] uppercase font-bold tracking-wider text-white/80">
                  {lesson.category}
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/95">
                    +{lesson.xpReward} XP
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Play className="w-3 h-3 fill-current text-white ml-0.5" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {lesson.title}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                  {lesson.courseTitle}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              leftIcon={<Play className="w-3 h-3 fill-current" />}
              onClick={(e) => {
                e.stopPropagation();
                navigate('/lessons');
              }}
              className="w-full text-xs font-semibold py-1.5 h-auto"
            >
              Start Lesson
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};