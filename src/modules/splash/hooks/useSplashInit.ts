import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/state/store';
import { StorageService } from '@/utils/storage';
import { STORAGE_KEYS, ROUTES } from '@/config/constants';
import { logger } from '@/services/logging/logger.service';
import { AppConfig } from '@/config/app.config';

export type SplashStage =
  | 'connecting'
  | 'validating'
  | 'authenticating'
  | 'ready'
  | 'error';

export interface SplashState {
  stage: SplashStage;
  progress: number;
  message: string;
  isExiting: boolean;
  error: string | null;
  destination: string | null;
}

export function useSplashInit(minDurationMs: number = 2000) {
  const navigate = useNavigate();
  const { checkAuth, isAuthenticated } = useAppStore();

  const [state, setState] = useState<SplashState>({
    stage: 'connecting',
    progress: 10,
    message: 'Initializing LangLearn engine...',
    isExiting: false,
    error: null,
    destination: null,
  });

  const runInitialization = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      stage: 'connecting',
      progress: 15,
      message: 'Connecting to LangLearn engine...',
      error: null,
      isExiting: false,
    }));

    const startTime = Date.now();

    try {
      logger.info('SplashInit', `Initializing platform v${AppConfig.version}...`);

      // Step 1: Initialize & validate configuration
      await new Promise((r) => setTimeout(r, 400));
      setState((prev) => ({
        ...prev,
        stage: 'validating',
        progress: 45,
        message: 'Validating environment & settings...',
      }));

      // Step 2: Check authentication & session state
      await new Promise((r) => setTimeout(r, 450));
      checkAuth();

      setState((prev) => ({
        ...prev,
        stage: 'authenticating',
        progress: 75,
        message: 'Checking authentication status...',
      }));

      // Step 3: Check first-time user status
      await new Promise((r) => setTimeout(r, 350));
      const hasCompletedOnboarding = StorageService.getItem<boolean>(
        STORAGE_KEYS.ONBOARDING_COMPLETED,
        false
      );

      // Determine target destination
      let targetRoute: string = ROUTES.HOME;
      if (!hasCompletedOnboarding) {
        targetRoute = ROUTES.ONBOARDING;
        logger.info('SplashInit', 'First-time user detected: routing to Onboarding');
      } else if (!isAuthenticated) {
        targetRoute = ROUTES.AUTH;
        logger.info('SplashInit', 'User not authenticated: routing to Login/Auth');
      } else {
        targetRoute = ROUTES.HOME;
        logger.info('SplashInit', 'Authenticated session restored: routing to Home');
      }

      setState((prev) => ({
        ...prev,
        stage: 'ready',
        progress: 100,
        message: 'Ready! Preparing your workspace...',
        destination: targetRoute,
      }));

      // Ensure minimum display duration for smooth brand animation
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, minDurationMs - elapsed);
      await new Promise((r) => setTimeout(r, remainingDelay));

      // Trigger exit transition
      setState((prev) => ({ ...prev, isExiting: true }));

      // Complete navigation after exit animation
      setTimeout(() => {
        navigate(targetRoute, { replace: true });
      }, 400);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to initialize application';
      logger.error('SplashInit', 'Initialization failed', err);
      setState((prev) => ({
        ...prev,
        stage: 'error',
        progress: 100,
        message: 'Initialization encountered an error.',
        error: errorMessage,
      }));
    }
  }, [checkAuth, isAuthenticated, minDurationMs, navigate]);

  useEffect(() => {
    runInitialization();
  }, [runInitialization]);

  const skipToDestination = useCallback(() => {
    const hasCompletedOnboarding = StorageService.getItem<boolean>(
      STORAGE_KEYS.ONBOARDING_COMPLETED,
      false
    );
    const dest = !hasCompletedOnboarding
      ? ROUTES.ONBOARDING
      : !isAuthenticated
      ? ROUTES.AUTH
      : ROUTES.HOME;

    setState((prev) => ({ ...prev, isExiting: true }));
    setTimeout(() => {
      navigate(dest, { replace: true });
    }, 200);
  }, [isAuthenticated, navigate]);

  return {
    ...state,
    retry: runInitialization,
    skip: skipToDestination,
  };
}
