import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Plus, Trash2, Check, X, Pencil } from 'lucide-react';
import {
  fetchCategories, createCategory, updateCategory, deleteCategory,
} from '../../store/gearSlice';

export default function Categories() {
  const dispatch = useDispatch();
  const { categories, categoriesStatus } = useSelector((s) => s.gear) || {};
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ name: '', description: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', description: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditDraft({ name: cat.name, description: cat.description || '' });
  };

  const saveEdit = async () => {
    const res = await dispatch(updateCategory({ id: editingId, ...editDraft }));
    if (res.error) toast.error('Failed to update category');
    else { toast.success('Category updated'); setEditingId(null); }
  };

  const handleAdd = async () => {
    if (!newCat.name.trim()) return toast.error('Name is required');
    const res = await dispatch(createCategory(newCat));
    if (res.error) toast.error('Failed to add category');
    else { toast.success('Category added'); setShowAdd(false); setNewCat({ name: '', description: '' }); }
  };

  const handleDelete = async (id) => {
    const res = await dispatch(deleteCategory(id));
    if (res.error) toast.error('Failed to delete category');
    else toast.success('Category deleted');
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Categories</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="text-left font-medium px-5 py-2.5">Name</th>
              <th className="text-left font-medium px-5 py-2.5">Description</th>
              <th className="text-right font-medium px-5 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {categoriesStatus === 'loading' && (
              <tr><td colSpan={3} className="px-5 py-6 text-center text-slate-400">Loading categories…</td></tr>
            )}
            {(categories || []).map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                {editingId === cat.id ? (
                  <>
                    <td className="px-5 py-2.5">
                      <input
                        value={editDraft.name}
                        onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                        className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-100 text-sm"
                      />
                    </td>
                    <td className="px-5 py-2.5">
                      <input
                        value={editDraft.description}
                        onChange={(e) => setEditDraft((d) => ({ ...d, description: e.target.value }))}
                        className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-100 text-sm"
                      />
                    </td>
                    <td className="px-5 py-2.5 text-right space-x-1">
                      <button onClick={saveEdit} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"><Check size={16} /></button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><X size={16} /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">{cat.name}</td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{cat.description || '—'}</td>
                    <td className="px-5 py-3 text-right space-x-1">
                      <button onClick={() => startEdit(cat)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"><Pencil size={16} /></button>
                      <button onClick={() => setConfirmDelete(cat)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={16} /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {categoriesStatus !== 'loading' && (!categories || categories.length === 0) && (
              <tr><td colSpan={3} className="px-5 py-6 text-center text-slate-400">No categories yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Add Category</h2>
            <input
              value={newCat.name}
              onChange={(e) => setNewCat((d) => ({ ...d, name: e.target.value }))}
              placeholder="Name"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <textarea
              value={newCat.description}
              onChange={(e) => setNewCat((d) => ({ ...d, description: e.target.value }))}
              placeholder="Description"
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:opacity-90">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Delete Category</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete "{confirmDelete.name}"? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete.id)} className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:opacity-90">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
