import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleHeader } from '@/components/layout/ModuleHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/state/store';
import { useNotification } from '@/context/NotificationContext';
import { SUPPORTED_LANGUAGES } from '@/config/constants';
import { SpeechService } from '@/services/speech/speech.service';
import {
  User,
  Mail,
  LogOut,
  Flame,
  Zap,
  Target,
  Award,
  Globe,
  Settings,
  Edit2,
  Check,
  Volume2,
  Sparkles,
  BookOpen,
} from 'lucide-react';

const AVATAR_OPTIONS = ['👨‍🎓', '👩‍🎓', '🧑‍💻', '👩‍🏫', '🦁', '🚀', '🎯', '🌟'];

const ACHIEVEMENTS_LIST = [
  { id: 'streak-3', name: '7-Day Streak', icon: '🔥', desc: 'Maintained habit for 7 consecutive days', unlocked: true },
  { id: 'vocab-50', name: 'Word Collector', icon: '📚', desc: 'Mastered 50+ unique words', unlocked: true },
  { id: 'quiz-ace', name: 'Perfect Score', icon: '🎯', desc: '100% accuracy on 3 evaluation quizzes', unlocked: true },
  { id: 'listening-pro', name: 'Sharp Ear', icon: '🎧', desc: 'Completed 20 listening exercises', unlocked: false },
  { id: 'polyglot', name: 'Polyglot Explorer', icon: '🌍', desc: 'Started learning 3 different languages', unlocked: true },
  { id: 'fast-learner', name: 'Speed Runner', icon: '⚡', desc: 'Finished a lesson in under 2 minutes', unlocked: false },
];

export const ProfilePage: React.FC = () => {
  const {
    user,
    logout,
    activeLanguageCode,
    dailyGoalMinutes,
    setDailyGoalMinutes,
  } = useAppStore();
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [isEditingName, setIsEditingName] = useState(false);
  const [userName, setUserName] = useState(user?.name || 'Active Learner');
  const [selectedAvatar, setSelectedAvatar] = useState('👨‍🎓');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === activeLanguageCode) ||
    SUPPORTED_LANGUAGES[0];

  const handleSaveName = () => {
    setIsEditingName(false);
    notify({
      type: 'success',
      title: 'Profile Updated',
      message: `Your name is now set to ${userName}`,
    });
  };

  const handleGoalChange = (minutes: number) => {
    setDailyGoalMinutes(minutes);
    notify({
      type: 'info',
      title: 'Daily Goal Updated',
      message: `Goal updated to ${minutes} minutes / day`,
    });
  };

  const handleTestAudio = () => {
    SpeechService.speak('Great job! Keep practicing every day.', 'en-US');
    notify({
      type: 'info',
      message: `Speech sample playing at ${speechSpeed}x speed`,
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
    notify({
      type: 'info',
      message: 'You have been successfully signed out',
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <ModuleHeader
        title="Account Profile"
        subtitle="Manage credentials, learning goals, and review your badges."
        icon={User}
        badge="Active Member"
      />

      {/* Profile Hero Card */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-3xl shadow-md transition hover:scale-105"
            >
              {selectedAvatar}
            </button>
            <span className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-800 rounded-full text-slate-500 shadow border border-slate-200 dark:border-slate-700">
              <Edit2 className="w-2.5 h-2.5" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="px-2.5 py-1 text-sm font-bold rounded-lg border border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-full"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                  {userName}
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{user?.email || 'learner@langlearn.ai'}</span>
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="blue" className="text-[10px]">
                Level {user?.level ?? 2} Polyglot
              </Badge>
              <Badge variant="green" className="text-[10px]">
                Active
              </Badge>
            </div>
          </div>
        </div>

        {/* Avatar Picker Drawer */}
        {showAvatarPicker && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-2 animate-fadeIn">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Choose Avatar</span>
            <div className="flex items-center justify-around">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => {
                    setSelectedAvatar(avatar);
                    setShowAvatarPicker(false);
                  }}
                  className="text-2xl p-1.5 hover:scale-125 transition"
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 bg-amber-500/10 rounded-2xl flex items-center gap-3">
            <Flame className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300">
                Streak
              </span>
              <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                {user?.streakDays ?? 5} Days
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-500/10 rounded-2xl flex items-center gap-3">
            <Zap className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300">
                Total XP
              </span>
              <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                {user?.xpPoints ?? 340} XP
              </div>
            </div>
          </div>

          <div className="p-3 bg-purple-500/10 rounded-2xl flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-purple-500 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300">
                Mastered
              </span>
              <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                86 Words
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-500/10 rounded-2xl flex items-center gap-3">
            <Award className="w-6 h-6 text-emerald-500 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">
                Badges
              </span>
              <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                4 Unlocked
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Target Language Switcher */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Active Learning Course
            </h3>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs h-auto py-1"
            onClick={() => navigate('/languages')}
          >
            Manage All
          </Button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentLang.flag}</span>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                {currentLang.name}
              </span>
              <span className="text-[10px] text-slate-500">
                Level A1 • 13 of 20 Lessons Done
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-auto py-1 px-2.5"
            onClick={() => navigate('/courses')}
          >
            View Syllabus
          </Button>
        </div>
      </Card>

      {/* Daily Learning Goal Selector */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Daily Learning Goal
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {dailyGoalMinutes || 15} mins/day
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {[5, 10, 15, 20, 30].map((mins) => (
            <button
              key={mins}
              onClick={() => handleGoalChange(mins)}
              className={`py-2 rounded-xl text-xs font-bold border transition ${
                dailyGoalMinutes === mins
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </Card>

      {/* Audio Playback Preferences */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Pronunciation Speed
            </h3>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs h-auto py-1 text-indigo-600 dark:text-indigo-400"
            onClick={handleTestAudio}
          >
            Test Audio
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Slow (0.8x)', rate: 0.8 },
            { label: 'Normal (1.0x)', rate: 1.0 },
            { label: 'Fast (1.2x)', rate: 1.2 },
          ].map((item) => (
            <button
              key={item.rate}
              onClick={() => setSpeechSpeed(item.rate)}
              className={`py-2 rounded-xl text-xs font-semibold border transition ${
                speechSpeed === item.rate
                  ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Achievements Showcase */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Trophy Cabinet
            </h3>
          </div>
          <span className="text-xs text-slate-400">4 / 6 Unlocked</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {ACHIEVEMENTS_LIST.map((badge) => (
            <div
              key={badge.id}
              className={`p-3 rounded-2xl border text-left space-y-1 transition ${
                badge.unlocked
                  ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800'
                  : 'bg-slate-100/50 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{badge.icon}</span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {badge.name}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">{badge.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Navigation to Settings & Sign Out */}
      <div className="space-y-2 pt-2">
        <Button
          variant="outline"
          className="w-full"
          size="md"
          leftIcon={<Settings className="w-4 h-4" />}
          onClick={() => navigate('/settings')}
        >
          App Preferences & Settings
        </Button>

        <Button
          variant="danger"
          className="w-full"
          size="md"
          leftIcon={<LogOut className="w-4 h-4" />}
          onClick={() => setShowLogoutModal(true)}
        >
          Sign Out of Account
        </Button>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center text-xl">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Are you sure you want to log out?
              </h3>
              <p className="text-xs text-slate-500">
                Your progress is safely synchronized in local storage.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleLogout}
              >
                Yes, Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};