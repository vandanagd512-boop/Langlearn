import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { validateEmail } from '@/utils/validators';

interface ForgotPasswordFormProps {
  onSendReset: (email: string) => Promise<void>;
  onBackToLogin: () => void;
  isLoading: boolean;
  errorMessage: string | null;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSendReset,
  onBackToLogin,
  isLoading,
  errorMessage,
}) => {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const val = validateEmail(email);
    if (!val.isValid) {
      setEmailError(val.error);
      return;
    }

    setEmailError(undefined);
    await onSendReset(email.trim());
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="w-full space-y-6 text-center animate-fadeIn">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Check your inbox
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            We sent password recovery instructions to:
          </p>
          <p className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            {email}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Didn't receive the email? Check your spam folder or wait a moment before trying again.
        </div>

        <div className="space-y-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => setIsSuccess(false)}
            className="w-full"
          >
            Try another email
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="md"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={onBackToLogin}
            className="w-full"
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="space-y-1.5 text-center">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Reset password
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Enter your registered email and we'll send you a recovery link
        </p>
      </div>

      {/* Global Form Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          rightIcon={<Send className="w-4 h-4" />}
          className="w-full shadow-md mt-2"
        >
          Send Reset Link
        </Button>
      </form>

      {/* Back button */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </button>
      </div>
    </div>
  );
};
