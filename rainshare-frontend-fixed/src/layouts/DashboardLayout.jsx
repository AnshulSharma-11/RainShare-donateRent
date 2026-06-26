import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function DashboardLayout({ sidebarLinks = [] }) {
  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark flex flex-col">
      <Navbar />

      {/* ── Dashboard top tab bar ──────────────────────────────────────────── */}
      {sidebarLinks.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
              {sidebarLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0
                    ${isActive
                      ? 'bg-primary-light text-primary dark:bg-primary/20 dark:text-primary'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {Icon && <Icon size={16} />}
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* ── Page content ──────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
