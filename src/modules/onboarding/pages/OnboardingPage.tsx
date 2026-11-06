import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/state/store';
import { useTheme } from '@/context/ThemeContext';
import { useNotification } from '@/context/NotificationContext';
import { OnboardingProgress } from '../components/OnboardingProgress';
import { ScreenWelcome } from '../components/ScreenWelcome';
import { ScreenNativeLanguage } from '../components/ScreenNativeLanguage';
import { ScreenLearningLanguages } from '../components/ScreenLearningLanguages';
import { ScreenDailyGoal } from '../components/ScreenDailyGoal';
import { Sun, Moon } from 'lucide-react';
import { logger } from '@/services/logging/logger.service';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { notify } = useNotification();
  const {
    setOnboardingCompleted,
    setNativeLanguage,
    setLearningLanguages,
    setDailyGoalMinutes,
    isAuthenticated,
  } = useAppStore();

  // Onboarding Step State (1: Welcome, 2: Native Language, 3: Learning Languages, 4: Daily Goal)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // User Selections
  const [nativeLang, setNativeLang] = useState<string>('en');
  const [targetLangs, setTargetLangs] = useState<string[]>(['kn']); // Default with Kannada
  const [dailyGoal, setDailyGoal] = useState<number>(15); // Default 15 mins (Recommended)
  const [isFinishing, setIsFinishing] = useState<boolean>(false);

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleToggleTargetLanguage = (code: string) => {
    setTargetLangs((prev) => {
      if (prev.includes(code)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((c) => c !== code);
      } else {
        return [...prev, code];
      }
    });
  };

  const completeOnboarding = (isSkip = false) => {
    setIsFinishing(true);

    try {
      // 1. Commit selections to global store and persistent storage
      const finalNative = nativeLang || 'en';
      const finalTargets = targetLangs.length > 0 ? targetLangs : ['kn', 'en'];
      const finalGoal = dailyGoal || 15;

      setNativeLanguage(finalNative);
      setLearningLanguages(finalTargets);
      setDailyGoalMinutes(finalGoal);
      setOnboardingCompleted(true);

      logger.info('Onboarding', 'Onboarding completed successfully', {
        native: finalNative,
        targets: finalTargets,
        goal: finalGoal,
        skipped: isSkip,
      });

      notify({
        type: 'success',
        title: 'Profile Configured',
        message: 'Your personalized curriculum is ready!',
      });

      // 2. Navigate based on auth status (First launch → /auth; Returning session → /)
      setTimeout(() => {
        if (isAuthenticated) {
          navigate('/', { replace: true });
        } else {
          navigate('/auth', { replace: true });
        }
      }, 350);
    } catch (err) {
      logger.error('Onboarding', 'Failed to save onboarding selections', err);
      setIsFinishing(false);
      notify({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not save your preferences. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900/10 dark:bg-black/90 flex justify-center text-slate-900 dark:text-slate-100 antialiased">
      <div className="w-full max-w-md min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-6 shadow-2xl border-x border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
        {/* Top Header with Progress and Theme Toggle */}
        <header className="w-full mx-auto flex items-center justify-between gap-4 pb-4">
        {currentStep > 1 ? (
          <OnboardingProgress
            currentStep={currentStep}
            totalSteps={4}
            onBack={handleBack}
            onSkip={() => completeOnboarding(true)}
            showBack={currentStep > 1}
            showSkip={true}
          />
        ) : (
          <div className="w-full flex items-center justify-end">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 backdrop-blur-md shadow-sm hover:scale-105 active:scale-95 transition"
              title="Toggle theme"
              aria-label="Toggle visual theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>
        )}

        {currentStep > 1 && (
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 backdrop-blur-md shadow-sm hover:scale-105 active:scale-95 transition shrink-0"
            title="Toggle theme"
            aria-label="Toggle visual theme"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-700" />
            )}
          </button>
        )}
      </header>

      {/* Main Step Screen Display */}
      <main className="my-auto py-4">
        {currentStep === 1 && (
          <ScreenWelcome onNext={handleNext} onSkip={() => completeOnboarding(true)} />
        )}

        {currentStep === 2 && (
          <ScreenNativeLanguage
            selectedLanguage={nativeLang}
            onSelect={setNativeLang}
            onContinue={handleNext}
          />
        )}

        {currentStep === 3 && (
          <ScreenLearningLanguages
            selectedLanguages={targetLangs}
            onToggle={handleToggleTargetLanguage}
            onContinue={handleNext}
          />
        )}

        {currentStep === 4 && (
          <ScreenDailyGoal
            selectedMinutes={dailyGoal}
            onSelect={setDailyGoal}
            onFinish={() => completeOnboarding(false)}
            isSubmitting={isFinishing}
          />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="w-full text-center text-xs text-slate-400 dark:text-slate-500 pt-4">
        <span>LangLearn • Step {currentStep} of 4</span>
      </footer>
    </div>
  </div>
  );
};
