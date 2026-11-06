import { IRepository } from './base.repository';
import { UserProgress } from '@/types/progress.types';
import { storageEngine } from '../storage-engine';

export class ProgressRepository implements IRepository<UserProgress> {
  private collection = 'user_progress';

  public async findById(userId: string): Promise<UserProgress | null> {
    return storageEngine.get<UserProgress>(this.collection, userId);
  }

  public async findAll(): Promise<UserProgress[]> {
    return storageEngine.list<UserProgress>(this.collection);
  }

  public async create(entity: UserProgress): Promise<UserProgress> {
    await storageEngine.set(this.collection, entity.userId, entity);
    return entity;
  }

  public async update(userId: string, entity: Partial<UserProgress>): Promise<UserProgress | null> {
    const existing = await this.findById(userId);
    if (!existing) return null;
    const updated = { ...existing, ...entity };
    await storageEngine.set(this.collection, userId, updated);
    return updated;
  }

  public async delete(userId: string): Promise<boolean> {
    await storageEngine.remove(this.collection, userId);
    return true;
  }
}

export const progressRepository = new ProgressRepository();
