import { StorageService } from '@/utils/storage';

export type ActivityType = 'video' | 'lesson' | 'vocabulary' | 'quiz' | 'speaking';

export interface ActivityLogEntry {
  id: string;
  timestamp: number;
  date: string; // YYYY-MM-DD in local time
  type: ActivityType;
  title: string;
  durationSeconds: number;
  xpEarned: number;
  accuracyScore?: number;
  wordsCount?: number;
  languageCode: string;
}

export interface DailyBreakdownItem {
  day: string; // 'Mon', 'Tue', etc.
  date: string; // 'YYYY-MM-DD'
  minutes: number;
  xp: number;
  tasksCount: number;
  isToday: boolean;
}

export interface SkillProgressItem {
  skill: string;
  level: string;
  percent: number;
  color: string;
  countLabel: string;
}

export interface AnalyticsSummary {
  totalStudySeconds: number;
  totalStudyMinutes: number;
  totalStudyHoursFormatted: string;
  totalXp: number;
  streakDays: number;
  wordsMastered: number;
  totalTasksCompleted: number;
  weeklyBreakdown: DailyBreakdownItem[];
  todayMinutes: number;
  todayXp: number;
  skillsBreakdown: SkillProgressItem[];
  memoryHealth: {
    matureWords: number;
    inLearning: number;
    dueForReview: number;
    retentionRate: number;
  };
}

const STORAGE_KEY_ACTIVITIES = 'langlearn_activity_log';
const STORAGE_KEY_PRACTICED_WORDS = 'practiced_words_v1';

export class LearningAnalyticsService {
  /**
   * Helper to format any Date to YYYY-MM-DD in local timezone
   */
  public static formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Start a task session timer. Returns a function that returns exact elapsed seconds.
   */
  public static startTaskTimer(): () => number {
    const startTime = Date.now();
    return () => {
      const elapsedMs = Date.now() - startTime;
      return Math.max(1, Math.round(elapsedMs / 1000));
    };
  }

  /**
   * Retrieve all activity logs from localStorage
   */
  public static getActivities(): ActivityLogEntry[] {
    return StorageService.getItem<ActivityLogEntry[]>(STORAGE_KEY_ACTIVITIES, []);
  }

