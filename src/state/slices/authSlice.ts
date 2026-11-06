import { StateCreator } from 'zustand';
import { UserProfile } from '@/types/user.types';
import { AuthService } from '@/services/auth/auth.service';

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  pendingVerificationEmail: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, targetLang: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  verifyEmail: (token: string, email: string) => Promise<void>;
  setPendingVerificationEmail: (email: string | null) => void;
  clearError: () => void;
  logout: () => void;
  checkAuth: () => void;
}

export const createAuthSlice: StateCreator<AuthState, [], [], AuthState> = (set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  pendingVerificationEmail: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.login({ email, password });
      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  register: async (name, email, password, targetLanguage) => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.register({
        name,
        email,
        password,
        targetLanguage,
        nativeLanguage: 'en',
      });
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        pendingVerificationEmail: email,
        error: null,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.loginWithGoogle();
      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  sendPasswordReset: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await AuthService.sendPasswordReset(email);
      set({ isLoading: false, error: null });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send reset link';
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  resendVerificationEmail: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await AuthService.sendVerificationEmail(email);
      set({ isLoading: false, error: null });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resend verification email';
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  verifyEmail: async (token, email) => {
    set({ isLoading: true, error: null });
    try {
      await AuthService.verifyEmailToken(token, email);
      set({ isLoading: false, pendingVerificationEmail: null, error: null });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification token invalid or expired';
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  setPendingVerificationEmail: (email) => {
    set({ pendingVerificationEmail: email });
  },

  clearError: () => {
    set({ error: null });
  },

  logout: () => {
    AuthService.logout();
    set({ user: null, isAuthenticated: false, error: null, pendingVerificationEmail: null });
  },

  checkAuth: () => {
    const user = AuthService.getCurrentUser();
    if (user) {
      set({ user, isAuthenticated: true });
    }
  },
});
