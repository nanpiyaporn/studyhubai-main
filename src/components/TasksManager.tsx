import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { GoogleTaskItem, UserSession } from '../types';
import { GoogleWorkspaceService } from '../services/googleWorkspace';

interface TasksManagerProps {
  tasks: GoogleTaskItem[];
  session: UserSession | null;
  onUpdateTasks: (tasks: GoogleTaskItem[]) => void;
  courseCode?: string;
}

export const TasksManager: React.FC<TasksManagerProps> = ({
  tasks,
  session,
  onUpdateTasks,
  courseCode,
}) => {
  const [filter, setFilter] = useState<'all' | 'needsAction' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredTasks = tasks.filter((t) => {
    if (filter !== 'all' && t.status !== filter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    return true;
  });

  const handleToggleStatus = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, status: (t.status === 'completed' ? 'needsAction' : 'completed') as 'needsAction' | 'completed' } : t
    );
    onUpdateTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    onUpdateTasks(tasks.filter((t) => t.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: GoogleTaskItem = {
      id: 'task_' + Date.now(),
      title: newTaskTitle.trim(),
      notes: 'Manually added to StudyHub task board.',
      due: newTaskDue || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      status: 'needsAction',
      courseCode: courseCode || 'CS 189',
      priority: newTaskPriority,
      syncedToGoogleTasks: false,
    };

    onUpdateTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDue('');
    setFeedback('New task created successfully!');
  };

  const handleSyncToGoogle = async (task: GoogleTaskItem) => {
    if (!session?.accessToken) return;
    setSyncingId(task.id);
    setFeedback(null);
    try {
      const res = await GoogleWorkspaceService.createGoogleTask(session.accessToken, task);
      if (res.success) {
        const updated = tasks.map((t) =>
          t.id === task.id ? { ...t, syncedToGoogleTasks: true, gTaskId: res.taskId } : t
        );
        onUpdateTasks(updated);
        setFeedback(`Task "${task.title}" synced to your Google Tasks!`);
      }
    } catch (e) {
      console.error(e);
      setFeedback('Failed to sync task to Google Tasks');
    } finally {
      setSyncingId(null);
    }
  };

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckSquare className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Google Tasks Action Center
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Actionable Academic Milestones
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Granular checklist items decomposed from your syllabus and problem sets, syncable with Google Tasks.
          </p>
        </div>

        {/* Progress Metric Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 min-w-[200px]">
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold mb-1.5">
            <span>Course Progress</span>
            <span className="text-emerald-700">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            {completedCount} of {tasks.length} tasks completed
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-700 font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new study checklist item..."
          className="w-full sm:flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="date"
          value={newTaskDue}
          onChange={(e) => setNewTaskDue(e.target.value)}
          className="w-full sm:w-auto text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
        />
        <select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value as any)}
          className="w-full sm:w-auto text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
        >
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </form>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          {(['all', 'needsAction', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {st === 'all' ? 'All Tasks' : st === 'needsAction' ? 'Pending' : 'Completed'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-semibold">Priority:</span>
          {['all', 'high', 'medium', 'low'].map((pr) => (
            <button
              key={pr}
              onClick={() => setPriorityFilter(pr)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium uppercase transition-all ${
                priorityFilter === pr
                  ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {pr}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No tasks match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Run the Taskmaster Agent or create a custom task above.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 transition-colors ${
                task.status === 'completed' ? 'bg-slate-50/70' : 'hover:bg-slate-50/40'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={() => handleToggleStatus(task.id)}
                  className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer mt-0.5 sm:mt-0"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {task.courseCode}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      task.priority === 'high'
                        ? 'bg-rose-100 text-rose-700'
                        : task.priority === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {task.priority}
                    </span>
                    {task.syncedToGoogleTasks && (
                      <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Synced
                      </span>
                    )}
                  </div>

                  <p className={`text-xs sm:text-sm font-semibold truncate ${
                    task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'
                  }`}>
                    {task.title}
                  </p>

                  {task.notes && (
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{task.notes}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {task.due && (
                  <span className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                    <Clock className="w-3 h-3 text-slate-400" /> {task.due}
                  </span>
                )}

                <button
                  onClick={() => handleSyncToGoogle(task)}
                  disabled={syncingId === task.id || task.syncedToGoogleTasks}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    task.syncedToGoogleTasks
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                  }`}
                >
                  {syncingId === task.id ? 'Syncing...' : task.syncedToGoogleTasks ? 'Synced' : 'Push to G-Tasks'}
                </button>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
