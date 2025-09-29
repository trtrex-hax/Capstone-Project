import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import ErrorAlert from '../common/ErrorAlert';
import LoadingSpinner from '../common/LoadingSpinner';
import ProjectComments from './ProjectComments';

type Status = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  status: Status;
  deadline?: string;
  progress?: number;
  teamMembers: User[];
  researchLead?: User | string;
}

const ResearchLeadProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Create modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    goals: '', // multiline; backend normalizes
    deadline: ''
  });

  // Team modal
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamProjectId, setTeamProjectId] = useState<string | null>(null);

  // Discussion toggle
  const [openCommentsFor, setOpenCommentsFor] = useState<string | null>(null);

  const tokenHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  };

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = tokenHeaders();

      const p = await api.get('/projects', { headers });
      if (p.data?.success) {
        setProjects(p.data.data);
      } else {
        setError('Failed to load projects');
      }

      const u = await api.get('/users?role=team_member', { headers });
      if (u.data?.success) {
        setAvailableUsers(u.data.data);
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const overview = useMemo(() => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'active').length;
    const onHold = projects.filter(p => p.status === 'on_hold').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    return { total, active, onHold, completed };
  }, [projects]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      setError(null);
      const headers = tokenHeaders();
      const payload = {
        title: newProject.title.trim(),
        description: newProject.description.trim(),
        goals: newProject.goals,
        deadline: newProject.deadline || undefined,
        status: 'active' as Status
      };
      const res = await api.post('/projects', payload, { headers });
      if (res.data?.success) {
        setProjects(prev => [res.data.data, ...prev]);
        setShowCreateModal(false);
        setNewProject({ title: '', description: '', goals: '', deadline: '' });
      } else {
        setError('Failed to create project');
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateStatus = async (projectId: string, status: Status) => {
    try {
      setError(null);
      const headers = tokenHeaders();
      const res = await api.put(`/projects/${projectId}`, { status }, { headers });
      if (res.data?.success) {
        setProjects(prev => prev.map(p => (p._id === projectId ? res.data.data : p)));
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to update status');
    }
  };

  const openTeamModal = (projectId: string) => {
    setTeamProjectId(projectId);
    setShowTeamModal(true);
  };

  const handleAddMember = async (userId: string) => {
    if (!teamProjectId) return;
    try {
      setError(null);
      const headers = tokenHeaders();
      const res = await api.post(`/projects/${teamProjectId}/team`, { userId }, { headers });
      if (res.data?.success) {
        setProjects(prev => prev.map(p => (p._id === teamProjectId ? res.data.data : p)));
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!teamProjectId) return;
    try {
      setError(null);
      const headers = tokenHeaders();
      const res = await api.delete(`/projects/${teamProjectId}/team/${userId}`, { headers });
      if (res.data?.success) {
        setProjects(prev => prev.map(p => (p._id === teamProjectId ? res.data.data : p)));
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to remove member');
    }
  };

  const requestDeleteProject = async (projectId: string, title: string) => {
    if (!window.confirm(`Delete project "${title}"?`)) return;
    try {
      setError(null);
      const headers = tokenHeaders();
      const res = await api.delete(`/projects/${projectId}`, { headers });
      if (res.data?.success) {
        setProjects(prev => prev.filter(p => p._id !== projectId));
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to delete project');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-50 p-4 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">Total</div>
          <div className="text-2xl font-bold text-blue-600">{overview.total}</div>
        </div>
        <div className="bg-green-50 p-4 border border-green-200 rounded">
          <div className="font-semibold text-green-800">Active</div>
          <div className="text-2xl font-bold text-green-600">{overview.active}</div>
        </div>
        <div className="bg-yellow-50 p-4 border border-yellow-200 rounded">
          <div className="font-semibold text-yellow-800">On Hold</div>
          <div className="text-2xl font-bold text-yellow-600">{overview.onHold}</div>
        </div>
        <div className="bg-purple-50 p-4 border border-purple-200 rounded">
          <div className="font-semibold text-purple-800">Completed</div>
          <div className="text-2xl font-bold text-purple-600">{overview.completed}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Your Projects</h3>
        <button onClick={() => setShowCreateModal(true)} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + New Project
        </button>
      </div>

      {/* Projects list */}
      <div className="space-y-3">
        {projects.length === 0 ? (
          <div className="text-gray-600">No projects yet.</div>
        ) : (
          projects.map(p => (
            <div key={p._id} className="p-4 border rounded bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-600">{p.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Status: {p.status} • Deadline: {p.deadline ? new Date(p.deadline).toLocaleDateString() : '—'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={p.status}
                    onChange={(e) => handleUpdateStatus(p._id, e.target.value as Status)}
                    className="text-sm border rounded p-1"
                  >
                    <option value="planning">planning</option>
                    <option value="active">active</option>
                    <option value="on_hold">on_hold</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>

                  <button
                    onClick={() => setOpenCommentsFor(openCommentsFor === p._id ? null : p._id)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                  >
                    Discussion
                  </button>

                  <button
                    onClick={() => openTeamModal(p._id)}
                    className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
                  >
                    Manage Team
                  </button>

                  <button
                    onClick={() => requestDeleteProject(p._id, p.title)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-2">
                <div className="text-xs text-gray-500 mb-1">Progress</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${p.progress ?? 0}%` }} />
                </div>
              </div>

              {/* Discussion panel */}
              {openCommentsFor === p._id && (
                <div className="mt-4">
                  <ProjectComments projectId={p._id} />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Title</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full border rounded p-2"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Goals (one per line)</label>
                <textarea
                  value={newProject.goals}
                  onChange={(e) => setNewProject({ ...newProject, goals: e.target.value })}
                  className="w-full border rounded p-2"
                  rows={3}
                  placeholder="e.g. Literature review&#10;Data collection&#10;Model training"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deadline (optional)</label>
                <input
                  type="date"
                  value={newProject.deadline}
                  onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded border" disabled={creating}>Cancel</button>
                <button type="submit" disabled={creating} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Modal */}
      {showTeamModal && teamProjectId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Manage Team</h3>
              <button onClick={() => setShowTeamModal(false)} className="text-gray-600 hover:text-gray-800">Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded">
                <h4 className="font-medium mb-3">Current Team</h4>
                {projects.find(p => p._id === teamProjectId)?.teamMembers?.length ? (
                  <div className="space-y-2">
                    {projects.find(p => p._id === teamProjectId)?.teamMembers.map(m => (
                      <div key={m._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">{m.name}</div>
                          <div className="text-xs text-gray-600">{m.email}</div>
                        </div>
                        <button onClick={() => handleRemoveMember(m._id)} className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">No team members yet.</div>
                )}
              </div>

              <div className="p-4 border rounded">
                <h4 className="font-medium mb-3">Add Team Member</h4>
                <div className="space-y-2">
                  {availableUsers.length === 0 ? (
                    <div className="text-sm text-gray-600">No available users found.</div>
                  ) : (
                    availableUsers.map(u => {
                      const alreadyIn = projects.find(p => p._id === teamProjectId)?.teamMembers.some(m => m._id === u._id);
                      return (
                        <div key={u._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">{u.name}</div>
                            <div className="text-xs text-gray-600">{u.email}</div>
                          </div>
                          <button
                            disabled={alreadyIn}
                            onClick={() => handleAddMember(u._id)}
                            className={`text-sm ${alreadyIn ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:text-green-800'}`}
                          >
                            {alreadyIn ? 'Added' : 'Add'}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ResearchLeadProjects;