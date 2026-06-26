import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, CloudRain } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginUser, clearError } from './authSlice';
import { loginSchema } from '../../utils/validators';
import Input from '../../components/Input';
import Button from '../../components/Button';

const ROLE_COLORS = { admin: 'bg-purple-50 border-purple-200 text-purple-700', donor: 'bg-teal-50 border-teal-200 text-teal-700', renter: 'bg-sky-50 border-sky-200 text-sky-700' };
const DEMO_CREDS = [
  { role: 'admin', email: 'admin@rain.com', password: 'admin123' },
  { role: 'donor', email: 'donor1@rain.com', password: 'donor123' },
  { role: 'renter', email: 'renter1@rain.com', password: 'renter123' },
];

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error, role } = useSelector((s) => s.auth);
  const from = location.state?.from?.pathname;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Show error toast
  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  // Redirect after login
  useEffect(() => {
    if (status === 'succeeded' && role) {
      const dest = from || (role === 'admin' ? '/admin/dashboard' : role === 'donor' ? '/donor/dashboard' : '/renter/dashboard');
      navigate(dest, { replace: true });
    }
  }, [status, role, navigate, from]);

  const onSubmit = (data) => dispatch(loginUser(data));

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary items-center justify-center p-12">
        <div className="text-white text-center max-w-sm">
          <CloudRain size={56} className="mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl font-bold mb-4">Welcome back</h1>
          <p className="text-white/80 text-lg">Your community of rain gear sharing awaits.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 text-primary font-bold text-2xl mb-8 lg:hidden">
            <CloudRain size={28} />
            <span>RainShare</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Log in to your account</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link></p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type="submit" size="lg" className="w-full" loading={status === 'loading'}>
              Log in
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3 text-center">Quick login — demo accounts</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_CREDS.map(({ role, email, password }) => (
                <button
                  key={role}
                  onClick={() => { setValue('email', email); setValue('password', password); }}
                  className={`text-xs font-medium border rounded-xl px-3 py-2 capitalize transition-all hover:scale-105 ${ROLE_COLORS[role]}`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
