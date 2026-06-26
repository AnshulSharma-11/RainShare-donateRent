import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, role, status, initialized } = useSelector((s) => s.auth);
  return {
    user,
    token,
    role,
    status,
    initialized,
    isAuthenticated: !!token,
    handleLogout: () => dispatch(logout()),
  };
}
