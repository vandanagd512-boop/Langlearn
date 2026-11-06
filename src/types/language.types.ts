export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  totalLearners: number;
  totalCourses: number;
  isPopular?: boolean;
  accentColor?: string;
}
