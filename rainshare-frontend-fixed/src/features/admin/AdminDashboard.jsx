import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Users, Backpack, Clipboard, Gift } from 'lucide-react';
import { fetchAllUsers, fetchActivityLog } from '../../store/adminSlice';
import { fetchGearList } from '../../store/gearSlice';
import { fetchAllDonations } from '../../store/donationSlice';
import { fetchAllRentals } from '../../store/rentalSlice';

const COLORS = ['#0ea5e9', '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
      </div>
    </div>
  );
}

const lastNMonths = (n) => {
  const out = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString('default', { month: 'short' }) });
  }
  return out;
};

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { users, activityLog } = useSelector((s) => s.admin);
  const { items: gear } = useSelector((s) => s.gear);
  const { donations } = useSelector((s) => s.donations);
  const { rentals } = useSelector((s) => s.rentals);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchActivityLog());
    dispatch(fetchGearList());
    dispatch(fetchAllDonations());
    dispatch(fetchAllRentals());
  }, [dispatch]);

  const months = useMemo(() => lastNMonths(6), []);

  const monthlyData = useMemo(() => {
    const buckets = Object.fromEntries(months.map((m) => [m.key, { month: m.label, rentals: 0, donations: 0 }]));
    (rentals || []).forEach((r) => {
      const d = new Date(r.created_at || r.start_date || Date.now());
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (buckets[key]) buckets[key].rentals += 1;
    });
    (donations || []).forEach((d0) => {
      const d = new Date(d0.created_at || d0.date || Date.now());
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (buckets[key]) buckets[key].donations += 1;
    });
    return months.map((m) => buckets[m.key]);
  }, [months, rentals, donations]);

  const gearByCategory = useMemo(() => {
    const counts = {};
    (gear || []).forEach((g) => {
      const cat = g.category_name || g.category || 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [gear]);

  const signupsOverTime = useMemo(() => {
    const buckets = Object.fromEntries(months.map((m) => [m.key, { month: m.label, signups: 0 }]));
    (users || []).forEach((u) => {
      const d = new Date(u.created_at || u.joined_at || Date.now());
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (buckets[key]) buckets[key].signups += 1;
    });
    return months.map((m) => buckets[m.key]);
  }, [months, users]);

  const activeRentalCount = (rentals || []).filter((r) => r.status === 'active').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Overview of RainShare activity</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={(users || []).length} icon={Users} accent="bg-sky-500" />
        <StatCard label="Total Gear" value={(gear || []).length} icon={Backpack} accent="bg-indigo-500" />
        <StatCard label="Active Rentals" value={activeRentalCount} icon={Clipboard} accent="bg-amber-500" />
        <StatCard label="Total Donations" value={(donations || []).length} icon={Gift} accent="bg-emerald-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Rentals vs Donations (last 6 months)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="rentals" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Rentals" />
              <Bar dataKey="donations" fill="#10b981" radius={[4, 4, 0, 0]} name="Donations" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Gear by Category</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={gearByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {gearByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">New User Signups Over Time</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={signupsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="signups" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          Recent Activity
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="text-left font-medium px-5 py-2.5">Timestamp</th>
                <th className="text-left font-medium px-5 py-2.5">Admin</th>
                <th className="text-left font-medium px-5 py-2.5">Action</th>
                <th className="text-left font-medium px-5 py-2.5">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {(activityLog || []).slice(0, 10).map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-5 py-2.5 text-slate-500 dark:text-slate-400">
                    {new Date(row.timestamp).toLocaleString()}
                  </td>
                  <td className="px-5 py-2.5 text-slate-700 dark:text-slate-200">{row.admin}</td>
                  <td className="px-5 py-2.5 text-slate-700 dark:text-slate-200">{row.action}</td>
                  <td className="px-5 py-2.5 text-slate-500 dark:text-slate-400">{row.target}</td>
                </tr>
              ))}
              {(!activityLog || activityLog.length === 0) && (
                <tr><td colSpan={4} className="px-5 py-6 text-center text-slate-400">No activity yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
