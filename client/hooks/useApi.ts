import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  apiClient,
  TeacherProfile,
  StudentProfile,
  SubjectOffering,
  AvailabilityRule,
  AvailabilitySlot,
  Booking,
  Payment,
  Review,
  MessageThread,
  Message,
  Notification,
  PaginatedResponse,
  ApiError,
} from "@/lib/api";
import { toast } from "sonner";

// Query Keys
export const queryKeys = {
  // Auth
  currentUser: ["auth", "currentUser"] as const,

  // Teachers
  teacherProfile: ["teacher", "profile"] as const,
  teacherById: (id: string) => ["teacher", "byId", id] as const,
  teacherSearch: (params: any) => ["teacher", "search", params] as const,

  // Students
  studentProfile: ["student", "profile"] as const,

  // Subjects
  subjects: (params?: any) => ["subjects", params] as const,

  // Subject Offerings
  subjectOfferings: ["subjectOfferings"] as const,

  // Availability
  availability: (teacherId: string, startDate?: string, endDate?: string) =>
    ["availability", teacherId, startDate, endDate] as const,
  availableSlots: (teacherId: string, params: any) =>
    ["availability", "slots", teacherId, params] as const,

  // Bookings
  bookings: (params?: any) => ["bookings", params] as const,
  booking: (id: string) => ["booking", id] as const,

  // Payments
  payments: (params?: any) => ["payments", params] as const,
  payment: (id: string) => ["payment", id] as const,

  // Reviews
  teacherReviews: (teacherId: string, params?: any) =>
    ["reviews", "teacher", teacherId, params] as const,

  // Messages
  messageThreads: (params?: any) => ["messages", "threads", params] as const,
  messageThread: (threadId: string, params?: any) =>
    ["messages", "thread", threadId, params] as const,

  // Notifications
  notifications: (params?: any) => ["notifications", params] as const,

  // Search
  universalSearch: (params: any) => ["search", "universal", params] as const,
} as const;

// Teacher Profile Hooks
export function useTeacherProfile() {
  return useQuery({
    queryKey: queryKeys.teacherProfile,
    queryFn: () => apiClient.getTeacherProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useTeacherById(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.teacherById(id),
    queryFn: () => apiClient.getTeacherById(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useUpdateTeacherProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TeacherProfile>) =>
      apiClient.updateTeacherProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.teacherProfile, data);
      queryClient.invalidateQueries({ queryKey: ["teacher"] });
      toast.success("Profil muvaffaqiyatli yangilandi");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Profil yangilanmadi");
    },
  });
}

// Student Profile Hooks
export function useStudentProfile() {
  return useQuery({
    queryKey: queryKeys.studentProfile,
    queryFn: () => apiClient.getStudentProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<StudentProfile>) =>
      apiClient.updateStudentProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.studentProfile, data);
      toast.success("Profil muvaffaqiyatli yangilandi");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Profil yangilanmadi");
    },
  });
}

// Teacher Search Hook
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
  },
  options?: Partial<UseQueryOptions>,
) {
  return useQuery({
    queryKey: queryKeys.teacherSearch(params),
    queryFn: () => apiClient.searchTeachers(params),
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 400 errors (bad request)
      if (error?.status === 400) return false;
      return failureCount < 3;
    },
    ...options,
  });
}

// Subjects Hooks
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
    queryKey: queryKeys.subjects(params),
    queryFn: () => apiClient.getSubjects(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.status === 400) return false;
      return failureCount < 3;
    },
    ...options,
  });
}

// Subject Offerings Hooks
export function useSubjectOfferings() {
  return useQuery({
    queryKey: queryKeys.subjectOfferings,
    queryFn: () => apiClient.getSubjectOfferings(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateSubjectOffering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<
        SubjectOffering,
        "id" | "teacherId" | "createdAt" | "updatedAt"
      >,
    ) => apiClient.createSubjectOffering(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjectOfferings });
      queryClient.invalidateQueries({ queryKey: ["teacher"] });
      toast.success("Yangi fan qo'shildi");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Fan qo'shilmadi");
    },
  });
}

