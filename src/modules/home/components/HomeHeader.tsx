import React, { useState } from 'react';
import { UserProfile } from '@/types/user.types';
import { Avatar } from '@/components/ui/Avatar';
import { Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HomeHeaderProps {
  user: UserProfile | null;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ user }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: '5-Day Streak Active! 🔥',
      message: 'Keep going! Complete a 5-minute session today to preserve your streak.',
      time: '10m ago',
      unread: true,
    },
    {
      id: '2',
      title: 'New Kannada Dialogues Added',
      message: '10 authentic audio conversations ready in Unit 3: City Transit.',
      time: '2h ago',
      unread: true,
    },
    {
      id: '3',
      title: 'Vocabulary Review Due',
      message: '14 words in your Spaced Repetition deck are ready for review.',
      time: '1d ago',
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = user?.name ? user.name.split(' ')[0] : 'Learner';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
      {/* Welcome Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {getGreeting()}
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-400 font-medium">Ready to learn?</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
          Welcome back, {displayName} 👋
        </h1>
      </div>

      {/* Profile Picture & Notifications */}
      <div className="relative flex items-center gap-3">
        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-sm hover:scale-105 active:scale-95 transition"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Interactive Notifications Popover */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-40 space-y-3 animate-scaleIn">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                      Notifications
                    </h4>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] font-semibold text-blue-600 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border text-xs transition space-y-1 ${
                        item.unread
                          ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-900/40'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.time}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Picture Avatar */}
        <div
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 p-1 rounded-2xl cursor-pointer hover:opacity-90 active:scale-95 transition"
          title="Go to Profile"
        >
          <Avatar
            name={user?.name || 'Learner'}
            src={user?.avatarUrl}
            size="md"
            status="online"
            className="ring-2 ring-blue-500/20"
          />
        </div>
      </div>
    </div>
  );
};
