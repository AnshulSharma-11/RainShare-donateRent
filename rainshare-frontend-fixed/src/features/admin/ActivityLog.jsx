import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivityLog } from '../../store/adminSlice';

export default function ActivityLog() {
  const dispatch = useDispatch();
  const { activityLog, activityLogStatus } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(fetchActivityLog()); }, [dispatch]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Activity Log</h1>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="text-left font-medium px-5 py-2.5">Timestamp</th>
                <th className="text-left font-medium px-5 py-2.5">Admin</th>
                <th className="text-left font-medium px-5 py-2.5">Action</th>
                <th className="text-left font-medium px-5 py-2.5">Target Entity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {activityLogStatus === 'loading' && (
                <tr><td colSpan={4} className="px-5 py-6 text-center text-slate-400">Loading activity log…</td></tr>
              )}
              {(activityLog || []).map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                    {new Date(row.timestamp).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-slate-700 dark:text-slate-200">{row.admin}</td>
                  <td className="px-5 py-3 text-slate-700 dark:text-slate-200">{row.action}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{row.target}</td>
                </tr>
              ))}
              {activityLogStatus !== 'loading' && (!activityLog || activityLog.length === 0) && (
                <tr><td colSpan={4} className="px-5 py-6 text-center text-slate-400">No activity recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
