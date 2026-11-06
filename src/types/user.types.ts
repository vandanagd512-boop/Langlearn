export type UserRole = 'learner' | 'tutor' | 'admin';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  targetLanguage: string;
  nativeLanguage: string;
  dailyGoalMinutes: number;
  soundEffects: boolean;
  hapticFeedback: boolean;
  emailNotifications: boolean;
  aiFeedbackLevel: 'concise' | 'detailed' | 'conversational';
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  lastLoginAt: string;
  preferences: UserPreferences;
  streakDays: number;
  xpPoints: number;
  level: number;
}
