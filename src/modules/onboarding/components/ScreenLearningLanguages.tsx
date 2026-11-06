import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Search, Check, Sparkles, Layers } from 'lucide-react';
import { TARGET_LANGUAGES, LanguageOption } from '../data/onboarding.data';
import { cn } from '@/utils/cn';

interface ScreenLearningLanguagesProps {
  selectedLanguages: string[];
  onToggle: (code: string) => void;
  onContinue: () => void;
}

export const ScreenLearningLanguages: React.FC<ScreenLearningLanguagesProps> = ({
  selectedLanguages,
  onToggle,
  onContinue,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return TARGET_LANGUAGES;
    const q = searchQuery.toLowerCase().trim();
    return TARGET_LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        (lang.region && lang.region.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const isValid = selectedLanguages.length > 0;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col space-y-6 animate-fadeIn">
      {/* Header Info */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 2 of 3: Target Curriculum</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
          Which languages do you want to learn?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Choose one or multiple languages. You can switch between your active courses anytime.
        </p>
      </div>

      {/* Search Bar & Multi-select counter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Kannada, Hindi, Tamil, English..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm"
          />
        </div>

        {selectedLanguages.length > 0 && (
          <Badge variant="blue" className="shrink-0 py-2 px-3 text-xs">
            <Layers className="w-3.5 h-3.5 mr-1" />
            <span>{selectedLanguages.length} Selected</span>
          </Badge>
        )}
      </div>

      {/* Target Languages Grid (10 Supported Languages) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 sm:max-h-80 overflow-y-auto p-1 pr-1.5">
        {filteredLanguages.map((lang: LanguageOption) => {
          const isSelected = selectedLanguages.includes(lang.code);

          return (
            <Card
              key={lang.code}
              hoverEffect
              onClick={() => onToggle(lang.code)}
              className={cn(
                'p-4 flex items-center justify-between border-2 transition-all cursor-pointer select-none',
                isSelected
                  ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/40 shadow-sm'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              )}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="text-3xl shrink-0">{lang.flag}</span>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {lang.name}
                    </span>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      • {lang.nativeName}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {lang.sampleGreeting}
                  </div>
                </div>
              </div>

              {/* Checkbox circle indicator */}
              <div
                className={cn(
                  'w-6 h-6 rounded-xl flex items-center justify-center shrink-0 border transition-all',
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                    : 'border-slate-300 dark:border-slate-700 bg-transparent'
                )}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </Card>
          );
        })}

        {filteredLanguages.length === 0 && (
          <div className="col-span-2 py-8 text-center text-xs text-slate-400">
            No supported language found for "{searchQuery}"
          </div>
        )}
      </div>

      {/* Validation Message or Continue Action */}
      <div className="space-y-2 pt-2">
        <Button
          size="lg"
          variant="primary"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          disabled={!isValid}
          onClick={onContinue}
          className="w-full shadow-md"
        >
          {isValid
            ? `Continue with ${selectedLanguages.length} Language${
                selectedLanguages.length > 1 ? 's' : ''
              }`
            : 'Select at least 1 language'}
        </Button>
        {!isValid && (
          <p className="text-center text-xs text-rose-500 font-medium">
            Please pick at least one language to set up your curriculum.
          </p>
        )}
      </div>
    </div>
  );
};
