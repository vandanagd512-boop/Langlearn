/**
 * Application Constants & Enums
 */

export const APP_NAME = 'LangLearn';
export const APP_TAGLINE = 'Learn Every Language, One Lesson at a Time.';

export const ROUTES = {
  // Initial / Auth flows
  SPLASH: '/splash',
  ONBOARDING: '/onboarding',
  AUTH: '/auth',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',

  // Core Learning & Platform flows
  HOME: '/',
  LEARN: '/learn',
  LANGUAGES: '/languages',
  COURSES: '/courses',
  LESSONS: '/lessons',
  VOCABULARY: '/vocabulary',
  PRACTICE: '/practice',
  QUIZ: '/quiz',
  TRANSLATOR: '/translator',
  PROGRESS: '/progress',
  PROFILE: '/profile',
  SETTINGS: '/settings',

  // Management
  ADMIN: '/admin',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  AUTH_USER: 'user',
  THEME_MODE: 'theme_mode',
  ACTIVE_LANGUAGE: 'active_language',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  NATIVE_LANGUAGE: 'native_language',
  LEARNING_LANGUAGES: 'learning_languages',
  DAILY_GOAL: 'daily_goal_minutes',
  FAVORITE_LANGUAGES: 'favorite_languages',
  SETTINGS: 'app_settings',
} as const;

export const SUPPORTED_LANGUAGES = [
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🌐' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
] as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];
