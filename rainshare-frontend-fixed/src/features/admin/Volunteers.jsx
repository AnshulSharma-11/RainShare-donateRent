import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { MapPin } from 'lucide-react';
import { fetchAllVolunteers, updateVolunteerStatus } from '../../store/adminSlice';

export default function Volunteers() {
  const dispatch = useDispatch();
  const { volunteers, volunteersStatus } = useSelector((s) => s.admin);
  const [cityFilter, setCityFilter] = useState('all');

  useEffect(() => { dispatch(fetchAllVolunteers()); }, [dispatch]);

  const cities = useMemo(
    () => Array.from(new Set((volunteers || []).map((v) => v.city).filter(Boolean))),
    [volunteers]
  );

  const filtered = useMemo(
    () => (volunteers || []).filter((v) => cityFilter === 'all' || v.city === cityFilter),
    [volunteers, cityFilter]
  );

  const handleToggleStatus = async (v) => {
    const next = v.status === 'active' ? 'inactive' : 'active';
    const res = await dispatch(updateVolunteerStatus({ id: v.id, status: next }));
    if (res.error) toast.error('Failed to update volunteer status');
    else toast.success(`${v.name} is now ${next}`);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Volunteers</h1>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="all">All cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {volunteersStatus === 'loading' && (
        <p className="text-sm text-slate-400 text-center py-10">Loading volunteers…</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((v) => (
          <div key={v.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{v.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin size={12} /> {v.city}
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                v.status === 'active'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
              }`}>
                {v.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 my-3">
              {(v.availability || []).map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => handleToggleStatus(v)}
              className={`w-full text-xs font-medium px-3 py-2 rounded-lg transition-colors ${
                v.status === 'active'
                  ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400'
              }`}
            >
              {v.status === 'active' ? 'Mark Inactive' : 'Mark Active'}
            </button>
          </div>
        ))}
        {volunteersStatus !== 'loading' && filtered.length === 0 && (
          <p className="col-span-full text-center text-slate-400 py-10">No volunteers match this filter.</p>
        )}
      </div>
    </div>
  );
}
