import React, { useState } from 'react';

const ResearchLeadDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'team' | 'reviews'>('overview');

  // Sample data
  const projects = [
    { id: 1, name: 'AI Research Project', progress: 65, status: 'active', teamSize: 5, deadline: '2024-12-31' },
    { id: 2, name: 'Climate Change Study', progress: 40, status: 'active', teamSize: 3, deadline: '2024-11-15' },
    { id: 3, name: 'Renewable Energy', progress: 20, status: 'planning', teamSize: 4, deadline: '2025-02-28' }
  ];

  const pendingReviews = [
    { id: 1, type: 'Task Submission', project: 'AI Research', member: 'Alice Chen', submitted: '2 hours ago' },
    { id: 2, type: 'Progress Report', project: 'Climate Study', member: 'Bob Wilson', submitted: '1 day ago' },
    { id: 3, type: 'Methodology', project: 'Renewable Energy', member: 'Carol Davis', submitted: '3 days ago' }
  ];

  const teamMembers = [
    { id: 1, name: 'Alice Chen', role: 'Data Analyst', tasks: 8, completed: 5, performance: 'excellent' },
    { id: 2, name: 'Bob Wilson', role: 'Researcher', tasks: 6, completed: 3, performance: 'good' },
    { id: 3, name: 'Carol Davis', role: 'Lab Technician', tasks: 4, completed: 2, performance: 'average' }
  ];

  const recentActivity = [
    { id: 1, action: 'Task completed', project: 'AI Research', member: 'Alice Chen', time: '30 min ago' },
    { id: 2, action: 'New data uploaded', project: 'Climate Study', member: 'Bob Wilson', time: '2 hours ago' },
    { id: 3, action: 'Experiment started', project: 'Renewable Energy', member: 'Carol Davis', time: '4 hours ago' }
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Header with Tabs */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Research Lead Dashboard</h2>
              <p className="text-gray-600">Manage your research projects and team</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              + New Project
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'projects' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🔬 Projects
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'team' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👥 Team
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'reviews' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ⏰ Reviews
            </button>
          </div>

          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Active Projects</h3>
                  <p className="text-3xl font-bold text-green-600">4</p>
                  <p className="text-sm text-green-600 mt-1">2 nearing deadline</p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-800 mb-2">Pending Reviews</h3>
                  <p className="text-3xl font-bold text-yellow-600">7</p>
                  <p className="text-sm text-yellow-600 mt-1">3 high priority</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Team Members</h3>
                  <p className="text-3xl font-bold text-blue-600">8</p>
                  <p className="text-sm text-blue-600 mt-1">All active</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-2">Tasks Completed</h3>
                  <p className="text-3xl font-bold text-purple-600">42</p>
                  <p className="text-sm text-purple-600 mt-1">This month</p>
                </div>
              </div>

              {/* Quick Overview Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Project Progress */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">🚀 Project Progress</h3>
                  <div className="space-y-3">
                    {projects.map(project => (
                      <div key={project.id} className="bg-white p-3 rounded">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{project.name}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
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
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">📝 Recent Activity</h3>
                  <div className="space-y-2">
                    {recentActivity.map(activity => (
                      <div key={activity.id} className="flex items-center space-x-3 p-2 bg-white rounded">
                        <div className="flex-1">
                          <span className="font-medium">{activity.action}</span>
                          <p className="text-sm text-gray-600">{activity.project} • {activity.member}</p>
                        </div>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'projects' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">🔬 Your Research Projects</h3>
              <div className="space-y-4">
                {projects.map(project => (
                  <div key={project.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-lg">{project.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Progress:</span> {project.progress}%
                      </div>
                      <div>
                        <span className="font-medium">Team:</span> {project.teamSize} members
                      </div>
                      <div>
                        <span className="font-medium">Deadline:</span> {new Date(project.deadline).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200">
                        View Details
                      </button>
                      <button className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200">
                        Manage Team
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200">
                        Reports
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">👥 Team Management</h3>
              <div className="space-y-4">
                {teamMembers.map(member => (
                  <div key={member.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-lg">{member.name}</h4>
                        <p className="text-gray-600">{member.role}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        member.performance === 'excellent' ? 'bg-green-100 text-green-800' :
                        member.performance === 'good' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {member.performance}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Tasks:</span> {member.tasks} assigned
                      </div>
                      <div>
                        <span className="font-medium">Completed:</span> {member.completed}
                      </div>
                      <div>
                        <span className="font-medium">Progress:</span> {Math.round((member.completed / member.tasks) * 100)}%
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200">
                        Assign Task
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200">
                        View Profile
                      </button>
                      <button className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200">
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">⏰ Pending Reviews & Approvals</h3>
              <div className="space-y-4">
                {pendingReviews.map(review => (
                  <div key={review.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-lg">{review.type}</h4>
                        <p className="text-gray-600">{review.project} • {review.member}</p>
                      </div>
                      <span className="text-sm text-gray-500">{review.submitted}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200">
                        ✅ Approve
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200">
                        ❌ Reject
                      </button>
                      <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200">
                        👁️ Preview
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200">
                        💬 Request Changes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResearchLeadDashboard;