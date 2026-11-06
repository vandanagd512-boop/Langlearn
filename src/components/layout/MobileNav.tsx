import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, BookMarked, Languages, User } from 'lucide-react';
import { cn } from '@/utils/cn';

export const MobileNav: React.FC = () => {
  const navTabs = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Courses', path: '/languages', icon: Compass },
    { label: 'Vocab', path: '/vocabulary', icon: BookMarked },
    { label: 'Translate', path: '/translator', icon: Languages },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 max-w-md w-full z-30 border-t border-slate-200/80 dark:border-slate-800 glass-panel shadow-lg select-none">
      <div className="flex items-center justify-around h-16 px-1">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-150',
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                )
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
