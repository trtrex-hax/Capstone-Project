export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'research_lead' | 'team_member';
  department: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  researchLead: User;
  teamMembers: User[];
  status: 'active' | 'completed' | 'on_hold';
  createdAt: string;
  deadline?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assignedTo: User;
  status: 'pending' | 'in_progress' | 'completed';
  deadline: string;
  priority: 'low' | 'medium' | 'high';
}