import { logger } from '@/services/logging/logger.service';

/**
 * StorageEngine: Client-side persistent key-value & document store
 */
export class StorageEngine {
  private dbName: string;

  constructor(dbName = 'LangLearnDB') {
    this.dbName = dbName;
  }

  public async get<T>(collection: string, id: string): Promise<T | null> {
    try {
      const raw = localStorage.getItem(`${this.dbName}_${collection}_${id}`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      logger.error('StorageEngine', `Failed to read ${collection}/${id}`, e);
      return null;
    }
  }

  public async set<T>(collection: string, id: string, data: T): Promise<void> {
    try {
      localStorage.setItem(`${this.dbName}_${collection}_${id}`, JSON.stringify(data));
    } catch (e) {
      logger.error('StorageEngine', `Failed to save ${collection}/${id}`, e);
    }
  }

  public async remove(collection: string, id: string): Promise<void> {
    try {
      localStorage.removeItem(`${this.dbName}_${collection}_${id}`);
    } catch (e) {
      logger.error('StorageEngine', `Failed to remove ${collection}/${id}`, e);
    }
  }

  public async list<T>(collection: string): Promise<T[]> {
    const items: T[] = [];
    const prefix = `${this.dbName}_${collection}_`;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '');
          items.push(item);
        } catch {
          // ignore corrupted entry
        }
      }
    }
    return items;
  }
}

export const storageEngine = new StorageEngine();
