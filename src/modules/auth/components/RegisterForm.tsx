import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GoogleButton } from './GoogleButton';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { validateEmail, validatePassword, validateName } from '@/utils/validators';

interface RegisterFormProps {
  onRegister: (name: string, email: string, pass: string) => Promise<void>;
  onGoogleSignup: () => Promise<void>;
  onGoToLogin: () => void;
  isLoading: boolean;
  errorMessage: string | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onGoogleSignup,
  onGoToLogin,
  isLoading,
  errorMessage,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameVal = validateName(name);
    const emailVal = validateEmail(email);
    const passVal = validatePassword(password);

    const newErrors: typeof errors = {};
    if (!nameVal.isValid) newErrors.name = nameVal.error;
    if (!emailVal.isValid) newErrors.email = emailVal.error;
    if (!passVal.isValid) newErrors.password = passVal.error;

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await onRegister(name.trim(), email.trim(), password);
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="space-y-1.5 text-center">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Create your account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Start your personalized journey to language mastery
        </p>
      </div>

      {/* Global Form Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <Input
          type="text"
          label="Full Name"
          placeholder="Maya Sharma"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          error={errors.name}
          leftIcon={<User className="w-4 h-4" />}
          autoComplete="name"
          required
        />

        {/* Email */}
        <Input
          type="email"
          label="Email Address"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
          leftIcon={<Mail className="w-4 h-4" />}
          autoComplete="email"
          required
        />

        {/* Password */}
        <div className="space-y-1.5">
          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
            leftIcon={<Lock className="w-4 h-4" />}
            autoComplete="new-password"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pointer-events-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            required
          />

          {/* Password Strength Indicator */}
          <PasswordStrengthMeter password={password} />
        </div>

        {/* Confirm Password */}
        <Input
          type={showConfirmPassword ? 'text' : 'password'}
          label="Confirm Password"
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword)
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }}
          error={errors.confirmPassword}
          leftIcon={<Lock className="w-4 h-4" />}
          autoComplete="new-password"
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="pointer-events-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          required
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full shadow-md mt-2"
        >
          Create Account
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        <span className="absolute px-3 bg-white dark:bg-slate-900 text-[11px] uppercase tracking-wider text-slate-400">
          or register with
        </span>
      </div>

      {/* Google Sign Up */}
      <GoogleButton
        onClick={onGoogleSignup}
        isLoading={isLoading}
        text="Sign up with Google"
      />

      {/* Switch to Login */}
      <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onGoToLogin}
          className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};
