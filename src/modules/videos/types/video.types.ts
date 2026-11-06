export type VideoDurationCategory = '2min' | '5min' | '10min' | '15min';

export type VideoTopic = 'alphabet' | 'conversation' | 'food' | 'travel' | 'grammar';

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
  languageCode: string;
  languageName: string;
  topic: VideoTopic;
  topicLabel: string;
  instructor: string;
  instructorAvatar: string;
  xpReward: number;
  gradient: string;
  videoUrl: string;
  transcript: VideoTranscriptLine[];
  keyVocabulary: VideoVocabularyItem[];
}
