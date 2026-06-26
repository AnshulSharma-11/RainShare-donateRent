import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, ImageOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchGears } from '../../store/gearSlice';
import AddEditGearModal from './AddEditGearModal';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import api from '../../api/axios';

const CONDITION_LABELS = { new: 'New', good: 'Good', fair: 'Fair', worn: 'Worn' };

export default function MyGear() {
  const dispatch = useDispatch();
  const { user }  = useSelector((s) => s.auth);
  const { items, status } = useSelector((s) => s.gear);

  const [modalOpen,   setModalOpen]   = useState(false);
  const [editTarget,  setEditTarget]  = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toggling,    setToggling]    = useState(null); // gear id being toggled

  useEffect(() => {
    if (user?.id) dispatch(fetchGears({ owner_id: user.id, limit: 100 }));
  }, [dispatch, user]);

  const handleEdit = (gear) => {
    setEditTarget(gear);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/rain_gear/${deleteTarget.id}`);
      toast.success('Gear removed');
      dispatch(fetchGears({ owner_id: user.id, limit: 100 }));
    } catch {
      toast.error('Failed to delete gear');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleToggleStatus = async (gear) => {
    const newStatus = gear.status === 'available' ? 'unavailable' : 'available';
    setToggling(gear.id);
    try {
      await api.patch(`/rain_gear/${gear.id}`, { status: newStatus });
      toast.success(`Marked as ${newStatus}`);
      dispatch(fetchGears({ owner_id: user.id, limit: 100 }));
    } catch {
      toast.error('Failed to update status');
    } finally {
      setToggling(null);
    }
  };

  const loading = status === 'loading';

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">My Gear</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {items.length} item{items.length !== 1 ? 's' : ''} listed
            </p>
          </div>
          <button
            onClick={() => { setEditTarget(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
          >
            <Plus size={16} /> Add Gear
          </button>
        </div>

        {/* Table card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden">
          {loading ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-40" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-28" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-slate-400">No gear listed yet.</p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-3 text-primary text-sm font-medium hover:underline"
              >
                Add your first item →
              </button>
            </div>
          ) : (
            <>
              {/* Desktop table header */}
              <div className="hidden md:grid grid-cols-[56px_1fr_120px_90px_100px_110px_120px] gap-4 px-6 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70">
                {['', 'Title', 'Category', 'Condition', 'Status', 'Rent/day', 'Actions'].map((h) => (
                  <span key={h} className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</span>
                ))}
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {items.map((gear) => (
                  <div
                    key={gear.id}
                    className="flex flex-col md:grid md:grid-cols-[56px_1fr_120px_90px_100px_110px_120px] gap-2 md:gap-4 items-start md:items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {gear.image_url ? (
                        <img src={gear.image_url} alt={gear.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageOff size={18} className="text-slate-400" />
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">{gear.title}</p>
                      <p className="text-xs text-slate-400 line-clamp-1">{gear.description}</p>
                    </div>

                    {/* Category — use id since name may not be expanded */}
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {gear.category?.name || `Cat ${gear.category_id}`}
                    </span>

                    {/* Condition */}
                    <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">
                      {CONDITION_LABELS[gear.condition] || gear.condition}
                    </span>

                    {/* Status */}
                    <StatusBadge status={gear.status} />

                    {/* Price */}
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {Number(gear.rent_price) === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">Free</span>
                      ) : (
                        `£${Number(gear.rent_price).toFixed(2)}`
                      )}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEdit(gear)}
                        className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-primary-light dark:hover:bg-primary/10 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        onClick={() => handleToggleStatus(gear)}
                        disabled={toggling === gear.id}
                        className="p-2 rounded-lg text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                        title={gear.status === 'available' ? 'Mark unavailable' : 'Mark available'}
                      >
                        {toggling === gear.id
                          ? <Loader2 size={15} className="animate-spin" />
                          : gear.status === 'available'
                            ? <ToggleRight size={15} className="text-emerald-500" />
                            : <ToggleLeft size={15} />
                        }
                      </button>

                      <button
                        onClick={() => setDeleteTarget(gear)}
                        className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit/Add modal */}
      <AddEditGearModal
        open={modalOpen}
        onClose={handleModalClose}
        editGear={editTarget}
      />

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove Gear?"
        message={`"${deleteTarget?.title}" will be permanently removed from your listings.`}
        confirmLabel="Remove"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
