export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  detectedLanguage?: string;
  confidence: number;
}

export interface ITranslationService {
  translate(request: TranslationRequest): Promise<TranslationResult>;
  detectLanguage(text: string): Promise<string>;
}
