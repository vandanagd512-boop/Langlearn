import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GoogleButton } from './GoogleButton';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { validateEmail } from '@/utils/validators';

interface LoginFormProps {
  onLogin: (email: string, pass: string, remember: boolean) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  onForgotPassword: () => void;
  onGoToRegister: () => void;
  isLoading: boolean;
  errorMessage: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onGoogleLogin,
  onForgotPassword,
  onGoToRegister,
  isLoading,
  errorMessage,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      setEmailError(emailVal.error);
      return;
    } else {
      setEmailError(undefined);
    }

    if (!password) {
      setPasswordError('Please enter your password');
      return;
    } else {
      setPasswordError(undefined);
    }

    await onLogin(email.trim(), password, rememberMe);
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="space-y-1.5 text-center">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Welcome back
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Sign in to continue your multilingual learning streak
        </p>
      </div>

      {/* Global Form Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <Input
          type="email"
          label="Email Address"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(undefined);
          }}
          error={emailError}
          leftIcon={<Mail className="w-4 h-4" />}
          autoComplete="email"
          required
        />

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300">
              Password
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(undefined);
              }}
              error={passwordError}
              leftIcon={<Lock className="w-4 h-4" />}
              autoComplete="current-password"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pointer-events-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
            />
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400">Remember me for 30 days</span>
          </label>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full shadow-md mt-2"
        >
          Sign In
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        <span className="absolute px-3 bg-white dark:bg-slate-900 text-[11px] uppercase tracking-wider text-slate-400">
          or continue with
        </span>
      </div>

      {/* Google Sign In */}
      <GoogleButton
        onClick={onGoogleLogin}
        isLoading={isLoading}
        text="Sign in with Google"
      />

      {/* Switch to Register */}
      <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onGoToRegister}
          className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Create one now
        </button>
      </p>
    </div>
  );
};
