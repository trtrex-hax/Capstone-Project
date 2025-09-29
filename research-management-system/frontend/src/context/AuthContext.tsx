import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import axios from 'axios';

type UserRole = 'admin' | 'research_lead' | 'team_member';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isResearchLead: boolean; // includes admin for convenience
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

// Helpers to set/clear the Authorization header globally on api instance
const setAuthHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On app start, try to restore session from token
  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setAuthHeader(null);
          setUser(null);
          return;
        }
        setAuthHeader(token);
        const res = await api.get('/auth/me'); // token is on default header
        if (res.data?.success) {
          setUser(res.data.data as User);
        } else {
          localStorage.removeItem('token');
          setAuthHeader(null);
          setUser(null);
        }
      } catch {
        localStorage.removeItem('token');
        setAuthHeader(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        const { token, ...u } = res.data.data;
        localStorage.setItem('token', token);
        setAuthHeader(token);
        setUser(u as User);
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return { success: false, message: err.response?.data?.message || 'Login failed' };
      }
      return { success: false, message: 'Login failed' };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await api.post('/auth/register', data);
      if (res.data?.success) {
        const { token, ...u } = res.data.data;
        localStorage.setItem('token', token);
        setAuthHeader(token);
        setUser(u as User);
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Registration failed' };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return { success: false, message: err.response?.data?.message || 'Registration failed' };
      }
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthHeader(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    // Treat admin as lead for convenience in UI that should be visible to both
    isResearchLead: user?.role === 'research_lead' || user?.role === 'admin',
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};