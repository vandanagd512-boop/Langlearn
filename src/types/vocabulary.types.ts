export type MasteryStatus = 'new' | 'learning' | 'reviewing' | 'mastered';

export interface VocabularyItem {
  id: string;
  languageCode: string;
  term: string;
  phonetic?: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase';
  translation: string;
  exampleSentence: string;
  exampleTranslation: string;
  audioUrl?: string;
  status: MasteryStatus;
  timesReviewed: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
}
