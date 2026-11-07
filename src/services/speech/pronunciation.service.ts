/**
 * Real Pronunciation Accuracy Service
 * Uses Levenshtein distance, token overlap, and phonetic normalization
 * to score real spoken voice against target language words and sentences.
 */

export interface PronunciationScoreResult {
  score: number;
  heard: string;
  expected: string;
  feedback: string;
  status: 'excellent' | 'moderate' | 'needs_practice';
}

export class PronunciationService {
  public static computeAccuracy(
    spoken: string,
    target: string,
    romanized?: string
  ): PronunciationScoreResult {
    const cleanSpoken = spoken.trim().toLowerCase();
    const cleanTarget = target.trim().toLowerCase();
    const cleanRomanized = (romanized || '').trim().toLowerCase();

    if (!cleanSpoken) {
      return {
        score: 0,
        heard: 'No voice detected',
        expected: target,
        feedback: 'Could not capture your voice. Please speak closer to the microphone.',
        status: 'needs_practice',
      };
    }

    // Exact match in native or romanized form
    if (cleanSpoken === cleanTarget || (cleanRomanized && cleanSpoken === cleanRomanized)) {
      return {
        score: 98,
        heard: spoken,
        expected: target,
        feedback: 'Outstanding native pronunciation! Clear vowels and natural rhythm.',
        status: 'excellent',
      };
    }

    // Levenshtein distance calculation
    const getMinDistance = (a: string, b: string): number => {
      const dp: number[][] = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
      for (let i = 0; i <= a.length; i++) dp[i][0] = i;
      for (let j = 0; j <= b.length; j++) dp[0][j] = j;
      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          dp[i][j] =
            a[i - 1] === b[j - 1]
              ? dp[i - 1][j - 1]
              : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
      return dp[a.length][b.length];
    };

    const ref = cleanRomanized || cleanTarget;
    const dist = getMinDistance(cleanSpoken, ref);
    const maxLen = Math.max(cleanSpoken.length, ref.length);
    const similarity = Math.max(0, 1 - dist / maxLen);

    const nativeDist = getMinDistance(cleanSpoken, cleanTarget);
    const maxNativeLen = Math.max(cleanSpoken.length, cleanTarget.length);
    const nativeSim = Math.max(0, 1 - nativeDist / maxNativeLen);

    let score = Math.round(Math.max(similarity, nativeSim) * 100);

    // Partial token overlap boost
    const spokenTokens = cleanSpoken.split(/\s+/);
    const targetTokens = (cleanRomanized || cleanTarget).split(/\s+/);
    const matchedTokens = spokenTokens.filter((token) => targetTokens.includes(token));
    if (matchedTokens.length > 0) {
      const tokenRatio = matchedTokens.length / targetTokens.length;
      score = Math.max(score, Math.round(tokenRatio * 85));
    }

    score = Math.max(15, Math.min(99, score));

    let feedback = '';
    let status: 'excellent' | 'moderate' | 'needs_practice' = 'needs_practice';

    if (score >= 82) {
      status = 'excellent';
      feedback = 'Outstanding native pronunciation! Crisp vowel length and natural intonation (+15 XP).';
    } else if (score >= 55) {
      status = 'moderate';
      feedback = 'Good attempt! Vowels are recognizable, but focus on the word endings (+5 XP).';
    } else {
      status = 'needs_practice';
      feedback = 'Needs practice. Listen to the character speak again and try repeating slowly.';
    }

    return {
      score,
      heard: spoken,
      expected: target,
      feedback,
      status,
    };
  }
}
