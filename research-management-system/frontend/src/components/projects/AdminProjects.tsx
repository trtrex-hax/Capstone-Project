import React from 'react';

const AdminProjects: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Projects View</h2>
        <p className="text-gray-600">System-wide project management</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">Admin Projects Dashboard</h3>
          <p className="text-gray-600">View and manage all projects across the system</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold">Total Projects</p>
              <p className="text-2xl">12</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-semibold">Active Projects</p>
              <p className="text-2xl">8</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="font-semibold">Departments</p>
              <p className="text-2xl">5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;