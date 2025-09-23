import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import ResearchLeadDashboard from '../components/dashboards/ResearchLeadDashboard';
import TeamMemberDashboard from '../components/dashboards/TeamMemberDashboard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'team_member';
  const userName = "Demo User";

  const roleLabels = {
    admin: 'Administrator',
    research_lead: 'Research Lead', 
    team_member: 'Team Member'
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'research_lead':
        return <ResearchLeadDashboard />;
      case 'team_member':
        return <TeamMemberDashboard />;
      default:
        return <TeamMemberDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold">Research Management System</h1>
              <div className="hidden md:flex space-x-4">
                <button onClick={() => navigate('/dashboard')} className="text-gray-700 hover:text-blue-600 font-medium">
                  Dashboard
                </button>
                <button onClick={() => navigate('/projects')} className="text-gray-700 hover:text-blue-600 font-medium">
                  Projects
                </button>
                <button onClick={() => navigate('/tasks')} className="text-gray-700 hover:text-blue-600 font-medium">
                  Tasks
                </button>
                <button onClick={() => navigate('/profile')} className="text-gray-700 hover:text-blue-600 font-medium">
                  Profile
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {userName}</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {roleLabels[userRole as keyof typeof roleLabels]}
              </span>
              <button onClick={handleLogout} className="text-blue-600 hover:text-blue-800 font-medium">
                Logout
              </button>
            </div>
          </div>
          
          <div className="md:hidden border-t pt-4 pb-2">
            <div className="flex space-x-4 overflow-x-auto">
              <button onClick={() => navigate('/dashboard')} className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap">
                Dashboard
              </button>
              <button onClick={() => navigate('/projects')} className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap">
                Projects
              </button>
              <button onClick={() => navigate('/tasks')} className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap">
                Tasks
              </button>
              <button onClick={() => navigate('/profile')} className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap">
                Profile
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Dashboard;