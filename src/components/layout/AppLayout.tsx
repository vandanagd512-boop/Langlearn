import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../feedback/Toast';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-slate-900/10 dark:bg-black/90 flex justify-center text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
      {/* 100% Mobile App Shell */}
      <div className="w-full max-w-md min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative shadow-2xl border-x border-slate-200/80 dark:border-slate-800">
        {/* Sticky Mobile App Bar */}
        <Header />

        {/* Scrollable Mobile Page Body with safe area padding */}
        <main className="flex-1 p-4 pb-24 w-full animate-fadeIn overflow-x-hidden">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation Bar (Docked to bottom of mobile shell) */}
        <MobileNav />

        {/* Global Notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};
