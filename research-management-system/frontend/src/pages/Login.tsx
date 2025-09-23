import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type UserRole = 'admin' | 'research_lead' | 'team_member';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('team_member');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Store the selected role for dashboard access
  localStorage.setItem('userRole', selectedRole);
  
  // Navigate to dashboard
  navigate('/dashboard');
};

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const roleConfig = {
    admin: { label: 'Admin', color: 'bg-red-100 text-red-800 border-red-300' },
    research_lead: { label: 'Lead', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    team_member: { label: 'Member', color: 'bg-green-100 text-green-800 border-green-300' }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Research Management System
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Role Selection Section - Horizontal Layout */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Your Role
              </label>
              <div className="flex gap-2">
                {(['admin', 'research_lead', 'team_member'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`flex-1 p-2 text-center rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                      selectedRole === role 
                        ? `${roleConfig[role].color} border-current font-semibold transform scale-105`
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      {selectedRole === role && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span>{roleConfig[role].label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in as {roleConfig[selectedRole].label}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Demo: Select your role and click "Sign in" to continue</p>
            <p className="mt-1 text-xs">Current selection: <span className="font-medium">{roleConfig[selectedRole].label}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;