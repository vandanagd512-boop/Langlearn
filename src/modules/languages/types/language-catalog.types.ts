export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type LanguageCategory = 'all' | 'indian' | 'international';

export type LanguageFilter =
  | 'all'
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'completed'
  | 'favorites';

export type LanguageSort = 'az' | 'recent' | 'popular' | 'continue';

export type ViewMode = 'grid' | 'list';

export interface LanguageCatalogItem {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  shortDescription: string;
  fullDescription: string;
  totalLessons: number;
  completedLessons: number;
  difficulty: DifficultyLevel;
  learnersCount: string;
  category: 'Indian' | 'International';
  estimatedHours: number;
  skillsCovered: string[];
  bannerGradient: string;
  accentColor: string;
  isStarted: boolean;
  isFavorite: boolean;
  addedAt: string;
  popularityRank: number;
}
