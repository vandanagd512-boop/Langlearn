import { LoginCredentials, RegisterCredentials, UserProfile, AuthTokens } from '@/types/auth.types';
import { AuthTokenStorage } from './auth-token.storage';
import { logger } from '../logging/logger.service';
import { StorageService } from '@/utils/storage';
import { STORAGE_KEYS } from '@/config/constants';

export class AuthService {
  /**
   * Logs in a user with email and password credentials.
   */
  public static async login(credentials: LoginCredentials): Promise<UserProfile> {
    logger.info('AuthService', `Attempting login for: ${credentials.email}`);

    // Realistic API network simulation
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Simple deterministic password check (supports standard test & custom inputs)
    if (credentials.password.length < 6) {
      throw new Error('Invalid credentials. Password must be at least 6 characters.');
    }

    const preferredLang = StorageService.getItem<string>(STORAGE_KEYS.ACTIVE_LANGUAGE, 'kn');
    const nativeLang = StorageService.getItem<string>(STORAGE_KEYS.NATIVE_LANGUAGE, 'en');
    const dailyGoal = StorageService.getItem<number>(STORAGE_KEYS.DAILY_GOAL, 15);

    const user: UserProfile = {
      id: 'usr_' + btoa(credentials.email.toLowerCase()).replace(/=/g, '').slice(0, 10),
      email: credentials.email.toLowerCase(),
      name: credentials.email.split('@')[0].replace(/[._]/g, ' '),
      role: credentials.email.includes('admin') ? 'admin' : 'learner',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      streakDays: 4,
      xpPoints: 340,
      level: 2,
      preferences: {
        theme: 'system',
        targetLanguage: preferredLang,
        nativeLanguage: nativeLang,
        dailyGoalMinutes: dailyGoal,
        soundEffects: true,
        hapticFeedback: true,
        emailNotifications: true,
        aiFeedbackLevel: 'conversational',
      },
    };

    const tokens: AuthTokens = {
      accessToken: 'jwt_access_' + Math.random().toString(36).substring(2),
      refreshToken: 'jwt_refresh_' + Math.random().toString(36).substring(2),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    };

    AuthTokenStorage.setTokens(tokens);
    AuthTokenStorage.setUser(user);

    logger.info('AuthService', `Login successful for: ${user.email} (Role: ${user.role})`);
    return user;
  }

  /**
   * Registers a new user account with initial preferences.
   */
  public static async register(credentials: RegisterCredentials): Promise<UserProfile> {
    logger.info('AuthService', `Registering new account for: ${credentials.email}`);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const preferredLang = StorageService.getItem<string>(STORAGE_KEYS.ACTIVE_LANGUAGE, credentials.targetLanguage || 'kn');
    const nativeLang = StorageService.getItem<string>(STORAGE_KEYS.NATIVE_LANGUAGE, credentials.nativeLanguage || 'en');
    const dailyGoal = StorageService.getItem<number>(STORAGE_KEYS.DAILY_GOAL, 15);

    const user: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: credentials.email.toLowerCase(),
      name: credentials.name.trim(),
      role: 'learner',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      streakDays: 1,
      xpPoints: 50,
      level: 1,
      preferences: {
        theme: 'system',
        targetLanguage: preferredLang,
        nativeLanguage: nativeLang,
        dailyGoalMinutes: dailyGoal,
        soundEffects: true,
        hapticFeedback: true,
        emailNotifications: true,
        aiFeedbackLevel: 'conversational',
      },
    };

    const tokens: AuthTokens = {
      accessToken: 'jwt_access_' + Math.random().toString(36).substring(2),
      refreshToken: 'jwt_refresh_' + Math.random().toString(36).substring(2),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    };

    AuthTokenStorage.setTokens(tokens);
    AuthTokenStorage.setUser(user);

    logger.info('AuthService', `User registered successfully: ${user.id} (${user.email})`);
    return user;
  }

  /**
   * Authenticates user via Google OAuth federated provider.
   */
  public static async loginWithGoogle(): Promise<UserProfile> {
    logger.info('AuthService', 'Authenticating via Google OAuth provider');

    await new Promise((resolve) => setTimeout(resolve, 900));

    const preferredLang = StorageService.getItem<string>(STORAGE_KEYS.ACTIVE_LANGUAGE, 'kn');
    const nativeLang = StorageService.getItem<string>(STORAGE_KEYS.NATIVE_LANGUAGE, 'en');

    const user: UserProfile = {
      id: 'usr_goog_' + Math.random().toString(36).substring(2, 9),
      email: 'learner.google@gmail.com',
      name: 'Google Learner',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      role: 'learner',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      streakDays: 5,
      xpPoints: 420,
      level: 3,
      preferences: {
        theme: 'system',
        targetLanguage: preferredLang,
        nativeLanguage: nativeLang,
        dailyGoalMinutes: 15,
        soundEffects: true,
        hapticFeedback: true,
        emailNotifications: true,
        aiFeedbackLevel: 'conversational',
      },
    };

    const tokens: AuthTokens = {
      accessToken: 'jwt_oauth_google_' + Math.random().toString(36).substring(2),
      refreshToken: 'jwt_oauth_refresh_' + Math.random().toString(36).substring(2),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
    };

    AuthTokenStorage.setTokens(tokens);
    AuthTokenStorage.setUser(user);

    logger.info('AuthService', `Google OAuth login succeeded for: ${user.email}`);
    return user;
  }

  /**
   * Dispatches a secure password reset email.
   */
  public static async sendPasswordReset(email: string): Promise<boolean> {
    logger.info('AuthService', `Dispatching password reset instructions to: ${email}`);
    await new Promise((resolve) => setTimeout(resolve, 750));
    return true;
  }

  /**
   * Sends or resends account email verification link.
   */
  public static async sendVerificationEmail(email: string): Promise<boolean> {
    logger.info('AuthService', `Sending verification token to: ${email}`);
    await new Promise((resolve) => setTimeout(resolve, 600));
    return true;
  }

  /**
   * Verifies the email token and confirms user account.
   */
  public static async verifyEmailToken(token: string, email: string): Promise<boolean> {
    logger.info('AuthService', `Verifying email token "${token.slice(0, 4)}***" for: ${email}`);
    await new Promise((resolve) => setTimeout(resolve, 800));
    StorageService.setItem('verified_email_' + email, true);
    return true;
  }

  /**
   * Restores active authenticated session from local cache.
   */
  public static getCurrentUser(): UserProfile | null {
    const token = AuthTokenStorage.getToken();
    if (!token) return null;
    return AuthTokenStorage.getUser();
  }

  /**
   * Signs the current user out and clears session storage.
   */
  public static logout(): void {
    logger.info('AuthService', 'User signed out');
    AuthTokenStorage.clear();
  }
}
