// src/components/common/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: Array<'admin' | 'research_lead' | 'team_member'>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles && user && !roles.includes(user.role)) {
    return <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">403 – Forbidden</h2>
      <p className="text-gray-600">You do not have permission to access this page.</p>
    </div>;
  }

  return <>{children}</>;
};

export default PrivateRoute;