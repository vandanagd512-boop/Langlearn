import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AppProviders } from './AppProviders';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  );
};
