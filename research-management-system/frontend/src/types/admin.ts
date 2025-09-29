export interface SystemHealth {
  database: {
    status: string;
    responseTime: string;
    connections: number;
    performance: number;
  };
  storage: {
    total: string;
    used: string;
    available: string;
    performance: number;
  };
  api: {
    uptime: string;
    responseTime: string;
    errorRate: string;
    performance: number;
  };
  overall: {
    status: string;
    performance: number;
  };
}

export interface DashboardStats {
  users: {
    total: number;
    pending: number;
    active: number;
    researchLeads: number;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    onHold: number;
  };
  tasks: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
}

export interface PendingAction {
  id: number;
  type: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  count: number;
}

export interface Activity {
  id: string;
  action: string;
  user: string;
  type: string;
  time: string;
  metadata?: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'pending' | 'inactive';
  lastActive: string;
}

export interface Analytics {
  projectDistribution: {
    active: number;
    completed: number;
    onHold: number;
  };
  userActivity: {
    activeUsers30Days: number;
    tasksCompleted: number;
    newProjects: number;
  };
  departmentStats: Array<{
    _id: string;
    count: number;
  }>;
}