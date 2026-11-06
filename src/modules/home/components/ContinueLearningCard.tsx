import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Play, Sparkles, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ContinueLearningCardProps {
  languageName: string;
  languageFlag: string;
  courseTitle: string;
  currentLessonTitle: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  estimatedRemainingMinutes: number;
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({
  languageName,
  languageFlag,
  courseTitle,
  currentLessonTitle,
  progressPercent,
  completedLessons,
  totalLessons,
  estimatedRemainingMinutes,
}) => {
  const navigate = useNavigate();

  return (
    <Card className="p-6 sm:p-7 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white shadow-xl shadow-blue-500/10 border-transparent">
      {/* Ambient background glow and watermark */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute right-4 bottom-2 text-7xl select-none opacity-15 pointer-events-none">
        {languageFlag}
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Course Info & Progress */}
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center gap-2.5">
            <Badge variant="blue" className="bg-white/20 border-white/30 text-white backdrop-blur-md">
              <Sparkles className="w-3 h-3 mr-1" />
              <span>Continue Learning</span>
            </Badge>
            <span className="text-xs font-semibold text-blue-100 flex items-center gap-1">
              <span>{languageFlag}</span>
              <span>{languageName}</span>
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
              {courseTitle}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100">
              Next Up: <strong>{currentLessonTitle}</strong>
            </p>
          </div>

          {/* Progress Bar & Stats */}
          <div className="space-y-2 pt-1 max-w-md">
            <div className="flex items-center justify-between text-xs text-blue-100 font-medium">
              <span>
                {completedLessons} of {totalLessons} lessons completed
              </span>
              <span className="font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/20 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Action Button & Remaining Time */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-blue-100">
            <Clock className="w-3.5 h-3.5" />
            <span>~{estimatedRemainingMinutes} mins remaining</span>
          </div>

          <Button
            size="lg"
            variant="secondary"
            leftIcon={<Play className="w-4 h-4 fill-current" />}
            onClick={() => navigate('/learn')}
            className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 shadow-lg active:scale-95 font-bold"
          >
            Resume Lesson
          </Button>
        </div>
      </div>
    </Card>
  );
};
