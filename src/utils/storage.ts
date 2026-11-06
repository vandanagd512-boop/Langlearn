/**
 * Safe local storage service with namespace isolation and fallback.
 */

const STORAGE_PREFIX = 'langlearn_';

export class StorageService {
  private static isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  public static getItem<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable()) return defaultValue;
    try {
      const item = window.localStorage.getItem(STORAGE_PREFIX + key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  public static setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) return false;
    try {
      window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  public static removeItem(key: string): boolean {
    if (!this.isAvailable()) return false;
    try {
      window.localStorage.removeItem(STORAGE_PREFIX + key);
      return true;
    } catch {
      return false;
    }
  }

  public static clear(): boolean {
    if (!this.isAvailable()) return false;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      return true;
    } catch {
      return false;
    }
  }
}
