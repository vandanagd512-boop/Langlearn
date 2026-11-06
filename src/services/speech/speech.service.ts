import { logger } from '../logging/logger.service';

export class SpeechService {
  public static isSpeechSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public static isSpeechRecognitionSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    );
  }

  /**
   * Speaks the given text in the requested target language.
   */
  public static speak(text: string, langCode: string = 'en-US'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSpeechSynthesisSupported()) {
        logger.warn('SpeechService', 'Speech synthesis is not supported on this browser');
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // Stop prior speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.95; // Slightly slower for clarity
      utterance.pitch = 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        logger.error('SpeechService', 'Utterance failed', e);
        reject(e);
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  public static stop(): void {
    if (this.isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
    }
  }
}
