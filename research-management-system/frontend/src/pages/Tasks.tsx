import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// If you do have an AdminTasks component, you can import and use it.
// import AdminTasks from '../components/tasks/AdminTasks';
import ResearchLeadTasks from '../components/tasks/ResearchLeadTasks';
import TeamMemberTasks from '../components/tasks/TeamMemberTasks';

const Tasks: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabels = {
    admin: 'Administrator',
    research_lead: 'Research Lead',
    team_member: 'Team Member'
  } as const;

  const renderTasksComponent = () => {
    switch (user.role) {
      case 'admin':
        // return <AdminTasks />; // use this if you have it
        return <ResearchLeadTasks />; // fallback to lead view for admin
      case 'research_lead':
        return <ResearchLeadTasks />;
      case 'team_member':
        return <TeamMemberTasks />;
      default:
        return <TeamMemberTasks />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Shared Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold">Task Management</h1>
              <div className="hidden md:flex space-x-4">
                <button onClick={() => navigate('/dashboard')} className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</button>
                <button onClick={() => navigate('/projects')} className="text-gray-700 hover:text-blue-600 font-medium">Projects</button>
                <button onClick={() => navigate('/tasks')} className="text-blue-600 font-medium border-b-2 border-blue-600">Tasks</button>
                <button onClick={() => navigate('/profile')} className="text-gray-700 hover:text-blue-600 font-medium">Profile</button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {roleLabels[user.role] ?? 'User'}
              </span>
              <button onClick={handleLogout} className="text-blue-600 hover:text-blue-800 font-medium">Logout</button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t pt-4 pb-2">
            <div className="flex space-x-4 overflow-x-auto">
              <button onClick={() => navigate('/dashboard')} className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap">Dashboard</button>
              <button onClick={() => navigate('/projects')} className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap">Projects</button>
              <button onClick={() => navigate('/tasks')} className="text-blue-600 font-medium whitespace-nowrap border-b-2 border-blue-600">Tasks</button>
              <button onClick={() => navigate('/profile')} className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap">Profile</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Role-Specific Tasks Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderTasksComponent()}
      </main>
    </div>
  );
};

export default Tasks;