export type VideoDurationCategory = '2min' | '5min' | '10min' | '15min';

export type VideoProficiencyLevel = 'beginner' | 'elementary' | 'intermediate' | 'fluent';

export type VideoTopic = 'alphabet' | 'conversation' | 'food' | 'travel' | 'grammar' | 'slang' | 'culture';

export interface VideoTranscriptLine {
  time: string;
  seconds: number;
  speaker: string;
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
  topic: VideoTopic;
  topicLabel: string;
  instructor: string;
  instructorAvatar: string;
  xpReward: number;
  gradient: string;
  embedType: 'youtube' | 'stream';
  videoId?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  transcript: VideoTranscriptLine[];
  keyVocabulary: VideoVocabularyItem[];
}
