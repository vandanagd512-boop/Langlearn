import { IRepository } from './base.repository';
import { UserProfile } from '@/types/user.types';
import { storageEngine } from '../storage-engine';

export class UserRepository implements IRepository<UserProfile> {
  private collection = 'users';

  public async findById(id: string): Promise<UserProfile | null> {
    return storageEngine.get<UserProfile>(this.collection, id);
  }

  public async findAll(): Promise<UserProfile[]> {
    return storageEngine.list<UserProfile>(this.collection);
  }

  public async create(entity: UserProfile): Promise<UserProfile> {
    await storageEngine.set(this.collection, entity.id, entity);
    return entity;
  }

  public async update(id: string, entity: Partial<UserProfile>): Promise<UserProfile | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    const updated = { ...existing, ...entity };
    await storageEngine.set(this.collection, id, updated);
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    await storageEngine.remove(this.collection, id);
    return true;
  }
}

export const userRepository = new UserRepository();
