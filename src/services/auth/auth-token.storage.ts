import { StorageService } from '@/utils/storage';
import { STORAGE_KEYS } from '@/config/constants';
import { AuthTokens, UserProfile } from '@/types/auth.types';

export class AuthTokenStorage {
  public static getToken(): string | null {
    return StorageService.getItem<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
  }

  public static setTokens(tokens: AuthTokens): void {
    StorageService.setItem(STORAGE_KEYS.AUTH_TOKEN, tokens.accessToken);
    StorageService.setItem('refresh_token', tokens.refreshToken);
  }

  public static getUser(): UserProfile | null {
    return StorageService.getItem<UserProfile | null>(STORAGE_KEYS.AUTH_USER, null);
  }

  public static setUser(user: UserProfile): void {
    StorageService.setItem(STORAGE_KEYS.AUTH_USER, user);
  }

  public static clear(): void {
    StorageService.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    StorageService.removeItem('refresh_token');
    StorageService.removeItem(STORAGE_KEYS.AUTH_USER);
  }
}
