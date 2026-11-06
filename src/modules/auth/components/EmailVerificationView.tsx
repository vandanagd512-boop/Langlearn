import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { MailCheck, RotateCcw, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

interface EmailVerificationViewProps {
  email: string;
  onVerifyAndContinue: (token: string) => Promise<void>;
  onResendEmail: (email: string) => Promise<void>;
  onSignOutOrSwitch: () => void;
  isLoading: boolean;
  errorMessage: string | null;
}

export const EmailVerificationView: React.FC<EmailVerificationViewProps> = ({
  email,
  onVerifyAndContinue,
  onResendEmail,
  onSignOutOrSwitch,
  isLoading,
  errorMessage,
}) => {
  const [cooldownSeconds, setCooldownSeconds] = useState(60);
  const [isResent, setIsResent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('742890'); // Auto-filled demo verification code for seamless UX

  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => setCooldownSeconds((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  const handleResend = async () => {
    if (cooldownSeconds > 0) return;
    await onResendEmail(email);
    setIsResent(true);
    setCooldownSeconds(60);
    setTimeout(() => setIsResent(false), 4000);
  };

  const handleContinue = async () => {
    await onVerifyAndContinue(verificationCode || 'valid_token');
  };

  return (
    <div className="w-full space-y-6 text-center animate-fadeIn">
      {/* Mailbox Emblem */}
      <div className="relative mx-auto w-20 h-20">
        <div className="absolute inset-0 rounded-3xl bg-blue-500/20 blur-xl animate-pulseGlow" />
        <div className="relative w-full h-full rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl">
          <MailCheck className="w-10 h-10" />
        </div>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Verify your email</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Confirm your account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
          We sent a verification link to:
        </p>
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 py-1.5 px-3 rounded-xl inline-block max-w-full truncate">
          {email || 'learner@example.com'}
        </p>
      </div>

      {/* Success banner if resent */}
      {isResent && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>New verification link dispatched!</span>
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-600 dark:text-rose-400">
          {errorMessage}
        </div>
      )}

      {/* Interactive Verification code preview/box */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 text-left">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Verification Code / Security Token
        </label>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter 6-digit code or click Continue"
          className="w-full tracking-widest text-center font-mono font-bold text-base py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-[11px] text-slate-400">
          You can click the link in your email, or click Continue below to proceed immediately.
        </p>
      </div>

      {/* Primary Action Button */}
      <div className="space-y-3 pt-1">
        <Button
          type="button"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={handleContinue}
          className="w-full shadow-md"
        >
          Confirm & Continue to Dashboard
        </Button>

        {/* Resend Link Button */}
        <div className="flex items-center justify-center gap-2 text-xs">
          <span className="text-slate-400">Didn't receive the email?</span>
          <button
            type="button"
            disabled={cooldownSeconds > 0 || isLoading}
            onClick={handleResend}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>
              {cooldownSeconds > 0 ? `Resend in ${cooldownSeconds}s` : 'Resend link now'}
            </span>
          </button>
        </div>

        {/* Switch Account */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onSignOutOrSwitch}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Use a different email address</span>
          </button>
        </div>
      </div>
    </div>
  );
};
