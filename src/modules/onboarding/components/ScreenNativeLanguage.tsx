import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowRight, Search, Check, Sparkles } from 'lucide-react';
import { NATIVE_LANGUAGES, LanguageOption } from '../data/onboarding.data';
import { cn } from '@/utils/cn';

interface ScreenNativeLanguageProps {
  selectedLanguage: string;
  onSelect: (code: string) => void;
  onContinue: () => void;
}

export const ScreenNativeLanguage: React.FC<ScreenNativeLanguageProps> = ({
  selectedLanguage,
  onSelect,
  onContinue,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return NATIVE_LANGUAGES;
    const q = searchQuery.toLowerCase().trim();
    return NATIVE_LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col space-y-6 animate-fadeIn">
      {/* Header Info */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1 of 3: Linguistic Base</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
          What is your native language?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          We customize explanations, grammar analogies, and translations using your mother tongue.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by language name or script..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 max-h-72 sm:max-h-80 overflow-y-auto p-1 pr-1.5">
        {filteredLanguages.map((lang: LanguageOption) => {
          const isSelected = selectedLanguage === lang.code;

          return (
            <Card
              key={lang.code}
              hoverEffect
              onClick={() => onSelect(lang.code)}
              className={cn(
                'p-3.5 sm:p-4 flex items-center justify-between border-2 transition-all cursor-pointer select-none',
                isSelected
                  ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/40 shadow-sm'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0">{lang.flag}</span>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {lang.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {lang.nativeName}
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all',
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-transparent'
                )}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </Card>
          );
        })}

        {filteredLanguages.length === 0 && (
          <div className="col-span-2 py-8 text-center text-xs text-slate-400">
            No languages match "{searchQuery}"
          </div>
        )}
      </div>

      {/* Continue Action */}
      <div className="pt-2">
        <Button
          size="lg"
          variant="primary"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          disabled={!selectedLanguage}
          onClick={onContinue}
          className="w-full shadow-md"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