export function useUpdateSubjectOffering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<SubjectOffering>;
    }) => apiClient.updateSubjectOffering(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjectOfferings });
      queryClient.invalidateQueries({ queryKey: ["teacher"] });
      toast.success("Fan ma'lumotlari yangilandi");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Fan yangilanmadi");
    },
  });
}

export function useDeleteSubjectOffering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteSubjectOffering(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjectOfferings });
      queryClient.invalidateQueries({ queryKey: ["teacher"] });
      toast.success("Fan o'chirildi");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Fan o'chirilmadi");
    },
  });
}

export function useReorderSubjectOfferings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (offerings: { id: string; orderIndex: number }[]) =>
      apiClient.reorderSubjectOfferings(offerings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjectOfferings });
      queryClient.invalidateQueries({ queryKey: ["teacher"] });
      toast.success("Fanlar tartibi o'zgartirildi");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Tartib o'zgartirilmadi");
    },
  });
}

// Availability Hooks
export function useAvailability(
  teacherId: string,
  startDate?: string,
  endDate?: string,
) {
  return useQuery({
    queryKey: queryKeys.availability(teacherId, startDate, endDate),
    queryFn: () => apiClient.getAvailability(teacherId, startDate, endDate),
    enabled: !!teacherId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useAvailableSlots(
  teacherId: string,
  params: {
    startDate: string;
    endDate: string;
    timezone?: string;
    duration?: number;
    subjectOfferingId?: string;
  },
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.availableSlots(teacherId, params),
    queryFn: () => apiClient.getAvailableSlots(teacherId, params),
    enabled: enabled && !!teacherId && !!params.startDate && !!params.endDate,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useCreateAvailabilityRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rule: Omit<AvailabilityRule, "id">) =>
      apiClient.createAvailabilityRule(rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success("Vaqt jadvali qo'shildi");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Vaqt jadvali qo'shilmadi");
    },
  });
}

export function useUpdateAvailabilityRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<AvailabilityRule>;
    }) => apiClient.updateAvailabilityRule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success("Vaqt jadvali yangilandi");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Vaqt jadvali yangilanmadi");
    },
  });
}

export function useDeleteAvailabilityRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteAvailabilityRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success("Vaqt jadvali o'chirildi");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Vaqt jadvali o'chirilmadi");
    },
  });
}

export function useBulkUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      rules,
      replaceExisting,
    }: {
      rules: Array<Omit<AvailabilityRule, "id">>;
      replaceExisting?: boolean;
    }) => apiClient.bulkUpdateAvailability(rules, replaceExisting),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success("Vaqt jadvali ommaviy yangilandi");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Ommaviy yangilashda xato");
    },
  });
}

export function useTeacherSchedule(
  teacherId: string,
  startDate: string,
  endDate: string,
  timezone: string = "Asia/Tashkent"
) {
  return useQuery({
    queryKey: ["schedule", teacherId, startDate, endDate, timezone],
    queryFn: () => apiClient.getTeacherSchedule(teacherId, startDate, endDate, timezone),
    enabled: !!teacherId && !!startDate && !!endDate,
  });
}

// Booking Hooks
export function useBookings(params?: {
  status?: string[];
  type?: string[];
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  return useQuery({
    queryKey: queryKeys.bookings(params),
    queryFn: () => apiClient.getBookings(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useBooking(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.booking(id),
    queryFn: () => apiClient.getBooking(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      teacherId: string;
      subjectOfferingId: string;
      startAt: string;
      endAt: string;
      type?: "TRIAL" | "SINGLE" | "PACKAGE";
      studentTimezone?: string;
      packageId?: string;
    }) => apiClient.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success("Dars band qilindi");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Dars band qilinmadi");
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      reason,
    }: {
      id: string;
      status: "CONFIRMED" | "CANCELLED";
      reason?: string;
    }) => apiClient.updateBookingStatus(id, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success("Dars holati yangilandi");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Dars holati yangilanmadi");
    },
  });
}

export function useRescheduleBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      newStartAt,
      newEndAt,
      reason,
    }: {
      id: string;
      newStartAt: string;
      newEndAt: string;
      reason?: string;
    }) => apiClient.rescheduleBooking(id, newStartAt, newEndAt, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success("Dars vaqti o'zgartirildi");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Dars vaqti o'zgartirilmadi");
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiClient.cancelBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success("Dars bekor qilindi");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Dars bekor qilinmadi");
    },
  });
}

