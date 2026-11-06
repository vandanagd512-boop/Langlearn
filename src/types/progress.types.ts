export interface DailyActivity {
  date: string;
  minutesSpent: number;
  xpEarned: number;
  lessonsCompleted: number;
  wordsReviewed: number;
}

export interface UserProgress {
  userId: string;
  activeLanguageCode: string;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  totalTimeSpentMinutes: number;
  completedLessonsCount: number;
  masteredWordsCount: number;
  weeklyActivity: DailyActivity[];
}
