import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/state/store';
import { HomeHeader } from '../components/HomeHeader';
import { ContinueLearningCard } from '../components/ContinueLearningCard';
import { DailyActivityGrid } from '../components/DailyActivityGrid';
import { QuickAccessCards } from '../components/QuickAccessCards';
import { PopularLanguagesSection } from '../components/PopularLanguagesSection';
import { RecommendedLessonsSection } from '../components/RecommendedLessonsSection';
import { RecentActivitySection } from '../components/RecentActivitySection';
import { AchievementsPreview } from '../components/AchievementsPreview';
import { HomeSkeleton } from '../components/HomeSkeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import {
  DAILY_WORDS_MAP,
  RECENT_ACTIVITY_DATA,
  INITIAL_ACHIEVEMENT_SUMMARY,
} from '../data/home.data';
import { SUPPORTED_LANGUAGES } from '@/config/constants';

export const HomePage: React.FC = () => {
  const { user, activeLanguageCode, dailyGoalMinutes } = useAppStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    // Smooth initial hydration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <HomeSkeleton />;
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to load dashboard"
        message="An issue occurred while syncing your learning progress. Please try again."
        onRetry={() => {
          setHasError(false);
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 300);
        }}
      />
    );
  }

  // Active target language resolution
  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === activeLanguageCode) ||
    SUPPORTED_LANGUAGES.find((l) => l.code === 'kn') ||
    SUPPORTED_LANGUAGES[0];

  const todayWord = DAILY_WORDS_MAP[currentLang.code] || DAILY_WORDS_MAP['kn'];

  return (
    <div className="space-y-8 animate-fadeIn pb-8">
      {/* 1. Header (Welcome, Profile picture, Notifications) */}
      <HomeHeader user={user} />

      {/* 2. Learning Summary (Continue Learning Card) */}
      <ContinueLearningCard
        languageName={currentLang.name}
        languageFlag={currentLang.flag}
        courseTitle={`Foundations of ${currentLang.name} & Daily Conversation`}
        currentLessonTitle="Unit 3: Essential Inquiries & Food Etiquette"
        progressPercent={65}
        completedLessons={13}
        totalLessons={20}
        estimatedRemainingMinutes={35}
      />

      {/* 3. Daily Activity Grid (Streak, Word of the Day, Daily Goal, XP Points) */}
      <DailyActivityGrid
        streakDays={user?.streakDays ?? 5}
        xpPoints={user?.xpPoints ?? 340}
        dailyGoalMinutes={dailyGoalMinutes || 15}
        completedMinutesToday={12}
        todayWord={todayWord}
      />

      {/* 4. Quick Access Section (Learn, Translator, Practice, Videos) */}
      <QuickAccessCards />

      {/* 5. Popular Languages (Kannada, Hindi, Tamil, Telugu, Malayalam, Marathi, Bengali, Gujarati, Punjabi, English) */}
      <PopularLanguagesSection />

      {/* 6. Recommended Lessons */}
      <RecommendedLessonsSection />

      {/* 7. Achievements & League Preview */}
      <AchievementsPreview
        summary={{
          ...INITIAL_ACHIEVEMENT_SUMMARY,
          streakDays: user?.streakDays ?? 5,
          totalXp: user?.xpPoints ?? 340,
        }}
      />

      {/* 8. Recent Activity */}
      <RecentActivitySection activities={RECENT_ACTIVITY_DATA} />
    </div>
  );
};
