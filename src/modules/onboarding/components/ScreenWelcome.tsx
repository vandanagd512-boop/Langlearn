import React from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, Globe, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { APP_NAME } from '@/config/constants';

interface ScreenWelcomeProps {
  onNext: () => void;
  onSkip: () => void;
}

export const ScreenWelcome: React.FC<ScreenWelcomeProps> = ({ onNext, onSkip }) => {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center space-y-6 sm:space-y-8 animate-fadeIn">
      {/* App Logo & Header Badge */}
      <div className="flex flex-col items-center space-y-3">
        <div className="relative group">
          <div className="absolute -inset-2 rounded-3xl bg-blue-500/20 blur-xl animate-pulseGlow" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 border border-white/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              className="w-12 h-12 drop-shadow-md"
              fill="none"
            >
              <path
                d="M22 18V46H42"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="42" cy="24" r="4.5" fill="#93C5FD" />
            </svg>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Welcome to the Next Era of Learning</span>
        </div>
      </div>

      {/* Titles & Intro */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
          Welcome to {APP_NAME}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          Master any regional or world language with adaptive AI coaching, active recall flashcards, and natural dialogues.
        </p>
      </div>

      {/* Premium Apple-style Vector Artwork */}
      <div className="relative w-full max-w-md h-56 sm:h-64 rounded-3xl p-6 bg-gradient-to-b from-white/90 via-slate-50/80 to-blue-50/40 dark:from-slate-900/90 dark:via-slate-900/60 dark:to-blue-950/20 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center justify-center overflow-hidden">
        {/* Soft radial backdrop */}
        <div className="absolute w-44 h-44 rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-2xl pointer-events-none" />

        {/* Floating Multilingual Script Badges */}
        <div className="absolute top-4 left-6 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 shadow-sm text-xs font-bold text-slate-800 dark:text-slate-200 animate-float flex items-center gap-1.5">
          <span>🇮🇳</span>
          <span>ಕನ್ನಡ</span>
        </div>
        <div className="absolute top-8 right-6 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 shadow-sm text-xs font-bold text-slate-800 dark:text-slate-200 animate-float [animation-delay:1s] flex items-center gap-1.5">
          <span>🇮🇳</span>
          <span>हिन्दी</span>
        </div>
        <div className="absolute bottom-5 left-8 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 shadow-sm text-xs font-bold text-slate-800 dark:text-slate-200 animate-float [animation-delay:2s] flex items-center gap-1.5">
          <span>🇮🇳</span>
          <span>தமிழ்</span>
        </div>
        <div className="absolute bottom-6 right-8 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 shadow-sm text-xs font-bold text-slate-800 dark:text-slate-200 animate-float [animation-delay:1.5s] flex items-center gap-1.5">
          <span>🌐</span>
          <span>English</span>
        </div>

        {/* Central Illustration Hub */}
        <div className="relative flex flex-col items-center justify-center space-y-3 z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
            <BrainCircuit className="w-10 h-10 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span>AI Neural Personalized Path</span>
          </div>
        </div>
      </div>

      {/* Feature Bullet Points */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm text-left">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Interactive Dialogues</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Native Accent Audio</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Adaptive Review (SRS)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Bite-sized Lessons</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-sm flex flex-col gap-2.5 pt-2">
        <Button
          size="lg"
          variant="primary"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={onNext}
          className="w-full shadow-md hover:shadow-lg"
        >
          Get Started
        </Button>
        <button
          type="button"
          onClick={onSkip}
          className="py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
        >
          Skip Setup and Explore
        </button>
      </div>
    </div>
  );
};
