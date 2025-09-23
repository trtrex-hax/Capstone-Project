// AuthContext.tsx
import React, { createContext, useContext } from 'react';

type UserRole = 'admin' | 'research_lead' | 'team_member';

interface AuthContextType {
  userRole: UserRole;
  userName: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode; role: UserRole; name: string }> = ({ 
  children, 
  role, 
  name 
}) => {
  return (
    <AuthContext.Provider value={{ userRole: role, userName: name }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};