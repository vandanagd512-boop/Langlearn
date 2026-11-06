import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Dumbbell, Award, BookMarked, Languages, ArrowRight } from 'lucide-react';

interface LessonQuickActionsProps {
  courseCode: string;
  lessonId: string;
  sampleWord?: string;
}

export const LessonQuickActions: React.FC<LessonQuickActionsProps> = ({
  courseCode,
  lessonId,
  sampleWord,
}) => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'practice',
      title: 'Interactive Practice',
      description: 'Strengthen recall with speech drills & flashcards',
      icon: Dumbbell,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
      action: () => navigate(`/practice?course=${courseCode}&lesson=${lessonId}`),
    },
    {
      id: 'quiz',
      title: 'Take Unit Quiz',
      description: 'Test your vocabulary retention & grammar accuracy',
      icon: Award,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
      action: () => navigate(`/quiz?course=${courseCode}&lesson=${lessonId}`),
    },
    {
      id: 'vocabulary',
      title: 'Vocabulary Bank',
      description: 'Save these words to your personal spaced repetition deck',
      icon: BookMarked,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
      action: () => navigate(`/vocabulary?course=${courseCode}&lesson=${lessonId}`),
    },
    {
      id: 'translator',
      title: 'Contextual AI Translator',
      description: 'Translate and generate conversational sentences on demand',
      icon: Languages,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
      action: () =>
        navigate(
          `/translator?targetLang=${courseCode}${sampleWord ? `&text=${encodeURIComponent(sampleWord)}` : ''}`
        ),
    },
  ];

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Reinforce Your Learning
        </h4>
        <span className="text-[11px] text-slate-400">Next Steps</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Card
              key={act.id}
              hoverEffect
              onClick={act.action}
              className="p-4 cursor-pointer flex flex-col justify-between space-y-3 border border-slate-200/80 dark:border-slate-800 transition group select-none"
            >
              <div className="space-y-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${act.color} group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {act.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                    {act.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-[11px] font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                <span>Start</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
