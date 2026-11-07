export type VideoDurationCategory = '2min' | '5min' | '10min' | '15min';

export type VideoProficiencyLevel = 'beginner' | 'elementary' | 'intermediate' | 'fluent';

export interface VideoCharacter {
  name: string;
  avatar: string;
  role: string;
  gender: 'male' | 'female';
}

export interface VideoTranscriptLine {
  time: string;
  seconds: number;
  speaker: string;
  speakerAvatar?: string;
  speakerRole?: string;
  speakerIndex?: number; // 0 for Speaker A, 1 for Speaker B
  text: string;
  translation: string;
}

export interface VideoVocabularyItem {
  term: string;
  phonetic: string;
  meaning: string;
}

export interface VideoLesson {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  durationCategory: VideoDurationCategory;
  durationFormatted: string;
  durationSeconds: number;
  level: VideoProficiencyLevel;
  levelLabel: string;
  languageCode: string;
  languageName: string;
  categoryId: number;
  categoryTitle: string;
  categoryIcon: string;
  topic: string;
  topicLabel: string;
  instructor: string;
  instructorAvatar: string;
  characterPair?: {
    speakerA: VideoCharacter;
    speakerB: VideoCharacter;
  };
  xpReward: number;
  gradient: string;
  embedType: 'native';
  videoId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  transcript: VideoTranscriptLine[];
  keyVocabulary: VideoVocabularyItem[];
}
