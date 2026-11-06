/**
 * Real Generative AI Service (Google Gemini & OpenAI)
 * Powers the AI Language Teacher with real LLM reasoning.
 */

export interface AITeacherResponse {
  native: string;
  romanized: string;
  english: string;
  feedback?: string;
  score?: number;
}

export class AIService {
  private static readonly STORAGE_KEY = 'gemini_api_key';

  public static getApiKey(): string {
    return (
      localStorage.getItem(this.STORAGE_KEY) ||
      (import.meta.env.VITE_GEMINI_API_KEY as string) ||
      ''
    );
  }

  public static setApiKey(key: string): void {
    if (key.trim()) {
      localStorage.setItem(this.STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  public static hasApiKey(): boolean {
    return Boolean(this.getApiKey());
  }

  /**
   * Generates a real teacher response using Google Gemini API
   */
  public static async generateTeacherResponse(
    studentInput: string,
    targetLanguage: string,
    teacherName: string
  ): Promise<AITeacherResponse> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      throw new Error('MISSING_API_KEY');
    }

    const systemPrompt = `You are ${teacherName}, an expert native language teacher teaching ${targetLanguage}.
A student just said or asked you: "${studentInput}".
Analyze their input and reply as an encouraging, pedagogical language tutor.
CRITICAL FORMAT INSTRUCTIONS:
You must reply with ONLY a valid JSON object without any markdown wrapping or backticks.
The JSON must have these exact keys:
{
  "native": "Your answer in ${targetLanguage} native script (polite, educational, natural)",
  "romanized": "Phonetic transliteration of the native response so an English speaker can pronounce it",
  "english": "English translation of your answer",
  "feedback": "Short feedback on student pronunciation or grammar (1 sentence)",
  "score": 96
}
Keep the native response concise (1 to 2 sentences max) so it can be spoken aloud naturally.`;

    const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash'];
    let lastError: Error | null = null;

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: systemPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 350,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
          const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

          const parsed = JSON.parse(cleaned);
          if (parsed.native) {
            return {
              native: parsed.native,
              romanized: parsed.romanized || '',
              english: parsed.english || '',
              feedback: parsed.feedback,
              score: parsed.score || 96,
            };
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          lastError = new Error(errData?.error?.message || `HTTP ${res.status}`);
        }
      } catch (err) {
        lastError = err as Error;
      }
    }

    throw lastError || new Error('All Gemini models failed');
  }
}
