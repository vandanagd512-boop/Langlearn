export type LessonType = 'vocabulary' | 'grammar' | 'dialogue' | 'listening' | 'quiz';

export interface Lesson {
  id: string;
  courseId: string;
  order: number;
  title: string;
  summary: string;
  type: LessonType;
  durationMinutes: number;
  xpReward: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  scorePercentage?: number;
}
