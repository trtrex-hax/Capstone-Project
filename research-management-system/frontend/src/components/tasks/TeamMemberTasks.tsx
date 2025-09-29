// src/components/tasks/TeamMemberTasks.tsx
import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import ErrorAlert from '../common/ErrorAlert';
import LoadingSpinner from '../common/LoadingSpinner';

type TaskStatus = 'pending' | 'in_progress' | 'completed';

interface ProjectRef {
  _id: string;
  title: string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  project?: ProjectRef | string;
  status: TaskStatus;
  deadline?: string;
  progress?: number;
  actualHours?: number;
  comments?: string;
}

const TeamMemberTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Progress modal
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressTaskId, setProgressTaskId] = useState<string | null>(null);
  const [hoursSpent, setHoursSpent] = useState<number>(0);
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

        const res = await api.get('/tasks', { headers });
        if (res.data?.success) {
          setTasks(res.data.data);
        } else {
          setError('Failed to load tasks');
        }
      } catch (e: any) {
        setError(e.response?.data?.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const overview = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    return { total, pending, inProgress, completed };
  }, [tasks]);

  const openProgressModal = (task: Task) => {
    setProgressTaskId(task._id);
    setHoursSpent(task.actualHours ?? 0);
    setNote('');
    setShowProgressModal(true);
  };

  const handleUpdateStatus = async (taskId: string, status: TaskStatus) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const res = await api.put(`/tasks/${taskId}`, { status }, { headers });
      if (res.data?.success) {
        setTasks(prev => prev.map(t => (t._id === taskId ? res.data.data : t)));
      } else {
        setError('Failed to update status');
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to update status');
    }
  };

  const handleSubmitProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!progressTaskId) return;
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const res = await api.put(`/tasks/${progressTaskId}`, { actualHours: hoursSpent, comments: note }, { headers });
      if (res.data?.success) {
        setTasks(prev => prev.map(t => (t._id === progressTaskId ? res.data.data : t)));
        setShowProgressModal(false);
      } else {
        setError('Failed to submit progress');
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to submit progress');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-50 p-4 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">Total Tasks</div>
          <div className="text-2xl font-bold text-blue-600">{overview.total}</div>
        </div>
        <div className="bg-yellow-50 p-4 border border-yellow-200 rounded">
          <div className="font-semibold text-yellow-800">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{overview.pending}</div>
        </div>
        <div className="bg-purple-50 p-4 border border-purple-200 rounded">
          <div className="font-semibold text-purple-800">In Progress</div>
          <div className="text-2xl font-bold text-purple-600">{overview.inProgress}</div>
        </div>
        <div className="bg-green-50 p-4 border border-green-200 rounded">
          <div className="font-semibold text-green-800">Completed</div>
          <div className="text-2xl font-bold text-green-600">{overview.completed}</div>
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-gray-600">No tasks assigned.</div>
        ) : (
          tasks.map(task => (
            <div key={task._id} className="p-4 border rounded bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-sm text-gray-600">{task.description || '—'}</div>
                  <div className="text-xs text-gray-500 mt-1">Project: {typeof task.project === 'object' ? task.project.title : '—'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateStatus(task._id, e.target.value as TaskStatus)}
                    className="text-sm border rounded p-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button onClick={() => openProgressModal(task)} className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Update Progress
                  </button>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span className="mr-4">Hours: {task.actualHours ?? 0}</span>
                <span>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : '—'}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Progress Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Submit Progress Update</h3>
            <form onSubmit={handleSubmitProgress} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Hours Spent</label>
                <input type="number" min={0} value={hoursSpent} onChange={(e) => setHoursSpent(Number(e.target.value))} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Note (optional)</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full border rounded p-2" rows={3} placeholder="What did you complete or blockages?" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowProgressModal(false)} className="px-4 py-2 rounded border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMemberTasks;