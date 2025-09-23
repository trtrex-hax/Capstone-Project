import React, { useState } from 'react';

const TeamMemberDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'projects' | 'resources'>('overview');

  // Sample data
  const tasks = [
    { 
      id: 1, 
      title: 'Literature Review', 
      project: 'AI Ethics Research', 
      dueDate: '2024-05-10', 
      status: 'in-progress', 
      priority: 'high',
      description: 'Review recent publications on AI ethics and bias mitigation techniques',
      estimatedHours: 16,
      timeSpent: 8
    },
    { 
      id: 2, 
      title: 'Data Collection', 
      project: 'Climate Data Analysis', 
      dueDate: '2024-05-15', 
      status: 'not-started', 
      priority: 'medium',
      description: 'Gather climate data from NOAA databases for analysis',
      estimatedHours: 20,
      timeSpent: 0
    },
    { 
      id: 3, 
      title: 'Methodology Draft', 
      project: 'AI Ethics Research', 
      dueDate: '2024-05-08', 
      status: 'completed', 
      priority: 'high',
      description: 'Draft research methodology section for paper submission',
      estimatedHours: 12,
      timeSpent: 14
    },
    { 
      id: 4, 
      title: 'Experiment Setup', 
      project: 'Renewable Energy Study', 
      dueDate: '2024-05-20', 
      status: 'in-progress', 
      priority: 'low',
      description: 'Prepare laboratory equipment for energy efficiency testing',
      estimatedHours: 8,
      timeSpent: 3
    }
  ];

  const projects = [
    {
      id: 1,
      name: 'AI Ethics Research',
      lead: 'Dr. Smith',
      deadline: '2024-06-30',
      status: 'active',
      progress: 60,
      myTasks: 3,
      completedTasks: 1
    },
    {
      id: 2,
      name: 'Climate Data Analysis',
      lead: 'Prof. Johnson',
      deadline: '2024-07-15',
      status: 'draft',
      progress: 25,
      myTasks: 2,
      completedTasks: 0
    },
    {
      id: 3,
      name: 'Renewable Energy Study',
      lead: 'Dr. Williams',
      deadline: '2024-08-30',
      status: 'active',
      progress: 40,
      myTasks: 1,
      completedTasks: 0
    }
  ];

  const upcomingDeadlines = [
    { id: 1, task: 'Literature Review', due: '2024-05-10', project: 'AI Ethics Research', priority: 'high' },
    { id: 2, task: 'Data Collection', due: '2024-05-15', project: 'Climate Data Analysis', priority: 'medium' },
    { id: 3, task: 'Progress Report', due: '2024-05-12', project: 'AI Ethics Research', priority: 'medium' }
  ];

  const recentActivity = [
    { id: 1, action: 'Submitted methodology draft', project: 'AI Ethics Research', time: '2 hours ago' },
    { id: 2, action: 'Received feedback from Dr. Smith', project: 'AI Ethics Research', time: '1 day ago' },
    { id: 3, action: 'Joined project team', project: 'Renewable Energy Study', time: '3 days ago' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'not-started': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Header with Welcome */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">My Dashboard</h2>
              <p className="text-gray-600">Welcome back! Here's your current workload overview.</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              + New Submission
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
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'tasks' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ✅ Tasks
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
              onClick={() => setActiveTab('resources')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'resources' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📚 Resources
            </button>
          </div>

          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Assigned Tasks</h3>
                  <p className="text-3xl font-bold text-blue-600">8</p>
                  <p className="text-sm text-blue-600 mt-1">3 high priority</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-2">Completed</h3>
                  <p className="text-3xl font-bold text-purple-600">12</p>
                  <p className="text-sm text-purple-600 mt-1">This month</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Upcoming Deadlines</h3>
                  <p className="text-3xl font-bold text-green-600">3</p>
                  <p className="text-sm text-green-600 mt-1">Next 7 days</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-800 mb-2">Active Projects</h3>
                  <p className="text-3xl font-bold text-orange-600">3</p>
                  <p className="text-sm text-orange-600 mt-1">2 research leads</p>
                </div>
              </div>

              {/* Quick Overview Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Upcoming Deadlines */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-3">⏰ Upcoming Deadlines</h3>
                  <div className="space-y-2">
                    {upcomingDeadlines.map(deadline => (
                      <div key={deadline.id} className="flex justify-between items-center p-2 bg-white rounded">
                        <div>
                          <span className="font-medium">{deadline.task}</span>
                          <p className="text-sm text-gray-600">{deadline.project}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">{new Date(deadline.due).toLocaleDateString()}</span>
                          <span className={`block text-xs ${getPriorityColor(deadline.priority)} px-2 py-1 rounded-full mt-1`}>
                            {deadline.priority} priority
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-3">📝 Recent Activity</h3>
                  <div className="space-y-2">
                    {recentActivity.map(activity => (
                      <div key={activity.id} className="flex items-center space-x-3 p-2 bg-white rounded">
                        <div className="flex-1">
                          <span className="font-medium">{activity.action}</span>
                          <p className="text-sm text-gray-600">{activity.project}</p>
                        </div>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">🚀 Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <button className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    📤 Submit Work
                  </button>
                  <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    💬 Request Feedback
                  </button>
                  <button className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    📊 Progress Report
                  </button>
                  <button className="p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                    🆘 Get Help
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'tasks' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">✅ My Tasks</h3>
              <div className="space-y-4">
                {tasks.map(task => (
                  <div key={task.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{task.title}</h4>
                        <p className="text-gray-600">{task.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                            {task.status.replace('-', ' ')}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority} priority
                          </span>
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                            {task.project}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {task.timeSpent}h / {task.estimatedHours}h
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex-1 mr-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              task.status === 'completed' ? 'bg-green-500' : 
                              task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                            style={{ width: `${(task.timeSpent / task.estimatedHours) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {task.status === 'completed' ? (
                          <button className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm" disabled>
                            ✅ Submitted
                          </button>
                        ) : task.status === 'in-progress' ? (
                          <>
                            <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200">
                              📝 Update
                            </button>
                            <button className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200">
                              ✅ Complete
                            </button>
                          </>
                        ) : (
                          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                            🚀 Start Task
                          </button>
                        )}
                        <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200">
                          💬 Discuss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">🔬 My Projects</h3>
              <div className="space-y-4">
                {projects.map(project => (
                  <div key={project.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-lg">{project.name}</h4>
                        <p className="text-gray-600">Lead: {project.lead} | Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">My Tasks:</span> {project.myTasks}
                      </div>
                      <div>
                        <span className="font-medium">Completed:</span> {project.completedTasks}
                      </div>
                      <div>
                        <span className="font-medium">Progress:</span> {Math.round((project.completedTasks / project.myTasks) * 100)}%
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200">
                        View Details
                      </button>
                      <button className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200">
                        Team Discussion
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200">
                        Project Files
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">📚 Resources & Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">🔗 Quick Links</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left p-2 bg-white rounded hover:bg-blue-50">
                      📄 Research Guidelines
                    </button>
                    <button className="w-full text-left p-2 bg-white rounded hover:bg-blue-50">
                      📊 Data Analysis Tools
                    </button>
                    <button className="w-full text-left p-2 bg-white rounded hover:bg-blue-50">
                      📚 Literature Database
                    </button>
                    <button className="w-full text-left p-2 bg-white rounded hover:bg-blue-50">
                      💬 Team Collaboration
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">🛠️ Useful Tools</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left p-2 bg-white rounded hover:bg-blue-50">
                      ⏱️ Time Tracker
                    </button>
                    <button className="w-full text-left p-2 bg-white rounded hover:bg-blue-50">
                      📋 Task Planner
                    </button>
                    <button className="w-full text-left p-2 bg-white rounded hover:bg-blue-50">
                      📈 Progress Charts
                    </button>
                    <button className="w-full text-left p-2 bg-white rounded hover:bg-blue-50">
                      📧 Contact Leads
                    </button>
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

export default TeamMemberDashboard;