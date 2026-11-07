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
   * Speaks the given text in the requested target language with configurable speed rate, pitch, and alternating speaker voice.
   */
  public static speak(
    text: string,
    langCode: string = 'en-US',
    rate: number = 1.0,
    pitch: number = 1.0,
    speakerIndex: number = 0
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSpeechSynthesisSupported()) {
        logger.warn('SpeechService', 'Speech synthesis is not supported on this browser');
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // Stop prior speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      // Clamp rate between 0.5x (slow) and 2.0x (fast)
      utterance.rate = Math.max(0.5, Math.min(2.0, rate));
      // Distinct pitch tone for Speaker A vs Speaker B
      utterance.pitch = Math.max(0.6, Math.min(1.8, pitch));

      // If browser has multiple matching voices, assign distinct voices to alternating speakers
      try {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const matching = voices.filter(
            (v) => v.lang === langCode || v.lang.startsWith(langCode.slice(0, 2))
          );
          if (matching.length > 1) {
            utterance.voice = matching[speakerIndex % matching.length];
          }
        }
      } catch {}

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
