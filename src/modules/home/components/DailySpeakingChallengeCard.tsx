import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Flame, ShieldCheck, Zap, Mic, ArrowRight, CheckCircle2 } from 'lucide-react';
import { StorageService } from '@/utils/storage';
import { useNotification } from '@/context/NotificationContext';

interface DailyChallengeState {
  completedSentences: number;
  targetSentences: number;
  streakDays: number;
  isClaimed: boolean;
  streakShieldActive: boolean;
  lastUpdatedDate: string;
}

const STORAGE_KEY = 'daily_speaking_challenge';

export const DailySpeakingChallengeCard: React.FC = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const todayStr = new Date().toISOString().split('T')[0];

  const [state, setState] = useState<DailyChallengeState>(() => {
    const defaultState: DailyChallengeState = {
      completedSentences: 2,
      targetSentences: 3,
      streakDays: 5,
      isClaimed: false,
      streakShieldActive: true,
      lastUpdatedDate: todayStr,
    };
    return StorageService.getItem<DailyChallengeState>(STORAGE_KEY, defaultState);
  });

  useEffect(() => {
    StorageService.setItem(STORAGE_KEY, state);
  }, [state]);

  const isCompleted = state.completedSentences >= state.targetSentences;
  const progressPercent = Math.min(
    100,
    Math.round((state.completedSentences / state.targetSentences) * 100)
  );

  const handleClaimBonus = () => {
    if (!state.isClaimed && isCompleted) {
      setState((prev) => ({ ...prev, isClaimed: true }));
      notify({
        type: 'success',
        title: 'Daily Challenge Completed! 🏆',
        message: 'Claimed +50 XP and activated your 24-hour Streak Freeze Shield!',
      });
    }
  };

  return (
    <Card className="relative overflow-hidden p-5 border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-slate-900/5 to-blue-500/5 shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
            <Mic className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Daily Speaking Challenge
              </h3>
              <Badge variant="amber" size="sm">
                +50 XP Quest
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Practice pronunciation to keep your vocal fluency sharp!
            </p>
          </div>
        </div>

        {/* Streak & Shield Status */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-xs font-black text-rose-600 dark:text-rose-400">
            <Flame className="w-4 h-4 fill-current animate-bounce" />
            <span>{state.streakDays} Day Streak</span>
          </div>
          {state.streakShieldActive && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 mt-0.5">
              <ShieldCheck className="w-3 h-3" />
              Streak Shield On
            </span>
          )}
        </div>
      </div>

      {/* Challenge Quest Bar */}
      <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Speak {state.targetSentences} real-life sentences today
          </span>
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {state.completedSentences} / {state.targetSentences} Spoken
          </span>
        </div>
        <ProgressBar value={progressPercent} color="blue" size="sm" />
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
          <span>Reward: +50 XP & Streak Shield</span>
        </span>

        {isCompleted ? (
          <Button
            size="sm"
            variant={state.isClaimed ? 'secondary' : 'primary'}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            onClick={handleClaimBonus}
            disabled={state.isClaimed}
            className="text-xs h-auto py-1.5"
          >
            {state.isClaimed ? 'Claimed ✓' : 'Claim +50 XP'}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/practice?mode=speech')}
            className="text-xs h-auto py-1.5 bg-blue-600 hover:bg-blue-700"
          >
            Start Speaking
          </Button>
        )}
      </div>
    </Card>
  );
};
