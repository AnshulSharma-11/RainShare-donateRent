import { useAuth } from './useAuth';

export function useRole() {
  const { role } = useAuth();
  return {
    role,
    isDonor: role === 'donor',
    isRenter: role === 'renter',
    isAdmin: role === 'admin',
  };
}
