import React from 'react';
import { useNavigate } from 'react-router-dom';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') as string;

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const projects = [
    {
      id: 1,
      title: "AI Research Project",
      description: "Exploring machine learning applications in healthcare",
      status: "active",
      progress: 65,
      teamMembers: 5,
      deadline: "2024-12-31",
      lead: "Dr. Smith"
    },
    {
      id: 2,
      title: "Climate Change Study",
      description: "Environmental impact analysis of urban areas",
      status: "in progress",
      progress: 40,
      teamMembers: 3,
      deadline: "2024-11-15",
      lead: "Dr. Johnson"
    },
    {
      id: 3,
      title: "Renewable Energy Research",
      description: "Solar panel efficiency optimization",
      status: "planning",
      progress: 20,
      teamMembers: 4,
      deadline: "2025-02-28",
      lead: "Dr. Williams"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold">Projects Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Demo User</span>
              <button 
                onClick={handleLogout}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Research Projects</h2>
          {userRole === 'research_lead' || userRole === 'admin' ? (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Create New Project
            </button>
          ) : null}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'in progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Team: {project.teamMembers} members</span>
                    <span>Lead: {project.lead}</span>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-blue-50 text-blue-600 py-2 rounded text-sm hover:bg-blue-100">
                    View Details
                  </button>
                  <button className="flex-1 bg-gray-50 text-gray-600 py-2 rounded text-sm hover:bg-gray-100">
                    Tasks
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Projects;