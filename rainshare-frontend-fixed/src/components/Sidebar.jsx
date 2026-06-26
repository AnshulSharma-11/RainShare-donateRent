import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CloudRain, LogOut, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export default function Sidebar({ links = [], isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900
        border-r border-slate-100 dark:border-slate-800
        z-40 flex flex-col transition-transform duration-300 ease-in-out
        lg:sticky lg:translate-x-0 lg:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <CloudRain size={22} />
            <span>RainShare</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 lg:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end
                  onClick={() => window.innerWidth < 1024 && onClose?.()}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-colors duration-150
                    ${isActive
                      ? 'bg-primary-light text-primary dark:bg-primary/20 dark:text-primary'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}
                  `}
                >
                  {Icon && <Icon size={18} />}
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={18} /> Log out
          </button>
        </div>
      </aside>
    </>
  );
}
