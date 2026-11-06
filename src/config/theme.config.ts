export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
}

export const ThemeConfig = {
  defaultMode: 'system' as ThemeMode,
  storageKey: 'langlearn_theme_mode',
} as const;
