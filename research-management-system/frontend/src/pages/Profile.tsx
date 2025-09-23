import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') as string;

  const [userData, setUserData] = useState({
    name: "Demo User",
    email: "demo@university.edu",
    department: "Computer Science",
    role: userRole,
    bio: "Research team member specializing in data analysis and machine learning applications.",
    phone: "+1 (555) 123-4567",
    joinDate: "2024-01-15"
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, you would save to backend here
  };

  const roleLabels = {
    admin: 'Administrator',
    research_lead: 'Research Lead',
    team_member: 'Team Member'
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
              <h1 className="text-xl font-semibold">User Profile</h1>
            </div>
            <div className="flex items-center space-x-4">
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

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-2xl font-bold">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <p className="text-blue-100">{userData.email}</p>
                <p className="text-blue-100">{roleLabels[userRole as keyof typeof roleLabels]}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded-md">{userData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded-md">{userData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userData.department}
                    onChange={(e) => setUserData({...userData, department: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded-md">{userData.department}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <p className="p-2 bg-gray-50 rounded-md">{roleLabels[userRole as keyof typeof roleLabels]}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={userData.bio}
                    onChange={(e) => setUserData({...userData, bio: e.target.value})}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded-md">{userData.bio}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded-md">{userData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <p className="p-2 bg-gray-50 rounded-md">{new Date(userData.joinDate).toLocaleDateString()}</p>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-gray-600">Projects Involved</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-green-600">45</div>
            <div className="text-gray-600">Tasks Completed</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-purple-600">98%</div>
            <div className="text-gray-600">On-Time Rate</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;