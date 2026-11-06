import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ArrowRight, Globe2 } from 'lucide-react';
import { POPULAR_LANGUAGES_DATA } from '../data/home.data';
import { useAppStore } from '@/state/store';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/context/NotificationContext';

export const PopularLanguagesSection: React.FC = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { activeLanguageCode, setActiveLanguageCode } = useAppStore();

  const handleContinueLanguage = (code: string, name: string) => {
    setActiveLanguageCode(code);
    notify({
      type: 'info',
      title: `${name} Course Active`,
      message: `Switched active course to ${name}. Resuming lesson path.`,
    });
    navigate('/learn');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Globe2 className="w-4 h-4 text-blue-500" />
            <span>Popular Languages</span>
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            10 regional & global languages
          </p>
        </div>
        <button
          onClick={() => navigate('/languages')}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <span>All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {POPULAR_LANGUAGES_DATA.map((lang) => {
          const isActive = lang.code === activeLanguageCode;

          return (
            <Card
              key={lang.code}
              className={`p-3.5 flex flex-col justify-between space-y-3 border transition-all ${
                isActive
                  ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/30 shadow-sm'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl select-none">{lang.flag}</span>
                  {isActive ? (
                    <Badge variant="blue" size="sm" dot className="text-[9px] px-1.5 py-0.5">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="neutral" size="sm" className="text-[9px] px-1.5 py-0.5">
                      {lang.level.split(' ')[0]}
                    </Badge>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {lang.name}
                  </h4>
                  <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 truncate">
                    {lang.nativeName}
                  </p>
                </div>

                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>Progress</span>
                    <span>{lang.progressPercent}%</span>
                  </div>
                  <ProgressBar
                    value={lang.progressPercent}
                    color={isActive ? 'blue' : 'gradient'}
                    size="sm"
                  />
                </div>
              </div>

              {/* Action Button */}
              <Button
                size="sm"
                variant={isActive ? 'primary' : 'outline'}
                onClick={() => handleContinueLanguage(lang.code, lang.name)}
                className="w-full text-xs py-1 h-auto"
              >
                {isActive ? 'Continue' : 'Learn'}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};