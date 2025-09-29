// types/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'research_lead' | 'team_member';
  // ... other user properties
}

// Then update AuthContextType:
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}