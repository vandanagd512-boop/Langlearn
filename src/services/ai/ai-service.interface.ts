export interface AiChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
}

export interface GrammarAnalysisResult {
  isCorrect: boolean;
  score: number; // 0 to 100
  feedback: string;
  corrections: Array<{
    original: string;
    suggested: string;
    explanation: string;
  }>;
  suggestedAlternatives: string[];
}

export interface PronunciationEvaluation {
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  phonemeFeedback: string[];
}

export interface IAiService {
  sendMessage(
    conversation: AiChatMessage[],
    systemPrompt?: string,
    targetLanguage?: string
  ): Promise<string>;
  analyzeGrammar(text: string, language: string): Promise<GrammarAnalysisResult>;
  evaluatePronunciation(audioBlob: Blob, targetText: string, language: string): Promise<PronunciationEvaluation>;
}
