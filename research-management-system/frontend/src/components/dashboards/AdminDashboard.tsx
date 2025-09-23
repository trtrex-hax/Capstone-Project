import React, { useState } from 'react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analytics'>('overview');

  // Sample data
  const recentActivities = [
    { id: 1, action: 'New user registered', user: 'Alice Johnson', time: '2 min ago', type: 'user' },
    { id: 2, action: 'Project created', user: 'Dr. Smith', time: '15 min ago', type: 'project' },
    { id: 3, action: 'Task completed', user: 'Bob Wilson', time: '1 hour ago', type: 'task' },
    { id: 4, action: 'System backup completed', user: 'System', time: '2 hours ago', type: 'system' }
  ];

  const systemHealth = {
    database: 95,
    storage: 78,
    performance: 92,
    uptime: 99.9
  };

  const pendingActions = [
    { id: 1, type: 'User Approval', description: '3 new users waiting approval', priority: 'high' },
    { id: 2, type: 'Project Review', description: '2 projects need admin review', priority: 'medium' },
    { id: 3, type: 'System Update', description: 'Security patch available', priority: 'high' }
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Header with Tabs */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'users' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'analytics' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Analytics
              </button>
            </div>
          </div>

          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-2">Pending Approvals</h3>
                  <p className="text-3xl font-bold text-red-600">5</p>
                  <p className="text-sm text-red-600 mt-1">Requires immediate attention</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Active Projects</h3>
                  <p className="text-3xl font-bold text-blue-600">12</p>
                  <p className="text-sm text-blue-600 mt-1">Across 3 departments</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">System Health</h3>
                  <p className="text-3xl font-bold text-green-600">92%</p>
                  <p className="text-sm text-green-600 mt-1">All systems operational</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-2">Team Members</h3>
                  <p className="text-3xl font-bold text-purple-600">24</p>
                  <p className="text-sm text-purple-600 mt-1">5 research leads</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Pending Actions */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-3">⚠️ Pending Actions</h3>
                  <div className="space-y-2">
                    {pendingActions.map((action) => (
                      <div key={action.id} className="flex justify-between items-center p-2 bg-white rounded">
                        <div>
                          <span className="font-medium">{action.type}</span>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          action.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {action.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Health */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-3">📊 System Health</h3>
                  <div className="space-y-3">
                    {Object.entries(systemHealth).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{key}</span>
                          <span>{value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              value > 90 ? 'bg-green-500' : value > 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">📈 Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className={`w-2 h-2 rounded-full ${
                        activity.type === 'user' ? 'bg-green-500' :
                        activity.type === 'project' ? 'bg-blue-500' :
                        activity.type === 'task' ? 'bg-purple-500' : 'bg-gray-500'
                      }`}></span>
                      <div className="flex-1">
                        <span className="font-medium">{activity.action}</span>
                        <span className="text-gray-600"> by {activity.user}</span>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">👥 User Management</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                      <td className="px-6 py-4 whitespace-nowrap">john@university.edu</td>
                      <td className="px-6 py-4 whitespace-nowrap">Research Lead</td>
                      <td className="px-6 py-4 whitespace-nowrap">Computer Science</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                        <button className="text-red-600 hover:text-red-800">Remove</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">Jane Smith</td>
                      <td className="px-6 py-4 whitespace-nowrap">jane@university.edu</td>
                      <td className="px-6 py-4 whitespace-nowrap">Team Member</td>
                      <td className="px-6 py-4 whitespace-nowrap">Biology</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-green-600 hover:text-green-800 mr-2">Approve</button>
                        <button className="text-red-600 hover:text-red-800">Reject</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">📊 System Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Project Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Active Projects</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed Projects</span>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span>On Hold</span>
                      <span className="font-medium">3</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">User Activity</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Active Users (30 days)</span>
                      <span className="font-medium">18</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tasks Completed</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Response Time</span>
                      <span className="font-medium">2.3s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;