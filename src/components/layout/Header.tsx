import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAppStore } from '@/state/store';
import { Sun, Moon, Flame } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { SUPPORTED_LANGUAGES } from '@/config/constants';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, activeLanguageCode, setActiveLanguageCode } = useAppStore();

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 w-full border-b border-slate-200/80 dark:border-slate-800 glass-panel">
      <div className="flex h-full items-center justify-between px-3.5">
        {/* Left: Brand App Logo */}
        <Link to="/" className="flex items-center gap-2 select-none group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-black text-sm group-hover:scale-105 transition-transform">
            L
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            LangLearn
          </span>
        </Link>

        {/* Right: Language selector, Streak, Theme, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Active Target Language Selector */}
          <div className="relative">
            <select
              value={activeLanguageCode}
              onChange={(e) => setActiveLanguageCode(e.target.value)}
              className="appearance-none bg-slate-100 dark:bg-slate-800 text-xs font-bold py-1 pl-2 pr-5 rounded-xl border border-slate-200/70 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer transition focus:outline-none"
              title="Active Learning Language"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.code.toUpperCase()}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-400">
              ▼
            </span>
          </div>

          {/* Streak Badge */}
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40 text-[11px] font-bold"
            title="Daily Learning Streak"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{user?.streakDays ?? 3}d</span>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition active:scale-95"
            aria-label="Toggle theme"
            title="Toggle light / dark mode"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Profile Quick Link */}
          <Link to="/profile" className="flex items-center pl-0.5">
            <Avatar
              name={user?.name || 'Learner'}
              size="sm"
              status="online"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};
