// src/components/tasks/ResearchLeadTasks.tsx
import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import ErrorAlert from '../common/ErrorAlert';
import LoadingSpinner from '../common/LoadingSpinner';

type TaskStatus = 'pending' | 'in_progress' | 'completed';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Project {
  _id: string;
  title: string;
  teamMembers: User[];
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  project?: Project | string;
  assignedTo?: User | string;
  status: TaskStatus;
  deadline?: string;
}

const ResearchLeadTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | 'all'>('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create task modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    deadline: '',
    status: 'pending' as TaskStatus
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

        // Load projects (with team members)
        const p = await api.get('/projects', { headers });
        if (p.data?.success) {
          const projectsData: Project[] = p.data.data.map((proj: any) => ({
            _id: proj._id,
            title: proj.title,
            teamMembers: proj.teamMembers || []
          }));
          setProjects(projectsData);
          if (!form.projectId && projectsData.length) {
            setForm(prev => ({ ...prev, projectId: projectsData[0]._id }));
          }
        } else {
          setError('Failed to load projects');
        }

        // Load tasks (lead can see tasks for own projects per your route)
        const t = await api.get('/tasks', { headers });
        if (t.data?.success) {
          setTasks(t.data.data);
        } else {
          setError('Failed to load tasks');
        }
      } catch (e: any) {
        setError(e.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []); // on mount

  const filteredTasks = useMemo(() => {
    if (selectedProjectId === 'all') return tasks;
    return tasks.filter(t => {
      if (!t.project) return false;
      const projId = typeof t.project === 'object' ? t.project._id : t.project;
      return projId === selectedProjectId;
    });
  }, [tasks, selectedProjectId]);

  const handleUpdateStatus = async (taskId: string, status: TaskStatus) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const res = await api.put(`/tasks/${taskId}`, { status }, { headers });
      if (res.data?.success) {
        setTasks(prev => prev.map(t => (t._id === taskId ? res.data.data : t)));
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to update status');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      setError(null);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        project: form.projectId,
        assignedTo: form.assignedTo || undefined,
        deadline: form.deadline || undefined,
        status: form.status
      };

      const res = await api.post('/tasks', payload, { headers });
      if (res.data?.success) {
        setTasks(prev => [res.data.data, ...prev]);
        setShowCreateModal(false);
        setForm({
          title: '',
          description: '',
          projectId: projects[0]?._id || '',
          assignedTo: '',
          deadline: '',
          status: 'pending'
        });
      } else {
        setError('Failed to create task');
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  const currentProject = projects.find(p => p._id === form.projectId);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Project:</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value as any)}
            className="border rounded p-2 text-sm"
          >
            <option value="all">All</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
          </select>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + New Task
        </button>
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-gray-600">No tasks found.</div>
        ) : (
          filteredTasks.map(task => (
            <div key={task._id} className="p-4 border rounded bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-sm text-gray-600">{task.description || '—'}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Project: {typeof task.project === 'object' ? task.project.title : '—'}
                  </div>
                </div>
                <div>
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateStatus(task._id, e.target.value as TaskStatus)}
                    className="text-sm border rounded p-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : '—'}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description (optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border rounded p-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Project</label>
                <select
                  value={form.projectId}
                  onChange={(e) => setForm({ ...form, projectId: e.target.value, assignedTo: '' })}
                  className="w-full border rounded p-2"
                  required
                >
                  {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assign To (project member)</label>
                <select
                  value={form.assignedTo}
                  onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  className="w-full border rounded p-2"
                >
                  <option value="">—</option>
                  {currentProject?.teamMembers?.map(m => (
                    <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deadline (optional)</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded border" disabled={creating}>Cancel</button>
                <button type="submit" disabled={creating} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                  {creating ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchLeadTasks;