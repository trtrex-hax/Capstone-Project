import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminProjects from '../components/projects/AdminProjects';
import ResearchLeadProjects from '../components/projects/ResearchLeadProjects';
import TeamMemberProjects from '../components/projects/TeamMemberProjects';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, loading, isAuthenticated } = useAuth();

  // Show a spinner while auth state is resolving
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderProjectsComponent = () => {
    switch (user.role) {
      case 'admin':
        return <AdminProjects />;
      case 'research_lead':
        return <ResearchLeadProjects />;
      case 'team_member':
        return <TeamMemberProjects />;
      default:
        return <TeamMemberProjects />;
    }
  };

  const roleLabels = {
    admin: 'Administrator',
    research_lead: 'Research Lead', 
    team_member: 'Team Member'
  } as const;

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
              <h1 className="text-xl font-semibold">Research Projects</h1>
              {/* Navigation Links */}
              <div className="hidden md:flex space-x-4">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => navigate('/projects')}
                  className="text-blue-600 font-medium border-b-2 border-blue-600"
                >
                  Projects
                </button>
                <button 
                  onClick={() => navigate('/tasks')}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Tasks
                </button>
                <button 
                  onClick={() => navigate('/profile')}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Profile
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {roleLabels[user.role] ?? 'User'}
              </span>
              <button 
                onClick={handleLogout}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden border-t pt-4 pb-2">
            <div className="flex space-x-4 overflow-x-auto">
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap"
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/projects')}
                className="text-blue-600 font-medium whitespace-nowrap border-b-2 border-blue-600"
              >
                Projects
              </button>
              <button 
                onClick={() => navigate('/tasks')}
                className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap"
              >
                Tasks
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap"
              >
                Profile
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Role-Specific Projects Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderProjectsComponent()}
      </main>
    </div>
  );
};

export default Projects;