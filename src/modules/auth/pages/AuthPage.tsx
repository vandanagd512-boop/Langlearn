import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAppStore } from '@/state/store';
import { useTheme } from '@/context/ThemeContext';
import { useNotification } from '@/context/NotificationContext';
import { Card } from '@/components/ui/Card';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { EmailVerificationView } from '../components/EmailVerificationView';
import { Sun, Moon } from 'lucide-react';
import { APP_NAME } from '@/config/constants';
import { logger } from '@/services/logging/logger.service';

type AuthMode = 'login' | 'register' | 'forgot-password' | 'verify';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ mode?: string }>();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { notify } = useNotification();

  const {
    login,
    register,
    loginWithGoogle,
    sendPasswordReset,
    resendVerificationEmail,
    verifyEmail,
    isAuthenticated,
    isLoading,
    error,
    clearError,
    pendingVerificationEmail,
    setPendingVerificationEmail,
  } = useAppStore();

  // Resolve initial mode from URL param or default
  const [mode, setMode] = useState<AuthMode>(() => {
    if (params.mode === 'register') return 'register';
    if (params.mode === 'forgot-password') return 'forgot-password';
    if (params.mode === 'verify') return 'verify';
    return 'login';
  });

  const fromLocation = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';

  // Auto-redirect if session already active and verified
  useEffect(() => {
    if (isAuthenticated && mode !== 'verify') {
      navigate(fromLocation, { replace: true });
    }
  }, [isAuthenticated, mode, navigate, fromLocation]);

  // Synchronize URL mode change
  useEffect(() => {
    if (params.mode === 'register') setMode('register');
    else if (params.mode === 'forgot-password') setMode('forgot-password');
    else if (params.mode === 'verify') setMode('verify');
    clearError();
  }, [params.mode, clearError]);

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  const handleLogin = async (email: string, pass: string, _remember: boolean) => {
    try {
      await login(email, pass);
      notify({
        type: 'success',
        title: 'Welcome Back!',
        message: 'Successfully signed into LangLearn.',
      });
      navigate(fromLocation, { replace: true });
    } catch (err) {
      logger.warn('AuthPage', 'Login attempt rejected', err);
    }
  };

  const handleRegister = async (name: string, email: string, pass: string) => {
    try {
      await register(name, email, pass, 'kn');
      notify({
        type: 'success',
        title: 'Account Created!',
        message: 'Please confirm your email address to continue.',
      });
      setPendingVerificationEmail(email);
      setMode('verify');
    } catch (err) {
      logger.warn('AuthPage', 'Registration attempt rejected', err);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle();
      notify({
        type: 'success',
        title: 'Google Sign-In Successful',
        message: 'Connected with your Google profile.',
      });
      navigate(fromLocation, { replace: true });
    } catch (err) {
      logger.warn('AuthPage', 'Google auth attempt rejected', err);
    }
  };

  const handleSendReset = async (email: string) => {
    await sendPasswordReset(email);
    notify({
      type: 'info',
      title: 'Reset Link Dispatched',
      message: `Password instructions sent to ${email}`,
    });
  };

  const handleVerifyEmail = async (token: string) => {
    const targetEmail = pendingVerificationEmail || 'learner@langlearn.ai';
    await verifyEmail(token, targetEmail);
    notify({
      type: 'success',
      title: 'Email Verified',
      message: 'Account confirmed! Directing to your learning dashboard.',
    });
    navigate(fromLocation, { replace: true });
  };

  const handleResendVerification = async (email: string) => {
    await resendVerificationEmail(email);
    notify({
      type: 'info',
      title: 'Verification Link Sent',
      message: `A fresh verification link was sent to ${email}`,
    });
  };

  return (
    <div className="min-h-screen w-full bg-slate-900/10 dark:bg-black/90 flex justify-center text-slate-900 dark:text-slate-100 antialiased">
      <div className="w-full max-w-md min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-6 shadow-2xl border-x border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
        {/* Top Bar with Brand & Theme Toggle */}
        <header className="w-full max-w-md mx-auto flex items-center justify-between z-10">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 font-bold text-base cursor-pointer select-none group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-black text-xs group-hover:scale-105 transition-transform">
            L
          </div>
          <span className="tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            {APP_NAME}
          </span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 backdrop-blur-md shadow-sm hover:scale-105 active:scale-95 transition"
          title="Toggle light / dark theme"
          aria-label="Toggle theme"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>
      </header>

      {/* Main Form Center Card */}
      <main className="my-auto py-6 flex flex-col items-center">
        <Card className="w-full max-w-md p-6 sm:p-8 shadow-card border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
          {mode === 'login' && (
            <LoginForm
              onLogin={handleLogin}
              onGoogleLogin={handleGoogleAuth}
              onForgotPassword={() => setMode('forgot-password')}
              onGoToRegister={() => setMode('register')}
              isLoading={isLoading}
              errorMessage={error}
            />
          )}

          {mode === 'register' && (
            <RegisterForm
              onRegister={handleRegister}
              onGoogleSignup={handleGoogleAuth}
              onGoToLogin={() => setMode('login')}
              isLoading={isLoading}
              errorMessage={error}
            />
          )}

          {mode === 'forgot-password' && (
            <ForgotPasswordForm
              onSendReset={handleSendReset}
              onBackToLogin={() => setMode('login')}
              isLoading={isLoading}
              errorMessage={error}
            />
          )}

          {mode === 'verify' && (
            <EmailVerificationView
              email={pendingVerificationEmail || 'learner@example.com'}
              onVerifyAndContinue={handleVerifyEmail}
              onResendEmail={handleResendVerification}
              onSignOutOrSwitch={() => setMode('login')}
              isLoading={isLoading}
              errorMessage={error}
            />
          )}
        </Card>
      </main>

      {/* Footer Branding */}
      <footer className="w-full max-w-md mx-auto text-center text-xs text-slate-400 dark:text-slate-500 py-2">
        <span>Protected by enterprise-grade encryption & JWT session validation</span>
      </footer>
    </div>
  </div>
  );
};
