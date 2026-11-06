export type VocabCategory =
  | 'all'
  | 'greetings'
  | 'food'
  | 'travel'
  | 'family'
  | 'verbs'
  | 'numbers'
  | 'daily_phrases';

export type VocabMastery = 'all' | 'mastered' | 'learning' | 'review_due' | 'new';

export type VocabFilter = 'all' | 'favorites' | 'bookmarked' | 'recently_learned';

export type VocabViewMode = 'grid' | 'list';

export interface VocabularyWord {
  id: string;
  langCode: string;
  word: string;
  romanized: string;
  phonetic: string;
  meaning: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'phrase' | 'pronoun' | 'number';
  category: VocabCategory;
  categoryLabel: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  exampleSentence: string;
  exampleRomanized?: string;
  exampleTranslation: string;
  culturalNote?: string;
  audioLangCode: string;
  learnedAt?: string;
  masteryStatus: 'mastered' | 'learning' | 'review_due' | 'new';
  streakDays?: number;
}
