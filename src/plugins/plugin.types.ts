export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  enabledByDefault?: boolean;
}

export interface PluginContext {
  userId?: string;
  activeLanguage: string;
  apiClient: unknown;
  logger: unknown;
}

export interface ILangLearnPlugin {
  manifest: PluginManifest;
  onInit?(context: PluginContext): Promise<void> | void;
  onDestroy?(): Promise<void> | void;
  onLessonComplete?(lessonId: string, score: number): Promise<void> | void;
  onWordMastered?(wordId: string): Promise<void> | void;
}
