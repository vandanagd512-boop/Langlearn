import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';

// Standalone Entry Flow Pages
const SplashPage = lazy(() =>
  import('@/modules/splash/pages/SplashPage').then((m) => ({ default: m.SplashPage }))
);
const OnboardingPage = lazy(() =>
  import('@/modules/onboarding/pages/OnboardingPage').then((m) => ({ default: m.OnboardingPage }))
);
const AuthPage = lazy(() =>
  import('@/modules/auth/pages/AuthPage').then((m) => ({ default: m.AuthPage }))
);

// Core Modules
const HomePage = lazy(() =>
  import('@/modules/home/pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const LearnPage = lazy(() =>
  import('@/modules/learn/pages/LearnPage').then((m) => ({ default: m.LearnPage }))
);
const LanguagesPage = lazy(() =>
  import('@/modules/languages/pages/LanguagesPage').then((m) => ({ default: m.LanguagesPage }))
);
const CoursesPage = lazy(() =>
  import('@/modules/courses/pages/CoursesPage').then((m) => ({ default: m.CoursesPage }))
);
const LessonsPage = lazy(() =>
  import('@/modules/lessons/pages/LessonsPage').then((m) => ({ default: m.LessonsPage }))
);
const VocabularyPage = lazy(() =>
  import('@/modules/vocabulary/pages/VocabularyPage').then((m) => ({ default: m.VocabularyPage }))
);
const PracticePage = lazy(() =>
  import('@/modules/practice/pages/PracticePage').then((m) => ({ default: m.PracticePage }))
);
const QuizPage = lazy(() =>
  import('@/modules/quiz/pages/QuizPage').then((m) => ({ default: m.QuizPage }))
);
const TranslatorPage = lazy(() =>
  import('@/modules/translator/pages/TranslatorPage').then((m) => ({ default: m.TranslatorPage }))
);
const ProgressPage = lazy(() =>
  import('@/modules/progress/pages/ProgressPage').then((m) => ({ default: m.ProgressPage }))
);
const ProfilePage = lazy(() =>
  import('@/modules/profile/pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const SettingsPage = lazy(() =>
  import('@/modules/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const AdminPage = lazy(() =>
  import('@/modules/admin/pages/AdminPage').then((m) => ({ default: m.AdminPage }))
);

const suspenseWrap = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingSpinner fullScreen label="Loading..." />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  // Standalone Entry Routes
  {
    path: '/splash',
    element: suspenseWrap(SplashPage),
  },
  {
    path: '/onboarding',
    element: suspenseWrap(OnboardingPage),
  },
  {
    path: '/auth',
    element: suspenseWrap(AuthPage),
  },
  {
    path: '/auth/:mode',
    element: suspenseWrap(AuthPage),
  },

  // Protected Core Application Shell
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: (
      <ErrorBoundary>
        <div />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: suspenseWrap(HomePage),
      },
      {
        path: 'learn',
        element: suspenseWrap(LearnPage),
      },
      {
        path: 'languages',
        element: suspenseWrap(LanguagesPage),
      },
      {
        path: 'courses',
        element: suspenseWrap(CoursesPage),
      },
      {
        path: 'lessons',
        element: suspenseWrap(LessonsPage),
      },
      {
        path: 'vocabulary',
        element: suspenseWrap(VocabularyPage),
      },
      {
        path: 'practice',
        element: suspenseWrap(PracticePage),
      },
      {
        path: 'quiz',
        element: suspenseWrap(QuizPage),
      },
      {
        path: 'translator',
        element: suspenseWrap(TranslatorPage),
      },
      {
        path: 'progress',
        element: suspenseWrap(ProgressPage),
      },
      {
        path: 'profile',
        element: suspenseWrap(ProfilePage),
      },
      {
        path: 'settings',
        element: suspenseWrap(SettingsPage),
      },
      {
        path: 'admin',
        element: suspenseWrap(AdminPage),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
