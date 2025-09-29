import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import ErrorAlert from '../common/ErrorAlert';
import LoadingSpinner from '../common/LoadingSpinner';

type Tab = 'overview' | 'tasks' | 'projects';
type TaskStatus = 'pending' | 'in_progress' | 'completed';

interface Project {
  _id: string;
  title: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  deadline?: string;
  progress?: number; // from Project virtual (if included in toJSON)
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  project?: Project | string;
  status: TaskStatus;
  deadline?: string;
  progress?: number;     // optional if your Task has progress
  actualHours?: number;  // optional
  comments?: string;     // optional (add note)
}

const TeamMemberDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Progress modal
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressTaskId, setProgressTaskId] = useState<string | null>(null);
  const [hoursSpent, setHoursSpent] = useState<number>(0);
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

        // Fetch tasks assigned/visible to the current user
        const t = await api.get('/tasks', { headers });
        if (t.data?.success) {
          setTasks(t.data.data);
        } else {
          setError('Failed to load tasks');
        }

        // Fetch projects visible to user (your existing role-based /projects route)
        const p = await api.get('/projects', { headers });
        if (p.data?.success) {
          const ps = p.data.data.map((proj: any) => ({
            _id: proj._id,
            title: proj.title,
            status: proj.status,
            deadline: proj.deadline,
            progress: proj.progress
          }));
          setProjects(ps);
        }
      } catch (e: any) {
        console.error('Init error:', e);
        setError(e.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    // Refresh data when switching tabs (lightweight and avoids stale data)
    init();
  }, [activeTab]);

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

      // Your backend supports PUT /tasks/:id and will allow assigned users to update status
      const res = await api.put(`/tasks/${taskId}`, { status }, { headers });
      if (res.data?.success) {
        setTasks(prev => prev.map(t => (t._id === taskId ? res.data.data : t)));
      } else {
        setError('Failed to update task status');
      }
    } catch (e: any) {
      console.error('Update status error:', e);
      setError(e.response?.data?.message || 'Failed to update task status');
    }
  };

  const handleSubmitProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!progressTaskId) return;

    try {
      setError(null);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      // Assigned users are allowed to update actualHours and comments via PUT /tasks/:id
      const res = await api.put(`/tasks/${progressTaskId}`, { actualHours: hoursSpent, comments: note }, { headers });
      if (res.data?.success) {
        setTasks(prev => prev.map(t => (t._id === progressTaskId ? res.data.data : t)));
        setShowProgressModal(false);
      } else {
        setError('Failed to submit progress');
      }
    } catch (e: any) {
      console.error('Submit progress error:', e);
      setError(e.response?.data?.message || 'Failed to submit progress');
    }
  };

  // Derived overview values
  const overview = useMemo(() => {
    const totalTasks = tasks.length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const dueSoon = tasks.filter(t => {
      if (!t.deadline) return false;
      const days = (new Date(t.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return days <= 7 && days >= 0;
    }).length;
    return { totalTasks, pending, inProgress, completed, dueSoon };
  }, [tasks]);

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Team Member Dashboard</h2>
              <p className="text-gray-600">View your tasks and update progress</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
            {(['overview', 'tasks', 'projects'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'overview' && '📊 Overview'}
                {tab === 'tasks' && '✅ My Tasks'}
                {tab === 'projects' && '🔬 My Projects'}
              </button>
            ))}
          </div>

          {loading && <LoadingSpinner />}
          {error && <ErrorAlert message={error} />}

          {!loading && !error && (
            <>
              {/* Overview */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">Total Tasks</h3>
                    <p className="text-3xl font-bold text-blue-600">{overview.totalTasks}</p>
                    <p className="text-sm text-blue-600 mt-1">{overview.dueSoon} due within 7 days</p>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <h3 className="font-semibold text-yellow-800 mb-2">Pending</h3>
                    <p className="text-3xl font-bold text-yellow-600">{overview.pending}</p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-800 mb-2">In Progress</h3>
                    <p className="text-3xl font-bold text-purple-600">{overview.inProgress}</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">Completed</h3>
                    <p className="text-3xl font-bold text-green-600">{overview.completed}</p>
                  </div>
                </div>
              )}

              {/* Tasks */}
              {activeTab === 'tasks' && (
                <div className="space-y-3">
                  {tasks.length === 0 ? (
                    <div className="text-gray-600">No tasks assigned yet.</div>
                  ) : (
                    tasks.map(task => (
                      <div key={task._id} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{task.title}</h4>
                            <p className="text-sm text-gray-600">{task.description || '—'}</p>
                            <div className="text-xs text-gray-500 mt-1">
                              Project: {typeof task.project === 'object' ? task.project.title : '—'}
                            </div>
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
                            <button
                              onClick={() => openProgressModal(task)}
                              className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Update Progress
                            </button>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <span className="mr-4">Hours: {task.actualHours ?? 0}</span>
                          <span>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : '—'}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Projects */}
              {activeTab === 'projects' && (
                <div className="space-y-3">
                  {projects.length === 0 ? (
                    <div className="text-gray-600">No assigned projects.</div>
                  ) : (
                    projects.map(p => (
                      <div key={p._id} className="p-4 border rounded-lg bg-white">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{p.title}</h4>
                            <div className="text-xs text-gray-500 mt-1">
                              Status: {p.status} • Deadline: {p.deadline ? new Date(p.deadline).toLocaleDateString() : '—'}
                            </div>
                          </div>
                          <div className="w-48">
                            <div className="text-xs text-gray-500 mb-1">Project Progress</div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${p.progress ?? 0}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Progress Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Submit Progress Update</h3>
            <form onSubmit={handleSubmitProgress} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hours Spent</label>
                <input
                  type="number"
                  min={0}
                  value={hoursSpent}
                  onChange={(e) => setHoursSpent(Number(e.target.value))}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border rounded p-2"
                  rows={3}
                  placeholder="What did you complete or blockages?"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowProgressModal(false)} className="px-4 py-2 rounded border">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMemberDashboard;