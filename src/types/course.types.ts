import { CEFRLevel } from './language.types';

export interface Course {
  id: string;
  languageCode: string;
  title: string;
  description: string;
  level: CEFRLevel;
  totalLessons: number;
  completedLessons: number;
  estimatedHours: number;
  thumbnailUrl?: string;
  category: 'general' | 'travel' | 'business' | 'conversation' | 'grammar';
  tags: string[];
}
