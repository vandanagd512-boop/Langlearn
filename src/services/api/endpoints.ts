export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  LANGUAGES: {
    LIST: '/languages',
    DETAIL: (code: string) => `/languages/${code}`,
  },
  COURSES: {
    LIST: '/courses',
    DETAIL: (id: string) => `/courses/${id}`,
  },
  LESSONS: {
    LIST: (courseId: string) => `/courses/${courseId}/lessons`,
    DETAIL: (id: string) => `/lessons/${id}`,
    COMPLETE: (id: string) => `/lessons/${id}/complete`,
  },
  VOCABULARY: {
    LIST: '/vocabulary',
    ADD: '/vocabulary',
    UPDATE: (id: string) => `/vocabulary/${id}`,
    DELETE: (id: string) => `/vocabulary/${id}`,
  },
  PROGRESS: {
    GET: '/progress',
    UPDATE_XP: '/progress/xp',
  },
  AI: {
    TUTOR_CHAT: '/ai/tutor',
    ANALYZE_GRAMMAR: '/ai/grammar',
    EVALUATE_PRONUNCIATION: '/ai/pronunciation',
  },
  TRANSLATE: {
    EXECUTE: '/translate',
  },
} as const;
