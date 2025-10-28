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
    return <div className="text-center py-8 text-gray-500">Laster oppgaver...</div>;
  }

  const pendingTasks = tasks.filter(t => !t.done);
  const completedTasks = tasks.filter(t => t.done);

  return (
    <div className="space-y-6">
      {/* Add Task Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legg til oppgave</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Oppgave *
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="F.eks. Send oppfølgingsmail"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frist (valgfritt)
            </label>
            <input
              type="date"
              value={newTask.dueAt}
              onChange={(e) => setNewTask({ ...newTask, dueAt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !newTask.title.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Lagrer...' : 'Legg til oppgave'}
            </button>
          </div>
        </form>
      </div>

      {/* Pending Tasks */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Aktive oppgaver ({pendingTasks.length})
        </h3>
        {pendingTasks.length === 0 ? (
          <p className="text-gray-500 text-sm">Ingen aktive oppgaver</p>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div key={task._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => handleToggle(task._id)}
                  className="mt-1 h-4 w-4 text-blue-600 rounded"
                />
                <div className="flex-1">
                  <p className="text-gray-900">{task.title}</p>
                  {task.dueAt && (
                    <p className="text-sm text-gray-500 mt-1">
                      Frist: {new Date(task.dueAt).toLocaleDateString('nb-NO')}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Slett
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Fullførte oppgaver ({completedTasks.length})
          </h3>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <div key={task._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg opacity-60">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => handleToggle(task._id)}
                  className="mt-1 h-4 w-4 text-blue-600 rounded"
                />
                <div className="flex-1">
                  <p className="text-gray-900 line-through">{task.title}</p>
                  {task.dueAt && (
                    <p className="text-sm text-gray-500 mt-1">
                      Frist: {new Date(task.dueAt).toLocaleDateString('nb-NO')}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Slett
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
