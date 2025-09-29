import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import ErrorAlert from '../common/ErrorAlert';
import LoadingSpinner from '../common/LoadingSpinner';

type Tab = 'overview' | 'projects' | 'team' | 'reviews';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'research_lead' | 'team_member';
  department?: string;
}

interface Goal {
  description: string;
  isCompleted: boolean;
  deadline?: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  goals: Goal[];
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  deadline?: string;
  progress?: number; // from virtual
  researchLead: string | User;
  teamMembers: User[];
  createdAt?: string;
  updatedAt?: string;
}

const ResearchLeadDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const [projects, setProjects] = useState<Project[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    goals: '',      // multiline text; backend will normalize to array
    deadline: ''
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const selectedProject = useMemo(
    () => projects.find(p => p._id === selectedProjectId) || null,
    [projects, selectedProjectId]
  );

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

        const res = await api.get('/projects', { headers });
        if (res.data?.success) {
          setProjects(res.data.data);
          if (!selectedProjectId && res.data.data.length) {
            setSelectedProjectId(res.data.data[0]._id);
          }
        } else {
          setError('Failed to load projects');
        }

        const u = await api.get('/users?role=team_member', { headers });
        if (u.data?.success) {
          setAvailableUsers(u.data.data);
        }
      } catch (e: any) {
        console.error('Init error:', e);
        setError(e.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (['overview', 'projects', 'team'].includes(activeTab)) {
      init();
    }
  }, [activeTab]); // eslint-disable-line

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      setError(null);

      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const payload = {
        title: newProject.title.trim(),
        description: newProject.description.trim(),
        goals: newProject.goals, // string; backend normalizes
        deadline: newProject.deadline || undefined,
        status: 'active'
      };

      const res = await api.post('/projects', payload, { headers });
      if (res.data?.success) {
        setProjects(prev => [res.data.data, ...prev]);
        setShowCreateModal(false);
        setNewProject({ title: '', description: '', goals: '', deadline: '' });
        if (!selectedProjectId) setSelectedProjectId(res.data.data._id);
      } else {
        setError('Failed to create project');
      }
    } catch (e: any) {
      console.error('Create project error:', e);
      setError(e.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleAddMember = async (userId: string) => {
    if (!selectedProject) return;
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const res = await api.post(`/projects/${selectedProject._id}/team`, { userId }, { headers });
      if (res.data?.success) {
        setProjects(prev => prev.map(p => (p._id === selectedProject._id ? res.data.data : p)));
      }
    } catch (e: any) {
      console.error('Add member error:', e);
      setError(e.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedProject) return;
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const res = await api.delete(`/projects/${selectedProject._id}/team/${userId}`, { headers });
      if (res.data?.success) {
        setProjects(prev => prev.map(p => (p._id === selectedProject._id ? res.data.data : p)));
      }
    } catch (e: any) {
      console.error('Remove member error:', e);
      setError(e.response?.data?.message || 'Failed to remove member');
    }
  };

  const overviewStats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'active').length;
    const nearingDeadline = projects.filter(p => {
      if (!p.deadline) return false;
      const days = (new Date(p.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return days <= 14 && days >= 0;
    }).length;
    const teamCount = projects.reduce((sum, p) => sum + (p.teamMembers?.length || 0), 0);
    return { total, active, nearingDeadline, teamCount };
  }, [projects]);

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Research Lead Dashboard</h2>
              <p className="text-gray-600">Manage your research projects and team</p>
            </div>
            <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              + New Project
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
            {(['overview', 'projects', 'team', 'reviews'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'overview' && '📊 Overview'}
                {tab === 'projects' && '🔬 Projects'}
                {tab === 'team' && '👥 Team'}
                {tab === 'reviews' && '⏰ Reviews'}
              </button>
            ))}
          </div>

          {loading && <LoadingSpinner />}
          {error && <ErrorAlert message={error} />}

          {!loading && !error && (
            <>
              {/* Overview */}
              {activeTab === 'overview' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-800 mb-2">Active Projects</h3>
                      <p className="text-3xl font-bold text-green-600">{overviewStats.active}</p>
                      <p className="text-sm text-green-600 mt-1">{overviewStats.nearingDeadline} nearing deadline</p>
                    </div>
                    <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                      <h3 className="font-semibold text-yellow-800 mb-2">Pending Reviews</h3>
                      <p className="text-3xl font-bold text-yellow-600">—</p>
                      <p className="text-sm text-yellow-600 mt-1">Coming soon</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-800 mb-2">Team Members</h3>
                      <p className="text-3xl font-bold text-blue-600">{overviewStats.teamCount}</p>
                      <p className="text-sm text-blue-600 mt-1">Across all projects</p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                      <h3 className="font-semibold text-purple-800 mb-2">Total Projects</h3>
                      <p className="text-3xl font-bold text-purple-600">{overviewStats.total}</p>
                      <p className="text-sm text-purple-600 mt-1">Managed by you</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">🚀 Project Progress</h3>
                    <div className="space-y-3">
                      {projects.map(project => (
                        <div key={project._id} className="bg-white p-3 rounded">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{project.title}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              project.status === 'active' ? 'bg-green-100 text-green-800' :
                              project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
                              project.status === 'planning' ? 'bg-gray-100 text-gray-800' :
                              project.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}>{project.status}</span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{project.progress ?? 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress ?? 0}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Projects */}
              {activeTab === 'projects' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">🔬 Your Research Projects</h3>
                  {projects.length === 0 ? (
                    <div className="text-gray-600">No projects yet. Click “New Project” to create one.</div>
                  ) : (
                    <div className="space-y-4">
                      {projects.map(project => (
                        <div key={project._id} className="p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-lg">{project.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              project.status === 'active' ? 'bg-green-100 text-green-800' :
                              project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
                              project.status === 'planning' ? 'bg-gray-100 text-gray-800' :
                              project.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}>{project.status}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{project.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                            <div><span className="font-medium">Progress:</span> {project.progress ?? 0}%</div>
                            <div><span className="font-medium">Team:</span> {project.teamMembers?.length || 0} members</div>
                            <div><span className="font-medium">Deadline:</span> {project.deadline ? new Date(project.deadline).toLocaleDateString() : '—'}</div>
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={() => { setSelectedProjectId(project._id); setActiveTab('team'); }} className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200">
                              Manage Team
                            </button>
                            <button onClick={() => setActiveTab('overview')} className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200">
                              Go to Overview
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Team */}
              {activeTab === 'team' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">👥 Team Management</h3>
                  {projects.length > 0 ? (
                    <>
                      <div className="mb-4">
                        <label className="text-sm text-gray-600 mr-2">Project:</label>
                        <select value={selectedProjectId || ''} onChange={(e) => setSelectedProjectId(e.target.value)} className="border rounded p-2 text-sm">
                          {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                        </select>
                      </div>

                      {selectedProject ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-3">Current Team</h4>
                            {selectedProject.teamMembers.length === 0 ? (
                              <div className="text-gray-600 text-sm">No team members yet.</div>
                            ) : (
                              <div className="space-y-2">
                                {selectedProject.teamMembers.map(m => (
                                  <div key={m._id} className="flex justify_between items-center p-2 bg-gray-50 rounded">
                                    <div>
                                      <div className="font-medium">{m.name}</div>
                                      <div className="text-xs text-gray-600">{m.email}</div>
                                    </div>
                                    <button onClick={() => handleRemoveMember(m._id)} className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-3">Add Team Member</h4>
                            <div className="space-y-2">
                              {availableUsers.length === 0 ? (
                                <div className="text-sm text-gray-600">No available users found.</div>
                              ) : (
                                availableUsers.map(u => {
                                  const alreadyIn = selectedProject.teamMembers.some(m => m._id === u._id);
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
                      ) : (
                        <div className="text-gray-600">Select a project to manage its team.</div>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-600">No projects. Create one first.</div>
                  )}
                </div>
              )}

              {/* Reviews placeholder */}
              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">⏰ Pending Reviews & Approvals</h3>
                  <div className="text-gray-600">Coming soon.</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                <input type="text" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} className="w-full border rounded p-2" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className="w-full border rounded p-2" rows={4} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goals (one per line)</label>
                <textarea value={newProject.goals} onChange={(e) => setNewProject({ ...newProject, goals: e.target.value })} className="w-full border rounded p-2" rows={3} placeholder="e.g. Literature review&#10;Data collection&#10;Model training" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline (optional)</label>
                <input type="date" value={newProject.deadline} onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })} className="w-full border rounded p-2" />
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded border" disabled={creating}>Cancel</button>
                <button type="submit" disabled={creating} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchLeadDashboard;