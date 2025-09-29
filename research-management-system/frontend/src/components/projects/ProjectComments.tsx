import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface Author {
  _id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
}

interface Comment {
  _id: string;
  content: string;
  author: Author;
  createdAt: string;
}

interface Props {
  projectId: string;
}

const ProjectComments: React.FC<Props> = ({ projectId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const headers = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  };

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);
      const res = await api.get(`/projects/${projectId}/comments`, { headers: headers() });
      if (res.data?.success) setComments(res.data.data);
      else setErr('Failed to load comments');
    } catch (e: any) {
      setErr(e.response?.data?.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const res = await api.post(`/projects/${projectId}/comments`, { content }, { headers: headers() });
      if (res.data?.success) {
        setComments([res.data.data, ...comments]);
        setContent('');
      }
    } catch (e: any) {
      setErr(e.response?.data?.message || 'Failed to add comment');
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/comments/${id}`, { headers: headers() });
      setComments(comments.filter(c => c._id !== id));
    } catch (e: any) {
      setErr(e.response?.data?.message || 'Failed to delete comment');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  if (loading) return <div className="text-sm text-gray-600">Loading comments...</div>;
  if (err) return <div className="text-sm text-red-600">{err}</div>;

  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-3">Discussion</h4>

      <form onSubmit={submit} className="mb-4">
        <textarea
          className="w-full border rounded p-2 mb-2"
          rows={3}
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Post</button>
      </form>

      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="text-sm text-gray-600">No comments yet.</div>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="p-3 bg-gray-50 rounded border">
              <div className="flex justify-between">
                <div className="text-sm">
                  <span className="font-medium">{c.author?.name || 'Unknown'}</span>
                  <span className="text-gray-500"> • {new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <button
                  onClick={() => remove(c._id)}
                  className="text-xs text-red-600 hover:text-red-800"
                  title="Delete (author/lead/admin only)"
                >
                  Delete
                </button>
              </div>
              <div className="text-sm mt-1">{c.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectComments;