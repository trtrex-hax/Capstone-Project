import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import ErrorAlert from '../common/ErrorAlert';
import LoadingSpinner from '../common/LoadingSpinner';
import ProjectComments from './ProjectComments';

interface Project {
  _id: string;
  title: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  deadline?: string;
  progress?: number;
}

const TeamMemberProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Discussion toggle
  const [openCommentsFor, setOpenCommentsFor] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const res = await api.get('/projects', { headers });
      if (res.data?.success) {
        setProjects(res.data.data);
      } else {
        setError('Failed to load projects');
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

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">My Projects</h3>
      {projects.length === 0 ? (
        <div className="text-gray-600">No assigned projects.</div>
      ) : (
        <div className="space-y-3">
          {projects.map(p => (
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
                  <button
                    onClick={() => setOpenCommentsFor(openCommentsFor === p._id ? null : p._id)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                  >
                    Discussion
                  </button>
                </div>
              </div>

              <div className="mt-2">
                <div className="text-xs text-gray-500 mb-1">Project Progress</div>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamMemberProjects;