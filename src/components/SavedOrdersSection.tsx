import React, { useState } from 'react';
import { 
  History, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Calendar, 
  Brain, 
  CheckSquare, 
  Clock, 
  Check, 
  X, 
  RotateCw, 
  FolderOpen, 
  Sparkles,
  BookOpen,
  ChevronRight,
  Database
} from 'lucide-react';
import { SavedUserOrder } from '../services/orderService';
import { WorkflowResult } from '../types';
import { ActiveTabType } from './Header';

interface SavedOrdersSectionProps {
  orders: SavedUserOrder[];
  isLoading: boolean;
  activeOrderId?: string;
  onSelectOrder: (order: SavedUserOrder) => void;
  onDeleteOrder: (orderId: string) => Promise<void>;
  onUpdateOrderNotes: (orderId: string, notes: string, courseName?: string) => Promise<void>;
  onNavigateTab: (tab: ActiveTabType) => void;
}

export const SavedOrdersSection: React.FC<SavedOrdersSectionProps> = ({
  orders,
  isLoading,
  activeOrderId,
  onSelectOrder,
  onDeleteOrder,
  onUpdateOrderNotes,
  onNavigateTab,
}) => {
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editCourseName, setEditCourseName] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const handleStartEdit = (e: React.MouseEvent, order: SavedUserOrder) => {
    e.stopPropagation();
    setEditingOrderId(order.id);
    setEditCourseName(order.courseName || order.result.courseName || '');
    setEditNotes(order.notes || '');
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingOrderId(null);
  };

  const handleSaveEdit = async (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    setIsSavingEdit(true);
    try {
      await onUpdateOrderNotes(orderId, editNotes, editCourseName);
      setEditingOrderId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this study plan from Firebase?')) return;
    setIsDeletingId(orderId);
    try {
      await onDeleteOrder(orderId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-orange-200/80 p-6 shadow-sm flex items-center justify-center py-10 space-x-3 text-orange-800">
        <RotateCw className="w-5 h-5 animate-spin text-orange-600" />
        <span className="text-sm font-bold">Connecting to Firebase Firestore & Loading Previous Plans...</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-gradient-to-r from-orange-50/70 via-amber-50/50 to-stone-50/70 rounded-3xl border border-orange-200/80 p-6 sm:p-8 shadow-xs text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center mx-auto">
          <Database className="w-6 h-6" />
        </div>
        <h3 className="text-base font-extrabold text-stone-900">Your Firebase Academic Vault</h3>
        <p className="text-xs text-stone-600 max-w-lg mx-auto leading-relaxed">
          Whenever you run the Master Plan or generate study roadmaps, they are automatically backed up to your live <strong>Firebase Firestore Database</strong>. You can revisit past plans, edit notes, or delete them anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-orange-200 p-6 sm:p-8 shadow-sm space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900">
                Your Previous Academic Orders & Study Plans
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-800 border border-orange-300">
                <Database className="w-3 h-3" /> {orders.length} in Firebase
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any previous order to load its roadmap into the workspace. Edit custom notes or delete records in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Saved Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => {
          const isSelected = activeOrderId === order.id;
          const isEditing = editingOrderId === order.id;
          const blocksCount = order.result?.studyBlocks?.length || 0;
          const cardsCount = order.result?.ankiCards?.length || 0;
          const tasksCount = order.result?.tasks?.length || 0;
          const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div
              key={order.id}
              onClick={() => !isEditing && onSelectOrder(order)}
              className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between space-y-4 cursor-pointer group ${
                isSelected
                  ? 'bg-orange-50/90 border-orange-400 ring-2 ring-orange-400/40 shadow-md'
                  : 'bg-stone-50/60 hover:bg-white border-slate-200 hover:border-orange-300 hover:shadow-md'
              }`}
            >
              <div className="space-y-2.5">
                
                {/* Card Header & Badges */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-black text-orange-700 bg-white px-2.5 py-1 rounded-md border border-orange-200 shadow-2xs">
                    {order.courseCode || 'COURSE'}
                  </span>
                  
                  {/* Action buttons (Edit & Delete) */}
                  <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                    {!isEditing && (
                      <button
                        title="Edit plan details and notes"
                        onClick={(e) => handleStartEdit(e, order)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-100/60 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      title="Delete from Firebase Firestore"
                      disabled={isDeletingId === order.id}
                      onClick={(e) => handleDelete(e, order.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100/60 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isDeletingId === order.id ? (
                        <RotateCw className="w-4 h-4 animate-spin text-rose-600" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Course Name or Inline Editor */}
                {isEditing ? (
                  <div className="space-y-2 pt-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editCourseName}
                      onChange={(e) => setEditCourseName(e.target.value)}
                      placeholder="Course name"
                      className="w-full text-xs font-bold px-2.5 py-1.5 rounded-lg bg-white border border-orange-300 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                    />
                    <textarea
                      rows={2}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Add custom notes..."
                      className="w-full text-[11px] p-2 rounded-lg bg-white border border-orange-300 text-stone-700 focus:outline-hidden focus:ring-1 focus:ring-orange-500 resize-none"
                    />
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={handleCancelEdit}
                        className="px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-500 hover:bg-slate-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={isSavingEdit}
                        onClick={(e) => handleSaveEdit(e, order.id)}
                        className="px-3 py-1 rounded-md text-[11px] font-bold bg-orange-600 text-white hover:bg-orange-700 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {isSavingEdit ? <RotateCw className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                        Save Firebase
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 line-clamp-1 group-hover:text-orange-950 transition-colors">
                      {order.courseName}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Instructor: {order.instructor || 'N/A'} • {order.term || 'Fall'}
                    </p>
                    {order.notes && (
                      <p className="text-[11px] text-stone-600 mt-1.5 line-clamp-2 italic bg-white/70 p-2 rounded-lg border border-slate-100">
                        "{order.notes}"
                      </p>
                    )}
                  </div>
                )}

              </div>

              {/* Card Footer: Metadata & Metrics */}
              <div className="pt-3 border-t border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-orange-500" /> {blocksCount} Blocks
                  </span>
                  <span className="flex items-center gap-1">
                    <Brain className="w-3 h-3 text-amber-500" /> {cardsCount} Cards
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckSquare className="w-3 h-3 text-emerald-500" /> {tasksCount} Tasks
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {formattedDate}
                  </span>
                  <span className="font-bold text-orange-600 group-hover:underline flex items-center gap-0.5">
                    {isSelected ? 'Active in Workspace' : 'Load Plan'} <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
