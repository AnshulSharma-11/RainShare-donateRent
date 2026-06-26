import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Heart, MapPin, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Button from '../../components/Button';

const AVAILABILITY_OPTIONS = [
  { value: 'weekdays', label: 'Weekdays',  icon: '🗓️' },
  { value: 'weekends', label: 'Weekends',  icon: '🌤️' },
  { value: 'evenings', label: 'Evenings',  icon: '🌙' },
];

export default function VolunteerRegister() {
  const navigate     = useNavigate();
  const { user }     = useSelector(s => s.auth);
  const [form, setForm] = useState({ city: '', availability: [], motivation: '' });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const toggleAvailability = (val) => {
    setForm(f => ({
      ...f,
      availability: f.availability.includes(val)
        ? f.availability.filter(v => v !== val)
        : [...f.availability, val],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.city.trim())              e.city = 'City is required.';
    if (form.availability.length === 0) e.availability = 'Select at least one availability slot.';
    if (!form.motivation.trim())        e.motivation = 'Please tell us your motivation.';
    else if (form.motivation.trim().length < 20) e.motivation = 'Please write at least 20 characters.';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      await api.post('/volunteers', {
        user_id:      user?.id || null,
        city:         form.city.trim(),
        availability: form.availability,
        motivation:   form.motivation.trim(),
        status:       'pending',
      });
      toast.success('Thank you for signing up as a volunteer! 🎉');
      navigate(user ? '/profile' : '/');
    } catch {
      toast.error('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark py-16 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-3xl bg-accent-light text-accent flex items-center justify-center mx-auto mb-5 shadow-md">
            <Heart size={36} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-3">
            Become a Volunteer
          </h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Help us coordinate gear distribution in your city. Your time can keep someone warm and dry.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-card p-8 space-y-6">

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              <MapPin size={15} className="inline mr-1.5 text-primary" />
              Your City
            </label>
            <input
              type="text"
              placeholder="e.g. Mumbai, Pune, Nashik…"
              value={form.city}
              onChange={e => { setForm(f => ({ ...f, city: e.target.value })); setErrors(ex => ({ ...ex, city: '' })); }}
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40
                bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100
                ${errors.city ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`}
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
              <Clock size={15} className="inline mr-1.5 text-primary" />
              When are you available?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {AVAILABILITY_OPTIONS.map(opt => {
                const selected = form.availability.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { toggleAvailability(opt.value); setErrors(ex => ({ ...ex, availability: '' })); }}
                    className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border-2 text-sm font-medium transition-all ${
                      selected
                        ? 'border-primary bg-primary-light dark:bg-primary/10 text-primary'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-primary/40'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    {opt.label}
                    {selected && <CheckCircle size={14} className="text-primary" />}
                  </button>
                );
              })}
            </div>
            {errors.availability && <p className="text-red-500 text-xs mt-2">{errors.availability}</p>}
          </div>

          {/* Motivation */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Why do you want to volunteer?
            </label>
            <textarea
              rows={4}
              placeholder="Tell us what motivates you to help the community…"
              value={form.motivation}
              onChange={e => { setForm(f => ({ ...f, motivation: e.target.value })); setErrors(ex => ({ ...ex, motivation: '' })); }}
              className={`w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40
                bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100
                ${errors.motivation ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.motivation
                ? <p className="text-red-500 text-xs">{errors.motivation}</p>
                : <span />}
              <span className="text-xs text-slate-400">{form.motivation.length} chars</span>
            </div>
          </div>

          {/* Submit */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting…' : 'Register as Volunteer'}
          </Button>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Already a volunteer? Your profile will be updated. Our team will reach out with next steps.
        </p>
      </div>
    </div>
  );
}
