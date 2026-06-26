import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { X, ChevronRight, ChevronLeft, ImageIcon, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { fetchGears } from '../../store/gearSlice';

// ── Zod schemas ──────────────────────────────────────────────────────────────

const step1Schema = z.object({
  title:       z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category_id: z.string().min(1, 'Please select a category'),
  condition:   z.enum(['new', 'good', 'fair', 'worn'], { required_error: 'Please select a condition' }),
});

const step2Schema = z.object({
  rent_price: z.coerce.number().min(0, 'Price cannot be negative'),
  image_url:  z.string().url('Must be a valid URL').or(z.literal('')),
  status:     z.enum(['available', 'rented', 'unavailable']),
});

// ── Field component ──────────────────────────────────────────────────────────

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
        {label}
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

function Select({ error, children, ...props }) {
  return (
    <select
      {...props}
      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30
        ${error ? 'border-red-400' : 'border-slate-200 dark:border-slate-700 focus:border-primary'}`}
    >
      {children}
    </select>
  );
}

// ── Main modal ───────────────────────────────────────────────────────────────

export default function AddEditGearModal({ open, onClose, editGear = null }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: '', description: '', category_id: '', condition: '',
    rent_price: '', image_url: '', status: 'available',
  });

  // Pre-fill when editing
  useEffect(() => {
    if (editGear) {
      setForm({
        title:       editGear.title       || '',
        description: editGear.description || '',
        category_id: String(editGear.category_id || ''),
        condition:   editGear.condition   || '',
        rent_price:  editGear.rent_price  ?? '',
        image_url:   editGear.image_url   || '',
        status:      editGear.status      || 'available',
      });
    } else {
      setForm({ title: '', description: '', category_id: '', condition: '', rent_price: '', image_url: '', status: 'available' });
    }
    setStep(1);
    setErrors({});
  }, [editGear, open]);

  // Load categories once
  useEffect(() => {
    if (!open) return;
    api.get('/categories').then((r) => setCategories(r.data)).catch(() => {});
  }, [open]);

  if (!open) return null;

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  function validateStep(n) {
    const schema = n === 1 ? step1Schema : step2Schema;
    const fields = n === 1
      ? { title: form.title, description: form.description, category_id: form.category_id, condition: form.condition }
      : { rent_price: form.rent_price === '' ? '' : Number(form.rent_price), image_url: form.image_url, status: form.status };

    const result = schema.safeParse(fields);
    if (!result.success) {
      const errs = {};
      result.error.issues.forEach((i) => { errs[i.path[0]] = i.message; });
      setErrors(errs);
      return false;
    }
    setErrors({});
    return true;
  }

  function handleNext() {
    if (validateStep(1)) setStep(2);
  }

  async function handleSubmit() {
    if (!validateStep(2)) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        category_id: Number(form.category_id),
        rent_price:  Number(form.rent_price),
        owner_id:    user.id,
      };
      if (editGear) {
        await api.patch(`/rain_gear/${editGear.id}`, payload);
        toast.success('Gear updated!');
      } else {
        await api.post('/rain_gear', { ...payload, created_at: new Date().toISOString() });
        toast.success('Gear added!');
      }
      dispatch(fetchGears({ owner_id: user.id, limit: 100 }));
      onClose();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-modal overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="font-bold text-slate-800 dark:text-slate-100">
              {editGear ? 'Edit Gear' : 'Add New Gear'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Step {step} of 2</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {step === 1 ? (
            <>
              <Field label="Title" error={errors.title}>
                <Input value={form.title} onChange={set('title')} placeholder="e.g. North Face Rain Jacket" error={errors.title} />
              </Field>

              <Field label="Description" error={errors.description}>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  rows={3}
                  placeholder="Describe the item, size, fit notes…"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30
                    ${errors.description ? 'border-red-400' : 'border-slate-200 dark:border-slate-700 focus:border-primary'}`}
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Category" error={errors.category_id}>
                  <Select value={form.category_id} onChange={set('category_id')} error={errors.category_id}>
                    <option value="">Select…</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Select>
                </Field>

                <Field label="Condition" error={errors.condition}>
                  <Select value={form.condition} onChange={set('condition')} error={errors.condition}>
                    <option value="">Select…</option>
                    <option value="new">New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="worn">Worn</option>
                  </Select>
                </Field>
              </div>
            </>
          ) : (
            <>
              <Field label="Rent Price (£/day) — set 0 for free donation" error={errors.rent_price}>
                <Input
                  type="number" min="0" step="0.01"
                  value={form.rent_price}
                  onChange={set('rent_price')}
                  placeholder="0.00"
                  error={errors.rent_price}
                />
                {Number(form.rent_price) === 0 && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">✓ This will be listed as a free donation</p>
                )}
              </Field>

              <Field label="Image URL" error={errors.image_url}>
                <Input
                  value={form.image_url}
                  onChange={set('image_url')}
                  placeholder="https://example.com/image.jpg"
                  error={errors.image_url}
                />
              </Field>

              {/* Live image preview */}
              <div className="w-full h-40 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-slate-800">
                {form.image_url ? (
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="text-center text-slate-400">
                    <ImageIcon size={28} className="mx-auto mb-1" />
                    <p className="text-xs">Image preview will appear here</p>
                  </div>
                )}
              </div>

              <Field label="Status" error={errors.status}>
                <Select value={form.status} onChange={set('status')}>
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="unavailable">Unavailable</option>
                </Select>
              </Field>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <ChevronLeft size={16} /> Back
            </button>
          ) : <div />}

          {step === 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors"
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              {editGear ? 'Save Changes' : 'Add Gear'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
