import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { X, Search } from 'lucide-react';
import { fetchAllUsers, toggleUserActive } from '../../store/adminSlice';

const ROLE_STYLES = {
  admin: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  donor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  renter: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
};

export default function Users() {
  const dispatch = useDispatch();
  const { users, usersStatus } = useSelector((s) => s.admin);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => { dispatch(fetchAllUsers()); }, [dispatch]);

  const filtered = useMemo(() => {
    return (users || []).filter((u) => {
      const matchesSearch =
        !search ||
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleToggle = async (user) => {
    const res = await dispatch(toggleUserActive({ id: user.id, active: !user.active }));
    if (res.error) toast.error('Failed to update user status');
    else toast.success(`${user.name || user.email} is now ${!user.active ? 'active' : 'inactive'}`);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Users</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email…"
              className="pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40 w-56"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="donor">Donor</option>
            <option value="renter">Renter</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="text-left font-medium px-5 py-2.5">User</th>
                <th className="text-left font-medium px-5 py-2.5">Role</th>
                <th className="text-left font-medium px-5 py-2.5">Status</th>
                <th className="text-left font-medium px-5 py-2.5">Joined</th>
                <th className="text-right font-medium px-5 py-2.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {usersStatus === 'loading' && (
                <tr><td colSpan={5} className="px-5 py-6 text-center text-slate-400">Loading users…</td></tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-5 py-3">
                    <button onClick={() => setSelected(u)} className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {(u.name || u.email || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-100">{u.name || '—'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                      </div>
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${ROLE_STYLES[u.role] || 'bg-slate-100 text-slate-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                      {u.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                    {u.joined_at ? new Date(u.joined_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleToggle(u)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        u.active
                          ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400'
                      }`}
                    >
                      {u.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
              {usersStatus !== 'loading' && filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-6 text-center text-slate-400">No users match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over details panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-800 h-full shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">User Details</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <X size={18} />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                {(selected.name || selected.email || '?')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{selected.name || '—'}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selected.email}</p>
              </div>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Role</dt><dd className="font-medium capitalize text-slate-800 dark:text-slate-100">{selected.role}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Status</dt><dd className="font-medium text-slate-800 dark:text-slate-100">{selected.active ? 'Active' : 'Inactive'}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Joined</dt><dd className="font-medium text-slate-800 dark:text-slate-100">{selected.joined_at ? new Date(selected.joined_at).toLocaleDateString() : '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">City</dt><dd className="font-medium text-slate-800 dark:text-slate-100">{selected.city || '—'}</dd></div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
