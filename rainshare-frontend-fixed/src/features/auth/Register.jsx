import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, User, Phone, CloudRain, Heart, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerUser, clearError } from './authSlice';
import { registerSchema } from '../../utils/validators';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, role } = useSelector((s) => s.auth);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'renter' },
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  useEffect(() => {
    if (status === 'succeeded' && role) {
      const dest = role === 'donor' ? '/donor/dashboard' : '/renter/dashboard';
      navigate(dest, { replace: true });
      toast.success('Welcome to RainShare! 🌧️');
    }
  }, [status, role, navigate]);

  const onSubmit = (data) => dispatch(registerUser(data));

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 text-primary font-bold text-2xl mb-8">
          <CloudRain size={28} />
          <span>RainShare</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Create your account</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>

        {/* Role selector */}
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">I want to…</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'donor', label: 'Donate / Lend Gear', icon: Heart, desc: 'Share gear with your community' },
              { value: 'renter', label: 'Rent Gear', icon: ShoppingBag, desc: 'Borrow gear when you need it' },
            ].map(({ value, label, icon: Icon, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue('role', value)}
                className={`
                  flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all
                  ${selectedRole === value
                    ? 'border-primary bg-primary-light text-primary dark:bg-primary/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'}
                `}
              >
                <Icon size={24} className="mb-2" />
                <span className="text-sm font-semibold">{label}</span>
                <span className="text-xs mt-1 opacity-70">{desc}</span>
              </button>
            ))}
          </div>
          {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full name" icon={User} placeholder="Priya Sharma" error={errors.full_name?.message} {...register('full_name')} />
          <Input label="Email address" type="email" icon={Mail} placeholder="priya@example.com" error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" icon={Lock} placeholder="Min. 6 characters" error={errors.password?.message} {...register('password')} />
          <Input label="Phone number" icon={Phone} placeholder="9000000000" error={errors.phone?.message} {...register('phone')} />
          <Button type="submit" size="lg" className="w-full mt-2" loading={status === 'loading'}>
            Create Account
          </Button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-6">
          By signing up you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
