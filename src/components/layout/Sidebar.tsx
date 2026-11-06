import React from 'react';
import { NavLink } from 'react-router-dom';
import { MAIN_NAV_ITEMS, FLOW_ROUTES } from '@/config/navigation.config';
import { useAppStore } from '@/state/store';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  const categories = [
    { key: 'core', title: 'Main' },
    { key: 'learning', title: 'Curriculum' },
    { key: 'tools', title: 'Practice & AI' },
    { key: 'account', title: 'Personal' },
    { key: 'admin', title: 'System' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl',
          'transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200/80 dark:border-slate-800">
          <NavLink to="/" className="flex items-center gap-3 font-bold text-lg text-slate-900 dark:text-slate-100">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-black text-sm">
              L
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight leading-none">LangLearn</span>
              <span className="text-[10px] text-slate-400 font-medium">AI Language Engine</span>
            </div>
          </NavLink>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {categories.map((cat) => {
            const items = MAIN_NAV_ITEMS.filter((item) => item.category === cat.key);
            if (items.length === 0) return null;

            return (
              <div key={cat.key} className="space-y-1">
                <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {cat.title}
                </span>
                <div className="mt-1 space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold shadow-subtle'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                          )
                        }
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <Badge variant={item.category === 'admin' ? 'rose' : 'blue'} size="sm">
                            {item.badge}
                          </Badge>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Quick Flow Direct Previews */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Entry Points
            </span>
            <div className="space-y-0.5 mt-1">
              {FLOW_ROUTES.map((flow) => {
                const Icon = flow.icon;
                return (
                  <NavLink
                    key={flow.id}
                    to={flow.path}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
                  >
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{flow.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>LangLearn v1.0.0</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="System Ready" />
          </div>
        </div>
      </aside>
    </>
  );
};
