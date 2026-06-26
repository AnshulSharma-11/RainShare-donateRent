import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, role, initialized } = useAuth();
  const location = useLocation();

  // Show spinner while auth state is being hydrated from localStorage
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // Redirect to their own dashboard
    const dashMap = { admin: '/admin/dashboard', donor: '/donor/dashboard', renter: '/renter/dashboard' };
    return <Navigate to={dashMap[role] || '/'} replace />;
  }

  return children;
}
