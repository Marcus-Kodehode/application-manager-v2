'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createTask, toggleTask, deleteTask, getTasksByJob } from '@/lib/actions/tasks';

export function TasksTab({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', dueAt: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [jobId]);

  const loadTasks = async () => {
    try {
      const data = await getTasksByJob(jobId);
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    setSubmitting(true);
    try {
      await createTask({
        jobId,
        title: newTask.title,
        dueAt: newTask.dueAt || undefined,
      });
      setNewTask({ title: '', dueAt: '' });
      await loadTasks();
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Kunne ikke legge til oppgave');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (taskId: string) => {
    try {
      await toggleTask(taskId);
      await loadTasks();
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Kunne ikke oppdatere oppgave');
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Er du sikker på at du vil slette denne oppgaven?')) return;

    try {
      await deleteTask(taskId);
      await loadTasks();
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Kunne ikke slette oppgave');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Laster oppgaver...</p>
        </div>
      </div>
    );
  }

  const pendingTasks = tasks.filter(t => !t.done);
  const completedTasks = tasks.filter(t => t.done);

  return (
    <div className="space-y-6">
      {/* Add Task Form */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-colors">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          ➕ Legg til oppgave
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Oppgave *
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="F.eks. Send oppfølgingsmail, Forbered til intervju"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              📅 Frist (valgfritt)
            </label>
            <input
              type="date"
              value={newTask.dueAt}
              onChange={(e) => setNewTask({ ...newTask, dueAt: e.target.value })}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
            />
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting || !newTask.title.trim()}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {submitting ? '⏳ Lagrer...' : '✅ Legg til oppgave'}
            </button>
          </div>
        </form>
      </div>

      {/* Pending Tasks */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-colors">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          🎯 Aktive oppgaver ({pendingTasks.length})
        </h3>
        {pendingTasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">✨</div>
            <p className="text-muted">Ingen aktive oppgaver - du er à jour!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map((task) => {
              const dueDate = task.dueAt ? new Date(task.dueAt) : null;
              const isOverdue = dueDate && dueDate < new Date();
              const isDueSoon = dueDate && !isOverdue && dueDate.getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000;
              
              return (
                <div key={task._id} className={`flex items-start gap-3 p-4 bg-accent/50 rounded-lg transition-all hover:shadow-sm group ${isOverdue ? 'border-l-4 border-destructive' : isDueSoon ? 'border-l-4 border-yellow-500' : ''}`}>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => handleToggle(task._id)}
                    className="mt-1 h-5 w-5 text-primary rounded focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium">{task.title}</p>
                    {task.dueAt && (
                      <p className={`text-sm mt-1 flex items-center gap-1 ${isOverdue ? 'text-destructive font-medium' : isDueSoon ? 'text-yellow-600 dark:text-yellow-500 font-medium' : 'text-muted'}`}>
                        📅 Frist: {new Date(task.dueAt).toLocaleDateString('nb-NO', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                        {isOverdue && ' ⚠️ Forfalt'}
                        {isDueSoon && ' ⏰ Snart'}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-sm text-destructive hover:text-destructive/80 font-medium opacity-0 group-hover:opacity-100 transition-colors duration-200 px-3 py-1 rounded hover:bg-destructive/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:opacity-100"
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-colors">
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            ✅ Fullførte oppgaver ({completedTasks.length})
          </h3>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <div key={task._id} className="flex items-start gap-3 p-4 bg-accent/30 rounded-lg opacity-70 hover:opacity-100 transition-all group">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => handleToggle(task._id)}
                  className="mt-1 h-5 w-5 text-primary rounded focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground line-through">{task.title}</p>
                  {task.dueAt && (
                    <p className="text-sm text-muted mt-1">
                      📅 Frist: {new Date(task.dueAt).toLocaleDateString('nb-NO', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-sm text-destructive hover:text-destructive/80 font-medium opacity-0 group-hover:opacity-100 transition-colors duration-200 px-3 py-1 rounded hover:bg-destructive/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:opacity-100"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
