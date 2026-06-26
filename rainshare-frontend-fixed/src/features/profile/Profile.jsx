import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { User, Mail, Phone, MapPin, Lock, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { setUser } from '../../features/auth/authSlice';
import { getInitials } from '../../utils/helpers';

// ── Schemas ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email:     z.string().email('Invalid email address'),
  phone:     z.string().optional(),
  address:   z.string().optional(),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password:     z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: "Passwords don't match",
  path:    ['confirm_password'],
});

// ── Field helpers ─────────────────────────────────────────────────────────────

function Field({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
        {Icon && <Icon size={12} />} {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function Input({ error, ...props }) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30
        ${error ? 'border-red-400 focus:border-red-400' : 'border-slate-200 dark:border-slate-700 focus:border-primary'}`}
    />
  );
}

function PasswordInput({ error, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        {...props}
        type={show ? 'text' : 'password'}
        className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30
          ${error ? 'border-red-400' : 'border-slate-200 dark:border-slate-700 focus:border-primary'}`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Profile() {
  const dispatch = useDispatch();
  const { user, role } = useSelector((s) => s.auth);

  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    email:     user?.email     || '',
    phone:     user?.phone     || '',
    address:   user?.address   || '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwForm, setPwForm] = useState({
    current_password: '',
    new_password:     '',
    confirm_password: '',
  });
  const [pwErrors, setPwErrors] = useState({});
  const [savingPw, setSavingPw]   = useState(false);

  const setP = (field) => (e) => setProfileForm((f) => ({ ...f, [field]: e.target.value }));
  const setPw = (field) => (e) => setPwForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSaveProfile(e) {
    e.preventDefault();
    const result = profileSchema.safeParse(profileForm);
    if (!result.success) {
      const errs = {};
      result.error.issues.forEach((i) => { errs[i.path[0]] = i.message; });
      setProfileErrors(errs);
      return;
    }
    setProfileErrors({});
    setSavingProfile(true);
    try {
      const res = await api.patch(`/users/${user.id}`, profileForm);
      dispatch(setUser(res.data));
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to save profile.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    const result = passwordSchema.safeParse(pwForm);
    if (!result.success) {
      const errs = {};
      result.error.issues.forEach((i) => { errs[i.path[0]] = i.message; });
      setPwErrors(errs);
      return;
    }
    setPwErrors({});
    setSavingPw(true);
    try {
      await api.patch(`/users/${user.id}`, { password: pwForm.new_password });
      toast.success('Password changed!');
      setPwForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch {
      toast.error('Failed to change password. Check your current password.');
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-8">
      {/* Avatar header */}
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-primary text-white text-xl font-bold flex items-center justify-center shadow-card">
          {getInitials(user?.full_name)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{user?.full_name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{role} account</p>
        </div>
      </div>

      {/* Profile details */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">Personal Information</h2>
          <p className="text-xs text-slate-400 mt-0.5">Update your name, email, and contact details.</p>
        </div>

        <form onSubmit={handleSaveProfile} className="px-6 py-6 space-y-5">
          <Field label="Full Name" icon={User} error={profileErrors.full_name}>
            <Input
              value={profileForm.full_name}
              onChange={setP('full_name')}
              placeholder="Jane Smith"
              error={profileErrors.full_name}
            />
          </Field>

          <Field label="Email" icon={Mail} error={profileErrors.email}>
            <Input
              type="email"
              value={profileForm.email}
              onChange={setP('email')}
              placeholder="jane@example.com"
              error={profileErrors.email}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Phone" icon={Phone} error={profileErrors.phone}>
              <Input
                type="tel"
                value={profileForm.phone}
                onChange={setP('phone')}
                placeholder="+44 7700 900000"
                error={profileErrors.phone}
              />
            </Field>

            <Field label="Address" icon={MapPin} error={profileErrors.address}>
              <Input
                value={profileForm.address}
                onChange={setP('address')}
                placeholder="123 Main St, London"
                error={profileErrors.address}
              />
            </Field>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors disabled:opacity-60"
            >
              {savingProfile ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">Change Password</h2>
          <p className="text-xs text-slate-400 mt-0.5">Use a strong password you don't use elsewhere.</p>
        </div>

        <form onSubmit={handleChangePassword} className="px-6 py-6 space-y-5">
          <Field label="Current Password" icon={Lock} error={pwErrors.current_password}>
            <PasswordInput
              value={pwForm.current_password}
              onChange={setPw('current_password')}
              placeholder="Your current password"
              error={pwErrors.current_password}
            />
            {pwErrors.current_password && <p className="text-xs text-red-500 mt-1">{pwErrors.current_password}</p>}
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="New Password" error={pwErrors.new_password}>
              <PasswordInput
                value={pwForm.new_password}
                onChange={setPw('new_password')}
                placeholder="Min 8 characters"
                error={pwErrors.new_password}
              />
              {pwErrors.new_password && <p className="text-xs text-red-500 mt-1">{pwErrors.new_password}</p>}
            </Field>

            <Field label="Confirm Password" error={pwErrors.confirm_password}>
              <PasswordInput
                value={pwForm.confirm_password}
                onChange={setPw('confirm_password')}
                placeholder="Repeat new password"
                error={pwErrors.confirm_password}
              />
              {pwErrors.confirm_password && <p className="text-xs text-red-500 mt-1">{pwErrors.confirm_password}</p>}
            </Field>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingPw}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-500 rounded-xl transition-colors disabled:opacity-60"
            >
              {savingPw ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
