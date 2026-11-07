import React from 'react';
import { useSplashInit } from '../hooks/useSplashInit';
import { APP_NAME, APP_TAGLINE } from '@/config/constants';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Sun, Moon, RotateCcw, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

export const SplashPage: React.FC = () => {
  const { progress, message, isExiting, error, retry, skip, stage } = useSplashInit(2200);
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900/10 dark:bg-black/90 flex justify-center antialiased">
      <div
        className={cn(
          'relative min-h-screen w-full max-w-md flex flex-col items-center justify-between p-6 select-none overflow-hidden transition-all duration-500 shadow-2xl border-x border-slate-200/80 dark:border-slate-800',
          'bg-gradient-to-b from-blue-50/60 via-slate-50 to-indigo-50/40',
          'dark:from-[#080d1a] dark:via-slate-950 dark:to-[#030712]',
          isExiting && 'opacity-0 scale-[0.98] pointer-events-none'
        )}
      >
      {/* Ambient background blur circles */}
      <div className="absolute top-1/4 -left-20 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-3xl pointer-events-none animate-pulseGlow" />
      <div className="absolute bottom-1/4 -right-20 w-80 sm:w-[28rem] h-80 sm:h-[28rem] rounded-full bg-indigo-400/10 dark:bg-indigo-600/10 blur-3xl pointer-events-none animate-pulseGlow [animation-delay:1.5s]" />

      {/* Top Bar: Theme toggle */}
      <header className="w-full max-w-md flex items-center justify-end z-10">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 backdrop-blur-md shadow-sm hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label="Toggle visual theme"
          title="Toggle light / dark mode"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>
      </header>

      {/* Center: Brand & Loading Animation */}
      <main className="w-full max-w-md my-auto flex flex-col items-center text-center space-y-8 z-10">
        {/* Animated Brand Emblem */}
        <div className="relative group">
          {/* Ethereal Glow */}
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-blue-500/30 to-indigo-500/30 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 animate-pulseGlow" />

          {/* Logo container with float and scale animations */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1 bg-gradient-to-b from-white/90 to-white/40 dark:from-slate-800/80 dark:to-slate-900/60 shadow-2xl backdrop-blur-xl border border-white/80 dark:border-slate-700/60 animate-scaleIn">
            <img
              src="/logo.svg"
              alt="LangLearn Logo"
              className="w-full h-full rounded-[22px] shadow-inner animate-float"
            />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-2.5 animate-fadeIn [animation-delay:0.2s]">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            {APP_NAME}
          </h1>
          <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            {APP_TAGLINE}
          </p>
        </div>

        {/* Dynamic Loading / Error State */}
        <div className="w-full max-w-xs space-y-3 pt-2">
          {!error ? (
            <>
              {/* Apple-style sleek progress track */}
              <div className="w-full h-1.5 rounded-full bg-slate-200/70 dark:bg-slate-800/80 overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Status Message */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full shrink-0',
                      stage === 'ready'
                        ? 'bg-emerald-500'
                        : 'bg-blue-500 animate-pulse'
                    )}
                  />
                  <span>{message}</span>
                </span>
                <span className="font-mono text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                  {progress}%
                </span>
              </div>
            </>
          ) : (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 space-y-3 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Initialization Error</span>
              </div>
              <p className="text-xs text-rose-500 dark:text-rose-300 leading-relaxed">
                {error}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  onClick={retry}
                >
                  Retry
                </Button>
                <Button size="sm" variant="ghost" onClick={skip}>
                  Continue anyway
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer: Manual Skip & Badge */}
      <footer className="w-full max-w-md flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 z-10 pt-4">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>LangLearn Core</span>
        </span>

        {!error && (
          <button
            onClick={skip}
            className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors py-1 px-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50"
          >
            <span>Skip</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </footer>
    </div>
  </div>
  );
};