// Payment Hooks
export function usePayments(params?: {
  status?: string[];
  provider?: string[];
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  return useQuery({
    queryKey: queryKeys.payments(params),
    queryFn: () => apiClient.getPayments(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      amount: number;
      provider: "CLICK" | "PAYME" | "UZUM_BANK" | "STRIPE";
      bookingId?: string;
      packageId?: string;
      returnUrl: string;
      cancelUrl: string;
      savePaymentMethod?: boolean;
    }) => apiClient.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("To'lov yaratildi");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "To'lov yaratilmadi");
    },
  });
}


// Review Hooks
export function useTeacherReviews(
  teacherId: string,
  params?: {
    rating?: number[];
    subject?: string;
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    includeAnonymous?: boolean;
  },
) {
  return useQuery({
    queryKey: queryKeys.teacherReviews(teacherId, params),
    queryFn: () => apiClient.getTeacherReviews(teacherId, params),
    enabled: !!teacherId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      teacherId: string;
      bookingId: string;
      rating: number;
      comment?: string;
      isAnonymous?: boolean;
    }) => apiClient.createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["teacher"] });
      toast.success("Sharh qo'shildi");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Sharh qo'shilmadi");
    },
  });
}

// Message Hooks
export function useMessageThreads(params?: {
  page?: number;
  limit?: number;
  search?: string;
  unreadOnly?: boolean;
}) {
  return useQuery({
    queryKey: queryKeys.messageThreads(params),
    queryFn: () => apiClient.getMessageThreads(params),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useMessageThread(
  threadId: string,
  params?: {
    page?: number;
    limit?: number;
    before?: string;
    after?: string;
  },
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.messageThread(threadId, params),
    queryFn: () => apiClient.getMessageThread(threadId, params),
    enabled: enabled && !!threadId,
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useCreateMessageThread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      studentId: string;
      teacherId: string;
      bookingId?: string;
      initialMessage?: string;
    }) => apiClient.createMessageThread(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Suhbat boshlandi");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Suhbat boshlanmadi");
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      threadId,
      content,
      attachments = [],
    }: {
      threadId: string;
      content: string;
      attachments?: any[];
    }) => apiClient.sendMessage(threadId, content, attachments),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messageThread(variables.threadId),
      });
      queryClient.invalidateQueries({ queryKey: ["messages", "threads"] });
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Xabar yuborilmadi");
    },
  });
}

// Notification Hooks
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
    queryKey: queryKeys.notifications(params),
    queryFn: () => apiClient.getNotifications(params),
    staleTime: 1000 * 30, // 30 seconds
    retry: (failureCount, error: any) => {
      if (error?.status === 400) return false;
      return failureCount < 3;
    },
    ...options,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Bildirishnoma belgilanmadi");
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Barcha bildirishnomalar o'qilgan deb belgilandi");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Bildirishnomalar belgilanmadi");
    },
  });
}

// Universal Search Hook
export function useUniversalSearch(
  params: {
    query: string;
    type?: "all" | "teachers" | "students" | "subjects";
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  },
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.universalSearch(params),
    queryFn: () => apiClient.universalSearch(params),
    enabled: enabled && !!params.query,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Optimistic update utilities
export function useOptimisticUpdate() {
  const queryClient = useQueryClient();

  return {
    updateSubjectOffering: (id: string, updates: Partial<SubjectOffering>) => {
      queryClient.setQueryData(
        queryKeys.subjectOfferings,
        (old: SubjectOffering[] | undefined) => {
          if (!old) return old;
          return old.map((offering) =>
            offering.id === id ? { ...offering, ...updates } : offering,
          );
        },
      );
    },

    reorderSubjectOfferings: (newOrder: SubjectOffering[]) => {
      queryClient.setQueryData(queryKeys.subjectOfferings, newOrder);
    },

    rollback: (queryKey: any) => {
      queryClient.invalidateQueries({ queryKey });
    },
  };
}
