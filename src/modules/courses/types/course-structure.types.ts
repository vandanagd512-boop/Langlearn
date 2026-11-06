export type SectionStatus = 'completed' | 'in_progress' | 'locked' | 'available';

export type SectionFilter = 'all' | 'in_progress' | 'completed' | 'locked' | 'quiz';

export type ViewTab = 'sections' | 'roadmap';

export interface LessonSummary {
  id: string;
  sectionId: string;
  order: number;
  title: string;
  nativeTitle?: string;
  durationMinutes: number;
  xpReward: number;
  status: 'completed' | 'current' | 'locked';
  type: 'theory' | 'interactive' | 'speaking' | 'quiz';
}

export interface CourseSection {
  id: string;
  sectionNumber: number;
  slug: string;
  title: string;
  nativeTitle?: string;
  shortDescription: string;
  iconName: string;
  totalLessons: number;
  completedLessons: number;
  estimatedMinutes: number;
  status: SectionStatus;
  isLocked: boolean;
  isQuiz: boolean;
  lessons: LessonSummary[];
}

export interface CourseData {
  languageCode: string;
  languageName: string;
  nativeName: string;
  flag: string;
  bannerGradient: string;
  accentColor: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  totalLessons: number;
  completedLessons: number;
  totalQuizzes: number;
  completedQuizzes: number;
  estimatedHours: number;
  earnedXp: number;
  totalXp: number;
  certificateAvailable: boolean;
  certificateTitle: string;
  sections: CourseSection[];
}
