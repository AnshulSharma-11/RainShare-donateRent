import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CloudRain, Moon, Sun, ChevronDown, LogOut, User, LayoutDashboard,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../store/uiSlice';
import { logout } from '../features/auth/authSlice';
import { getInitials } from '../utils/helpers';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role } = useSelector((s) => s.auth);
  const { darkMode }   = useSelector((s) => s.ui);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dashboardPath =
    role === 'admin'  ? '/admin/dashboard'  :
    role === 'donor'  ? '/donor/dashboard'  :
    role === 'renter' ? '/renter/dashboard' : '/';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl flex-shrink-0">
          <CloudRain size={24} />
          <span>RainShare</span>
        </Link>

        {/* Center nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/browse" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary-light transition-colors">
            Browse Gear
          </Link>
          <Link to="/volunteer/register" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary-light transition-colors">
            Volunteer
          </Link>
        </nav>

        {/* Right: dark mode + user */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  {getInitials(user.full_name)}
                </div>
                <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {user.full_name.split(' ')[0]}
                </span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-modal border border-slate-100 dark:border-slate-700 py-2 animate-slide-up">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user.full_name}</p>
                    <p className="text-xs text-slate-400 capitalize">{role}</p>
                  </div>
                  <Link to={dashboardPath} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <User size={15} /> Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <LogOut size={15} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                Log in
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
