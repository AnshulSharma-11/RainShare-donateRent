import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard, Users, Tag, Backpack, Gift, Clipboard,
  HeartHandshake, ScrollText, LogOut, CloudRain, Menu, X,
} from 'lucide-react';
import { logout } from '../features/auth/authSlice';

const NAV_LINKS = [
  { to: '/admin/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/admin/users',       label: 'Users',        icon: Users           },
  { to: '/admin/categories',  label: 'Categories',   icon: Tag             },
  { to: '/admin/gear',        label: 'Gear',         icon: Backpack        },
  { to: '/admin/donations',   label: 'Donations',    icon: Gift            },
  { to: '/admin/rentals',     label: 'Rentals',      icon: Clipboard       },
  { to: '/admin/volunteers',  label: 'Volunteers',   icon: HeartHandshake  },
  { to: '/admin/activity-log',label: 'Activity Log', icon: ScrollText      },
];

function TopLink({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
          isActive
            ? 'bg-primary/10 text-primary dark:bg-primary/20'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
        }`
      }
    >
      <Icon size={16} />
      <span>{label}</span>
    </NavLink>
  );
}

function MobileLink({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
          isActive
            ? 'bg-primary/10 text-primary dark:bg-primary/20'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
}

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* ── Topbar ── */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 sticky top-0 z-40">
        {/* Row 1: brand + user + mobile toggle */}
        <div className="px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
          <NavLink to="/admin/dashboard" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <CloudRain size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-lg hidden sm:inline">
              RainShare <span className="text-primary">Admin</span>
            </span>
          </NavLink>

          {/* Desktop nav, scrollable if it overflows */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {NAV_LINKS.map((link) => <TopLink key={link.to} {...link} />)}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {(user?.name || user?.email || '?')[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                {user?.name || user?.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Row 2: mobile dropdown nav */}
        {mobileOpen && (
          <nav className="lg:hidden border-t border-slate-100 dark:border-slate-700 px-3 py-3 grid grid-cols-2 gap-1 max-h-[70vh] overflow-y-auto">
            {NAV_LINKS.map((link) => (
              <MobileLink key={link.to} {...link} onClick={() => setMobileOpen(false)} />
            ))}
          </nav>
        )}
      </header>

      {/* ── Page content ── */}
      <main className="flex-1 p-4 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