  /**
   * Record a completed learning task into the real-time activity log
   */
  public static recordActivity(
    entry: Omit<ActivityLogEntry, 'id' | 'timestamp' | 'date'>
  ): ActivityLogEntry {
    const now = new Date();
    const newRecord: ActivityLogEntry = {
      ...entry,
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: now.getTime(),
      date: this.formatDate(now),
      durationSeconds: Math.max(1, Math.round(entry.durationSeconds)),
      xpEarned: Math.max(0, Math.round(entry.xpEarned)),
    };

    const existing = this.getActivities();
    const updated = [newRecord, ...existing];
    StorageService.setItem(STORAGE_KEY_ACTIVITIES, updated);

    // Notify listeners across app for instant live UI update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('learning_activity_logged', { detail: newRecord })
      );
    }

    return newRecord;
  }

  /**
   * Calculate live analytics summary based on user's actual activity log
   */
  public static getAnalyticsSummary(
    timeRange: 'week' | 'month' | 'all' = 'week',
    languageCode?: string
  ): AnalyticsSummary {
    let allActivities = this.getActivities();

    // Filter by language if specified
    if (languageCode && languageCode !== 'all') {
      allActivities = allActivities.filter((a) => a.languageCode === languageCode);
    }

    const now = new Date();
    const todayStr = this.formatDate(now);

    // Filter by timeRange if applicable
    const nowMs = now.getTime();
    const filteredActivities = allActivities.filter((a) => {
      if (timeRange === 'all') return true;
      const daysDiff = (nowMs - a.timestamp) / (1000 * 60 * 60 * 24);
      if (timeRange === 'week') return daysDiff <= 7;
      if (timeRange === 'month') return daysDiff <= 30;
      return true;
    });

    // 1. Total Study Time
    const totalStudySeconds = filteredActivities.reduce(
      (sum, a) => sum + (a.durationSeconds || 0),
      0
    );
    const totalStudyMinutes = Math.round(totalStudySeconds / 60);
    const hours = (totalStudySeconds / 3600).toFixed(1);
    const totalStudyHoursFormatted =
      totalStudyMinutes >= 60 ? `${hours} Hours` : `${totalStudyMinutes} Mins`;

    // 2. Total XP
    const totalXp = filteredActivities.reduce((sum, a) => sum + (a.xpEarned || 0), 0);

    // 3. Active Streak (consecutive days with at least 1 completed task)
    const uniqueDates = Array.from(new Set(allActivities.map((a) => a.date))).sort(
      (a, b) => b.localeCompare(a)
    );

    let streakDays = 0;
    if (uniqueDates.length > 0) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = this.formatDate(yesterday);

      // Check if user practiced today or yesterday
      if (uniqueDates[0] === todayStr || uniqueDates[0] === yesterdayStr) {
        streakDays = 1;
        let checkDate = new Date(uniqueDates[0] === todayStr ? now : yesterday);

        for (let i = 1; i < uniqueDates.length; i++) {
          checkDate.setDate(checkDate.getDate() - 1);
          const expectedStr = this.formatDate(checkDate);
          if (uniqueDates[i] === expectedStr) {
            streakDays++;
          } else {
            break;
          }
        }
      }
    }

    // 4. Words Mastered
    const practicedWords = StorageService.getItem<string[]>(
      STORAGE_KEY_PRACTICED_WORDS,
      []
    );
    const wordsFromActivities = filteredActivities.reduce(
      (sum, a) => sum + (a.wordsCount || 0),
      0
    );
    const wordsMastered = Math.max(practicedWords.length, wordsFromActivities);

    // 5. Weekly Practice Breakdown (Monday through Sunday of current week)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
    // Adjust so Monday is 0, Sunday is 6
    const mondayOffset = (currentDayOfWeek + 6) % 7;
    const mondayDate = new Date(now);
    mondayDate.setDate(now.getDate() - mondayOffset);
    mondayDate.setHours(0, 0, 0, 0);

    const weeklyBreakdown: DailyBreakdownItem[] = [];
    let todayMinutes = 0;
    let todayXp = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date(mondayDate);
      d.setDate(mondayDate.getDate() + i);
      const dStr = this.formatDate(d);
      const dName = dayNames[d.getDay()];
      const isToday = dStr === todayStr;

      const dayActs = allActivities.filter((a) => a.date === dStr);
      const daySeconds = dayActs.reduce((sum, a) => sum + (a.durationSeconds || 0), 0);
      const dayMins = Math.round(daySeconds / 60);
      const dayXpVal = dayActs.reduce((sum, a) => sum + (a.xpEarned || 0), 0);

      if (isToday) {
        todayMinutes = dayMins;
        todayXp = dayXpVal;
      }

      weeklyBreakdown.push({
        day: dName,
        date: dStr,
        minutes: dayMins,
        xp: dayXpVal,
        tasksCount: dayActs.length,
        isToday,
      });
    }

    // 6. CEFR Skills Breakdown (computed from actual task completions)
    const vocabTasks = filteredActivities.filter((a) => a.type === 'vocabulary');
    const videoTasks = filteredActivities.filter((a) => a.type === 'video');
    const speakingTasks = filteredActivities.filter(
      (a) => a.type === 'speaking' || (a.type === 'video' && a.accuracyScore)
    );
    const lessonTasks = filteredActivities.filter(
      (a) => a.type === 'lesson' || a.type === 'quiz'
    );

    const vocabPercent = Math.min(100, Math.round(wordsMastered * 2.5 + vocabTasks.length * 5));
    const listeningPercent = Math.min(100, Math.round(videoTasks.length * 10));

    const speakingScores = speakingTasks
      .map((a) => a.accuracyScore)
      .filter((s): s is number => typeof s === 'number' && s > 0);
    const avgSpeaking =
      speakingScores.length > 0
        ? Math.round(speakingScores.reduce((a, b) => a + b, 0) / speakingScores.length)
        : Math.min(100, speakingTasks.length * 12);

    const grammarPercent = Math.min(100, Math.round(lessonTasks.length * 15));

    const getCefrLevel = (pct: number) => {
      if (pct >= 85) return 'Level B2';
      if (pct >= 60) return 'Level B1';
      if (pct >= 30) return 'Level A2';
      return 'Level A1';
    };

    const skillsBreakdown: SkillProgressItem[] = [
      {
        skill: 'Vocabulary & Phrases',
        level: getCefrLevel(vocabPercent),
        percent: vocabPercent,
        color: 'bg-blue-600',
        countLabel: `${wordsMastered} Words`,
      },
      {
        skill: 'Listening Comprehension',
        level: getCefrLevel(listeningPercent),
        percent: listeningPercent,
        color: 'bg-indigo-600',
        countLabel: `${videoTasks.length} Videos`,
      },
      {
        skill: 'Speaking & Pronunciation',
        level: getCefrLevel(avgSpeaking),
        percent: avgSpeaking,
        color: 'bg-emerald-500',
        countLabel: `${speakingScores.length} Tested`,
      },
      {
        skill: 'Grammar & Syntax',
        level: getCefrLevel(grammarPercent),
        percent: grammarPercent,
        color: 'bg-purple-600',
        countLabel: `${lessonTasks.length} Lessons`,
      },
    ];

    // 7. Memory Health (SRS)
    const matureWords = Math.round(wordsMastered * 0.6);
    const inLearning = Math.round(wordsMastered * 0.3);
    const dueForReview = Math.max(0, wordsMastered - matureWords - inLearning);
    const retentionRate =
      speakingScores.length > 0 ? avgSpeaking : wordsMastered > 0 ? 88 : 0;

    return {
      totalStudySeconds,
      totalStudyMinutes,
      totalStudyHoursFormatted,
      totalXp,
      streakDays,
      wordsMastered,
      totalTasksCompleted: filteredActivities.length,
      weeklyBreakdown,
      todayMinutes,
      todayXp,
      skillsBreakdown,
      memoryHealth: {
        matureWords,
        inLearning,
        dueForReview,
        retentionRate,
      },
    };
  }

  /**
   * Reset activity log (useful for user account reset)
   */
  public static clearActivities(): void {
    StorageService.removeItem(STORAGE_KEY_ACTIVITIES);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('learning_activity_logged'));
    }
  }
}
