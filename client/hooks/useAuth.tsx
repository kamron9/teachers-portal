import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient, User } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    role: 'STUDENT' | 'TEACHER';
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user && apiClient.isAuthenticated();

  const fetchCurrentUser = async () => {
    try {
      if (apiClient.isAuthenticated()) {
        const currentUser = await apiClient.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      // Clear invalid tokens
      await apiClient.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.login(email, password);
      setUser(response.user);
      
      toast.success('Kirish muvaffaqiyatli');
      
      // Redirect based on role
      switch (response.user.role) {
        case 'TEACHER':
          navigate('/teacher-dashboard');
          break;
        case 'STUDENT':
          navigate('/student-dashboard');
          break;
        case 'ADMIN':
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Kirish xatosi');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    role: 'STUDENT' | 'TEACHER';
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await apiClient.register(data);
      setUser(response.user);
      
      toast.success('Ro\'yxatdan o\'tish muvaffaqiyatli');
      
      // Redirect based on role
      switch (response.user.role) {
        case 'TEACHER':
          navigate('/teacher-dashboard');
          break;
        case 'STUDENT':
          navigate('/student-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Ro\'yxatdan o\'tish xatosi');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
      toast.success('Chiqish muvaffaqiyatli');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      setUser(null);
      navigate('/');
    }
  };

  const refetch = async () => {
    await fetchCurrentUser();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Route protection HOCs
interface ProtectedRouteProps {
  children: ReactNode;
  roles?: ('STUDENT' | 'TEACHER' | 'ADMIN')[];
  requireVerification?: boolean;
  fallback?: ReactNode;
}

export function ProtectedRoute({ 
  children, 
  roles, 
  requireVerification = false,
  fallback 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Check role authorization
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Kirish taqiqlangan</h1>
          <p className="text-gray-600">Sizda ushbu sahifaga kirish huquqi yo'q</p>
        </div>
      </div>
    );
  }

  // Check verification requirement for teachers
  if (requireVerification && user.role === 'TEACHER') {
    // This would need to be expanded to check teacher verification status
    // For now, we'll allow access
  }

  return <>{children}</>;
}

// Hook for role-based UI
export function useRole() {
  const { user } = useAuth();
  
  return {
    isStudent: user?.role === 'STUDENT',
    isTeacher: user?.role === 'TEACHER',
    isAdmin: user?.role === 'ADMIN',
    role: user?.role,
  };
}

// Hook for verification status
export function useVerification() {
  const { user } = useAuth();
  
  // This would need to be expanded based on actual verification fields
  // For now, assume all users are verified
  return {
    isVerified: true,
    verificationStatus: 'APPROVED' as const,
    canReceiveBookings: true,
  };
}
