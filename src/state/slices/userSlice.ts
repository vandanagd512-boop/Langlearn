import { StateCreator } from 'zustand';
import { StorageService } from '@/utils/storage';
import { STORAGE_KEYS } from '@/config/constants';

export interface UserState {
  activeLanguageCode: string;
  hasCompletedOnboarding: boolean;
  nativeLanguage: string;
  learningLanguages: string[];
  dailyGoalMinutes: number;
  setActiveLanguageCode: (code: string) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  setNativeLanguage: (lang: string) => void;
  setLearningLanguages: (langs: string[]) => void;
  setDailyGoalMinutes: (minutes: number) => void;
}

export const createUserSlice: StateCreator<UserState, [], [], UserState> = (set) => ({
  activeLanguageCode: StorageService.getItem<string>(STORAGE_KEYS.ACTIVE_LANGUAGE, 'en'),
  hasCompletedOnboarding: StorageService.getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED, false),
  nativeLanguage: StorageService.getItem<string>(STORAGE_KEYS.NATIVE_LANGUAGE, 'en'),
  learningLanguages: StorageService.getItem<string[]>(STORAGE_KEYS.LEARNING_LANGUAGES, ['hi', 'en']),
  dailyGoalMinutes: StorageService.getItem<number>(STORAGE_KEYS.DAILY_GOAL, 15),

  setActiveLanguageCode: (code: string) => {
    StorageService.setItem(STORAGE_KEYS.ACTIVE_LANGUAGE, code);
    set({ activeLanguageCode: code });
  },

  setOnboardingCompleted: (completed: boolean) => {
    StorageService.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, completed);
    set({ hasCompletedOnboarding: completed });
  },

  setNativeLanguage: (lang: string) => {
    StorageService.setItem(STORAGE_KEYS.NATIVE_LANGUAGE, lang);
    set({ nativeLanguage: lang });
  },

  setLearningLanguages: (langs: string[]) => {
    StorageService.setItem(STORAGE_KEYS.LEARNING_LANGUAGES, langs);
    set({ learningLanguages: langs });
    if (langs.length > 0) {
      StorageService.setItem(STORAGE_KEYS.ACTIVE_LANGUAGE, langs[0]);
      set({ activeLanguageCode: langs[0] });
    }
  },

  setDailyGoalMinutes: (minutes: number) => {
    StorageService.setItem(STORAGE_KEYS.DAILY_GOAL, minutes);
    set({ dailyGoalMinutes: minutes });
  },
});
