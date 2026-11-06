export interface LessonItem {
  id: string;
  targetText: string;
  romanizedText: string;
  pronunciation: string;
  meaning: string;
  explanation: string;
  exampleSentence: string;
  exampleRomanized?: string;
  exampleTranslation: string;
  notes: string;
  categoryTag: string;
  illustrationGradient: string;
  illustrationSymbol: string;
  audioLangCode: string;
}

export interface LessonDetail {
  id: string;
  courseCode: string;
  sectionId: string;
  sectionTitle: string;
  order: number;
  totalLessons: number;
  title: string;
  subtitle: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  xpReward: number;
  items: LessonItem[];
}
