import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard, Search, Clipboard, Heart, Settings,
  LogOut, CloudRain, Bell,
} from 'lucide-react';
import { logout } from '../features/auth/authSlice';

const NAV_LINKS = [
  { to: '/renter/dashboard', label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/browse',           label: 'Browse Gear', icon: Search          },
  { to: '/renter/rentals',   label: 'My Rentals',  icon: Clipboard       },
  { to: '/renter/wishlist',  label: 'Wishlist',    icon: Heart           },
  { to: '/profile',          label: 'Profile',     icon: Settings        },
];

function SidebarLink({ to, label, icon: Icon, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
          isActive
            ? 'bg-primary/10 text-primary dark:bg-primary/20'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
        }`
      }
    >
      <Icon size={18} />
      <span className="flex-1">{label}</span>
      {badge > 0 && (
        <span className="min-w-[20px] h-5 px-1.5 text-xs font-bold bg-primary text-white rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

export default function RenterLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { myRentals, wishlist } = useSelector((s) => s.rentals);

  const activeRentalCount = myRentals.filter((r) => r.status === 'active').length;
  const wishlistCount = wishlist.length;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100 dark:border-slate-700">
          <NavLink to="/renter/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <CloudRain size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-lg">RainShare</span>
          </NavLink>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Signed in as</p>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user?.name || user?.email}</p>
          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400 font-medium">
            Renter
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_LINKS.map(({ to, label, icon }) => {
            const badge =
              to === '/renter/rentals' ? activeRentalCount :
              to === '/renter/wishlist' ? wishlistCount : 0;
            return <SidebarLink key={to} to={to} label={label} icon={icon} badge={badge} />;
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-4 lg:px-8 py-4 flex items-center justify-between">
          {/* Mobile logo */}
          <NavLink to="/renter/dashboard" className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <CloudRain size={14} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100">RainShare</span>
          </NavLink>

          {/* Desktop breadcrumb placeholder */}
          <div className="hidden lg:block" />

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {activeRentalCount > 0 && (
              <NavLink
                to="/renter/rentals"
                className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
              </NavLink>
            )}
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              {(user?.name || user?.email || '?')[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex">
        {NAV_LINKS.map(({ to, label, icon: Icon }) => {
          const badge =
            to === '/renter/rentals' ? activeRentalCount :
            to === '/renter/wishlist' ? wishlistCount : 0;
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors relative ${
                  isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon size={20} className={isActive ? 'text-primary' : ''} />
                    {badge > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 text-[9px] font-bold bg-primary text-white rounded-full flex items-center justify-center">
                        {badge}
                      </span>
                    )}
                  </div>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
