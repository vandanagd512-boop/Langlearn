import { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/services/logging/logger.service';
import { Button } from '../ui/Button';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary', 'Uncaught component exception', {
      error: error.message,
      stack: errorInfo.componentStack,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-card text-center space-y-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Something went wrong
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                An unexpected error occurred. Our system logged the issue and we are on it.
              </p>
              {this.state.error && (
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-left font-mono text-xs text-rose-600 dark:text-rose-400 overflow-x-auto">
                  {this.state.error.message}
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <Button variant="outline" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button variant="primary" leftIcon={<RotateCcw className="w-4 h-4" />} onClick={this.handleReload}>
                Reload Application
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
