import {
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  mockApi,
  MockTeacher,
  MockSubject,
  MockBooking,
  MockNotification,
} from "@/lib/mockData";

// Query Keys for mock data
export const mockQueryKeys = {
  teacherSearch: (params: any) => ["mock-teacher", "search", params] as const,
  subjects: (params?: any) => ["mock-subjects", params] as const,
  notifications: (params?: any) => ["mock-notifications", params] as const,
  bookings: (params?: any) => ["mock-bookings", params] as const,
} as const;

// Teacher Search Hook with Mock Data
export function useTeacherSearch(
  params: {
    query?: string;
    subjects?: string[];
    minRating?: number;
    maxRating?: number;
    minPrice?: number;
    maxPrice?: number;
    experienceLevel?: string[];
    availability?: string;
    location?: string;
    languages?: string[];
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {},
  options?: Partial<UseQueryOptions>,
) {
  return useQuery({
    queryKey: mockQueryKeys.teacherSearch(params),
    queryFn: () => mockApi.getTeachers({
      limit: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      subject: params.subjects?.[0],
      language: params.languages?.[0],
      priceFrom: params.minPrice?.toString(),
      priceTo: params.maxPrice?.toString(),
    }).then(response => ({
      teachers: response.data.data,
      total: response.data.total,
      page: response.data.page,
      totalPages: response.data.totalPages
    })),
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

// Subjects Hook with Mock Data
export function useSubjects(
  params?: {
    query?: string;
    category?: string;
    isActive?: boolean;
    includeTeacherCount?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  },
  options?: Partial<UseQueryOptions>,
) {
  return useQuery({
    queryKey: mockQueryKeys.subjects(params),
    queryFn: () => mockApi.getSubjects(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options,
  });
}

// Notifications Hook with Mock Data
export function useNotifications(
  params?: {
    type?: string;
    isRead?: boolean;
    priority?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  },
  options?: Partial<UseQueryOptions>,
) {
  return useQuery({
    queryKey: mockQueryKeys.notifications(params),
    queryFn: () => mockApi.getNotifications(params),
    staleTime: 1000 * 30, // 30 seconds
    ...options,
  });
}

// Bookings Hook with Mock Data
export function useBookings(
  params?: {
    status?: string[];
    teacherId?: string;
    studentId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  },
  options?: Partial<UseQueryOptions>,
) {
  return useQuery({
    queryKey: mockQueryKeys.bookings(params),
    queryFn: () => mockApi.getBookings(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
}

// Teacher by ID Hook
export function useTeacherById(id: string, enabled = true) {
  return useQuery({
    queryKey: ["mock-teacher", "byId", id],
    queryFn: async () => {
      const response = await mockApi.getTeachers();
      const teacher = response.data.data.find(t => t.id === id);
      if (!teacher) throw new Error("Teacher not found");
      return teacher;
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Subject by ID Hook
export function useSubjectById(id: string, enabled = true) {
  return useQuery({
    queryKey: ["mock-subject", "byId", id],
    queryFn: async () => {
      const response = await mockApi.getSubjects();
      const subject = response.data.subjects.find(s => s.id === id);
      if (!subject) throw new Error("Subject not found");
      return subject;
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
