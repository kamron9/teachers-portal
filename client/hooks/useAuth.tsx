import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { mockCurrentUser, mockApi, MockUser } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Map MockUser to User type for compatibility
type User = MockUser;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    role: "student" | "teacher";
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

  const isAuthenticated = !!user && !!localStorage.getItem('authToken');

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        setUser(mockCurrentUser);
      }
    } catch (error) {
      // Clear invalid tokens on auth error
      localStorage.removeItem('authToken');
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
      const response = await mockApi.login(email, password);
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user);

      toast.success("Kirish muvaffaqiyatli");

      // Redirect based on role
      switch (response.data.user.role) {
        case "teacher":
          navigate("/teacher-dashboard");
          break;
        case "student":
          navigate("/student-dashboard");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Kirish xatosi");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    role: "student" | "teacher";
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    try {
      setIsLoading(true);
      // Simulate registration with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        profileImage: '/placeholder.svg',
        phoneNumber: data.phone,
        createdAt: new Date().toISOString()
      };
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('authToken', token);
      setUser(newUser);

      toast.success("Ro'yxatdan o'tish muvaffaqiyatli");

      // Redirect based on role
      switch (newUser.role) {
        case "teacher":
          navigate("/teacher-dashboard");
          break;
        case "student":
          navigate("/student-dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Ro'yxatdan o'tish xatosi");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Simulate logout delay
      await new Promise(resolve => setTimeout(resolve, 200));
      localStorage.removeItem('authToken');
      setUser(null);
      toast.success("Chiqish muvaffaqiyatli");
      navigate("/");
    } catch (error) {
      // Force logout even if API call fails
      localStorage.removeItem('authToken');
      setUser(null);
      navigate("/");
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Route protection HOCs
interface ProtectedRouteProps {
  children: ReactNode;
  roles?: ("student" | "teacher" | "admin")[];
  requireVerification?: boolean;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  roles,
  requireVerification = false,
  fallback,
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Kirish taqiqlangan
          </h1>
          <p className="text-gray-600">
            Sizda ushbu sahifaga kirish huquqi yo'q
          </p>
        </div>
      </div>
    );
  }

  // Check verification requirement for teachers
  if (requireVerification && user.role === "TEACHER") {
    // This would need to be expanded to check teacher verification status
    // For now, we'll allow access
  }

  return <>{children}</>;
}

// Hook for role-based UI
export function useRole() {
  const { user } = useAuth();

  return {
    isStudent: user?.role === "STUDENT",
    isTeacher: user?.role === "TEACHER",
    isAdmin: user?.role === "ADMIN",
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
    verificationStatus: "APPROVED" as const,
    canReceiveBookings: true,
  };
}
