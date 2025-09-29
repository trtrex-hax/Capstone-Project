import React from 'react';

const AdminTasks: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Tasks View</h2>
        <p className="text-gray-600">System-wide task management</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-semibold text-blue-800">Total Tasks</p>
            <p className="text-2xl font-bold">156</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-semibold text-green-800">Completed</p>
            <p className="text-2xl font-bold">89</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="font-semibold text-yellow-800">In Progress</p>
            <p className="text-2xl font-bold">42</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="font-semibold text-red-800">Overdue</p>
            <p className="text-2xl font-bold">15</p>
          </div>
        </div>
        
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">All System Tasks</h3>
          <p className="text-gray-600">Monitor tasks across all projects and departments</p>
        </div>
      </div>
    </div>
  );
};

export default AdminTasks;