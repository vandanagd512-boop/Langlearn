export interface DailyWord {
  term: string;
  phonetic: string;
  translation: string;
  language: string;
  languageCode: string;
  partOfSpeech: string;
  exampleSentence: string;
  exampleTranslation: string;
}

export interface PopularLanguageProgress {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  progressPercent: number;
  totalLessons: number;
  completedLessons: number;
  level: string;
}

export interface RecommendedLesson {
  id: string;
  title: string;
  courseTitle: string;
  languageCode: string;
  durationMinutes: number;
  difficulty: 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced';
  xpReward: number;
  category: 'Conversation' | 'Grammar' | 'Vocabulary' | 'Listening';
  accentColor: string;
}

export interface RecentActivityItem {
  id: string;
  lessonTitle: string;
  courseTitle: string;
  completedAt: string;
  scorePercent: number;
  xpEarned: number;
  type: string;
}

export interface UserAchievementSummary {
  streakDays: number;
  totalXp: number;
  completedLessonsCount: number;
  totalLearningMinutes: number;
  rankTitle: string;
}
