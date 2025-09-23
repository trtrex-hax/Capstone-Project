import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type TaskStatus = 'pending' | 'in progress' | 'completed';

interface Task {
  id: number;
  title: string;
  description: string;
  project: string;
  assignedTo: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  createdAt: string;
}

const Tasks: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') as string;
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const tasks: Task[] = [
    {
      id: 1,
      title: "Data Analysis",
      description: "Analyze collected survey data using statistical methods",
      project: "AI Research Project",
      assignedTo: "John Doe",
      status: "in progress",
      priority: "high",
      deadline: "2024-10-15",
      createdAt: "2024-09-01"
    },
    {
      id: 2,
      title: "Literature Review",
      description: "Review recent publications on machine learning applications",
      project: "AI Research Project",
      assignedTo: "Jane Smith",
      status: "completed",
      priority: "medium",
      deadline: "2024-09-30",
      createdAt: "2024-08-15"
    },
    {
      id: 3,
      title: "Methodology Documentation",
      description: "Document research methodology and procedures",
      project: "Climate Change Study",
      assignedTo: "Bob Wilson",
      status: "pending",
      priority: "medium",
      deadline: "2024-11-01",
      createdAt: "2024-09-10"
    },
    {
      id: 4,
      title: "Experiment Setup",
      description: "Prepare laboratory equipment for testing",
      project: "Renewable Energy Research",
      assignedTo: "Alice Brown",
      status: "in progress",
      priority: "high",
      deadline: "2024-10-20",
      createdAt: "2024-09-05"
    }
  ];

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filterStatus);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <h1 className="text-xl font-semibold">Task Management</h1>
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
          <h2 className="text-2xl font-bold">Tasks</h2>
          {userRole === 'research_lead' || userRole === 'admin' ? (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Create New Task
            </button>
          ) : null}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded ${
                filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded ${
                filterStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('in progress')}
              className={`px-4 py-2 rounded ${
                filterStatus === 'in progress' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded ${
                filterStatus === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority} priority
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Project:</span> {task.project}
                </div>
                <div>
                  <span className="font-medium">Assigned to:</span> {task.assignedTo}
                </div>
                <div>
                  <span className="font-medium">Deadline:</span> {new Date(task.deadline).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    Update Status
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm">
                    View Details
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

export default Tasks;