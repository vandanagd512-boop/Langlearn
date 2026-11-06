import { APP_NAME, APP_TAGLINE } from './constants';
import { env } from './env.config';

export const AppConfig = {
  name: APP_NAME,
  tagline: APP_TAGLINE,
  version: env.appVersion,
  isProduction: env.appEnv === 'production',
  isDevelopment: env.appEnv === 'development',
  features: {
    speech: env.enableSpeechRecognition,
    aiTutor: env.enableAiTutor,
    analytics: env.enableAnalytics,
  },
  limits: {
    maxDailyFreeLessons: 5,
    maxVocabularyPerDeck: 100,
    quizQuestionCount: 10,
  },
} as const;
