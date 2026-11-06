/**
 * Strictly typed environment variable configuration with fallback validation.
 */

export interface EnvConfig {
  appName: string;
  appVersion: string;
  appEnv: 'development' | 'staging' | 'production' | 'test';
  apiBaseUrl: string;
  storagePrefix: string;
  aiProvider: 'gemini' | 'openai' | 'anthropic' | 'mock';
  geminiApiKey?: string;
  defaultTargetLanguage: string;
  defaultSourceLanguage: string;
  enableAnalytics: boolean;
  enableSpeechRecognition: boolean;
  enableAiTutor: boolean;
}

export const env: EnvConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'LangLearn',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  appEnv: (import.meta.env.VITE_APP_ENV as EnvConfig['appEnv']) || 'development',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  storagePrefix: import.meta.env.VITE_STORAGE_PREFIX || 'langlearn_',
  aiProvider: (import.meta.env.VITE_AI_PROVIDER as EnvConfig['aiProvider']) || 'gemini',
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  defaultTargetLanguage: import.meta.env.VITE_DEFAULT_TARGET_LANGUAGE || 'es',
  defaultSourceLanguage: import.meta.env.VITE_DEFAULT_SOURCE_LANGUAGE || 'en',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableSpeechRecognition: import.meta.env.VITE_ENABLE_SPEECH_RECOGNITION !== 'false',
  enableAiTutor: import.meta.env.VITE_ENABLE_AI_TUTOR !== 'false',
};
