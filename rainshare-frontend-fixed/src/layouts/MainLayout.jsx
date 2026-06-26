import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  const { pathname } = useLocation();
  const isLanding    = pathname === '/';

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Simple footer shown on non-landing public pages */}
      {!isLanding && (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} RainShare — Share the Rain, Spread the Warmth.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
