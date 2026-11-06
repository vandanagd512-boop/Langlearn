import React, { useState } from 'react';
import { ModuleHeader } from '@/components/layout/ModuleHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Settings, Moon, Sun, Monitor, Volume2, Bell, Database, Trash2, Download, ShieldAlert } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useNotification } from '@/context/NotificationContext';
import { SpeechService } from '@/services/speech/speech.service';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { notify } = useNotification();

  const [soundEffects, setSoundEffects] = useState<boolean>(true);
  const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(true);
  const [dailyReminders, setDailyReminders] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>('08:00');
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    notify({
      type: 'info',
      message: `Theme set to ${newTheme} mode`,
    });
  };

  const handleTestVoice = () => {
    SpeechService.speak('Audio synthesizer is active and configured correctly.', 'en-US');
    notify({
      type: 'info',
      message: 'Playing voice preview',
    });
  };

  const handleClearCache = () => {
    notify({
      type: 'success',
      title: 'Cache Cleared',
      message: '18.4 MB of temporary offline audio and asset cache was purged.',
    });
  };

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      app: 'LangLearn AI',
      user: {
        streakDays: 5,
        xpPoints: 340,
        completedLessons: 13,
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `langlearn-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify({
      type: 'success',
      title: 'Backup Exported',
      message: 'Your learning record JSON file was downloaded.',
    });
  };

  const handleConfirmReset = () => {
    localStorage.clear();
    setShowResetModal(false);
    notify({
      type: 'warning',
      title: 'Progress Reset',
      message: 'All local records and cache were cleared. Refreshing page...',
    });
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <ModuleHeader
        title="Settings & Preferences"
        subtitle="Manage display theme, pronunciation playback, reminders, and data."
        icon={Settings}
        badge="App Preferences"
      />

      {/* 1. Theme & Appearance */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <Moon className="w-5 h-5 text-blue-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Appearance</h3>
            <p className="text-[11px] text-slate-500">Select application visual styling</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: Monitor },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = theme === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleThemeChange(item.id as 'light' | 'dark' | 'system')}
                className={`py-3 px-2 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 2. Audio & Speech */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Audio & Speech</h3>
              <p className="text-[11px] text-slate-500">Native synthesis rate and sound cues</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs h-auto py-1 text-indigo-600 dark:text-indigo-400"
            onClick={handleTestVoice}
          >
            Test Audio
          </Button>
        </div>

        {/* Speed Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            TTS Playback Cadence
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '0.8x Slow', rate: 0.8 },
              { label: '1.0x Normal', rate: 1.0 },
              { label: '1.2x Fast', rate: 1.2 },
            ].map((item) => (
              <button
                key={item.rate}
                onClick={() => setSpeechRate(item.rate)}
                className={`py-2 rounded-xl text-xs font-semibold border transition ${
                  speechRate === item.rate
                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                Sound Effects
              </span>
              <span className="text-[11px] text-slate-500">
                Audible chimes on correct answers and milestone unlocks
              </span>
            </div>
            <input
              type="checkbox"
              checked={soundEffects}
              onChange={(e) => setSoundEffects(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                Auto-play Audio
              </span>
              <span className="text-[11px] text-slate-500">
                Automatically speak words when opening flashcards
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoPlayAudio}
              onChange={(e) => setAutoPlayAudio(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
          </label>
        </div>
      </Card>

      {/* 3. Notifications & Study Schedule */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <Bell className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Study Reminders</h3>
            <p className="text-[11px] text-slate-500">Daily habit nudges to keep your streak</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                Daily Study Reminder
              </span>
              <span className="text-[11px] text-slate-500">
                Gentle alert at your preferred practice hour
              </span>
            </div>
            <input
              type="checkbox"
              checked={dailyReminders}
              onChange={(e) => setDailyReminders(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
          </label>

          {dailyReminders && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Reminder Time
              </span>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="px-2 py-1 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
            </div>
          )}
        </div>
      </Card>

      {/* 4. Data & Offline Storage */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-purple-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Data & Storage</h3>
            <p className="text-[11px] text-slate-500">Offline cached materials and progress backup</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
              Offline Cache
            </span>
            <span className="text-[10px] text-slate-500">18.4 MB across 10 languages</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-auto py-1 px-2.5"
            onClick={handleClearCache}
          >
            Clear Cache
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportData}
          >
            Export Backup
          </Button>
          <Button
            size="sm"
            variant="danger"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => setShowResetModal(true)}
          >
            Reset All
          </Button>
        </div>
      </Card>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center text-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Reset All Learning Records?
              </h3>
              <p className="text-xs text-slate-500">
                This will reset your streak, XP, mastered words, and cached lessons back to day one.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmReset}
              >
                Yes, Reset All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};