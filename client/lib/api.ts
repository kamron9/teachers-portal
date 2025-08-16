import { z } from "zod";

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// Types from backend
export interface User {
  id: string;
  email: string;
  phone?: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  emailVerified: boolean;
  phoneVerified: boolean;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "DELETED";
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  timezone: string;
  preferredLanguages: string[];
  user?: User;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bioUz?: string;
  bioRu?: string;
  bioEn?: string;
  videoIntroUrl?: string;
  experienceYears: number;
  education: any[];
  certificates: any[];
  languagesTaught: string[];
  languagesSpoken: string[];
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  verificationReason?: string;
  cancellationPolicy?: string;
  minNoticeHours: number;
  maxAdvanceDays: number;
  timezone: string;
  isActive: boolean;
  rating: number;
  totalReviews: number;
  totalLessons: number;
  totalEarnings: number;
  user?: User;
  subjectOfferings?: SubjectOffering[];
  teacherChips?: TeacherChips;
}

export interface Subject {
  id: string;
  name: string;
  nameUz?: string;
  nameRu?: string;
  nameEn?: string;
  description?: string;
  category?: string;
  isActive: boolean;
  teacherCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectOffering {
  id: string;
  teacherId: string;
  subjectName: string;
  subjectNameUz?: string;
  subjectNameRu?: string;
  subjectNameEn?: string;
  level:
    | "ALL_LEVELS"
    | "BEGINNER"
    | "ELEMENTARY"
    | "INTERMEDIATE"
    | "UPPER_INTERMEDIATE"
    | "ADVANCED"
    | "INTERMEDIATE_PLUS";
  pricePerHour: number; // UZS in kopeks
  delivery: "ONLINE" | "OFFLINE" | "HYBRID";
  icon: "BOOK" | "BAR_CHART" | "BRIEFCASE" | "SPEECH_BUBBLE";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  orderIndex: number;
  teacher?: TeacherProfile;
}

export interface TeacherChips {
  id: string;
  teacherId: string;
  teachingLevels: string[];
  examPreparation: string[];
}

export interface AvailabilityRule {
  id: string;
  teacherId: string;
  type: "recurring" | "one_off";
  weekday?: number; // 0-6
  date?: string; // ISO date for one-off
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isOpen: boolean;
}

export interface AvailabilitySlot {
  startAt: string;
  endAt: string;
  duration: number;
  available: boolean;
}

export interface Booking {
  id: string;
  studentId: string;
  teacherId: string;
  subjectOfferingId: string;
  packageId?: string;
  startAt: string;
  endAt: string;
  priceAtBooking: number;
  type: "TRIAL" | "SINGLE" | "PACKAGE";
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  studentTimezone: string;
  teacherTimezone: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  actualStartAt?: string;
  actualEndAt?: string;
  studentAttended?: boolean;
  teacherAttended?: boolean;
  lessonNotes?: string;
  student?: StudentProfile;
  teacher?: TeacherProfile;
  subjectOffering?: SubjectOffering;
  payment?: Payment;
  reviews?: Review[];
}

export interface Payment {
  id: string;
  bookingId?: string;
  packageId?: string;
  amount: number; // UZS in kopeks
  provider: "CLICK" | "PAYME" | "UZUM_BANK" | "STRIPE";
  providerRef?: string;
  status:
    | "PENDING"
    | "COMPLETED"
    | "FAILED"
    | "REFUNDED"
    | "PARTIALLY_REFUNDED";
  currency: string;
  capturedAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  failureReason?: string;
  metadata?: any;
}

export interface Review {
  id: string;
  teacherId: string;
  studentId: string;
  bookingId: string;
  rating: number; // 1-5
  comment?: string;
  isAnonymous: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  moderationReason?: string;
  createdAt: string;
  teacher?: TeacherProfile;
  student?: StudentProfile;
  booking?: Booking;
}

export interface MessageThread {
  id: string;
  studentId: string;
  teacherId: string;
  bookingId?: string;
  isActive: boolean;
  student?: StudentProfile;
  teacher?: TeacherProfile;
  booking?: Booking;
  messages?: Message[];
  lastMessage?: Message;
  unreadCount?: number;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  attachments: any[];
  status: "SENT" | "DELIVERED" | "READ";
  isReported: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  relatedBooking?: Booking;
  relatedPayment?: Payment;
}

// API Error interface
export interface ApiError {
  error: string;
  message: string;
  code?: string;
  fields?: Record<string, string[]>;
}

// Pagination interface
export interface PaginatedResponse<T> {
  data?: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth tokens
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// API Client class
class ApiClient {
  private baseURL: string;
  private tokens: AuthTokens | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadTokens();
  }

  private loadTokens() {
    try {
      const stored = localStorage.getItem("auth_tokens");
      if (stored) {
        this.tokens = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load auth tokens:", error);
      localStorage.removeItem("auth_tokens");
    }
  }

  private saveTokens(tokens: AuthTokens) {
    this.tokens = tokens;
    localStorage.setItem("auth_tokens", JSON.stringify(tokens));
  }

  private clearTokens() {
    this.tokens = null;
    localStorage.removeItem("auth_tokens");
  }

  private async refreshTokens(): Promise<boolean> {
    if (!this.tokens?.refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: this.tokens.refreshToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        this.saveTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: Date.now() + data.expiresIn * 1000,
        });
        return true;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }

    this.clearTokens();
    return false;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    console.log(`[API] Making request to: ${url}`);

    // Check if token is expired and refresh if needed
    if (this.tokens && this.tokens.expiresAt < Date.now() + 60000) {
      // 1 minute buffer
      await this.refreshTokens();
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.tokens?.accessToken) {
      headers.Authorization = `Bearer ${this.tokens.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log(`[API] Response status: ${response.status} for ${url}`);

      // If response is ok, proceed with normal flow
      if (response.ok) {
        const data = await response.json();
        console.log(`[API] Success for ${url}:`, data);
        return data;
      }

      // Handle non-ok responses
      const errorData = await response.json().catch(() => ({
        error: "RequestFailed",
        message: `Request failed with status ${response.status}`,
      }));
      console.error(`[API] Error for ${url}:`, errorData);
      throw errorData;
    } catch (error) {
      console.error(`[API] Fetch error for ${url}:`, error);
      throw error;
    }

    // Handle 401 responses
    if (response.status === 401 && this.tokens) {
      const refreshed = await this.refreshTokens();
      if (refreshed) {
        // Retry the original request with new token
        headers.Authorization = `Bearer ${this.tokens!.accessToken}`;
        const retryResponse = await fetch(url, {
          ...options,
          headers,
        });

        if (!retryResponse.ok) {
          const error: ApiError = await retryResponse.json().catch(() => ({
            error: "RequestFailed",
            message: "Request failed",
          }));
          throw error;
        }

        return retryResponse.json();
      } else {
        // Refresh failed, redirect to login
        window.location.href = "/login";
        throw new Error("Authentication required");
      }
    }

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: "RequestFailed",
        message: "Request failed",
      }));
      throw error;
    }

    return response.json();
  }

  // Auth methods
  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await this.request<{
      user: User;
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const tokens = {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      expiresAt: Date.now() + response.expiresIn * 1000,
    };

    this.saveTokens(tokens);

    return {
      user: response.user,
      tokens,
    };
  }

  async register(data: {
    email: string;
    password: string;
    role: "STUDENT" | "TEACHER";
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await this.request<{
      user: User;
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const tokens = {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      expiresAt: Date.now() + response.expiresIn * 1000,
    };

    this.saveTokens(tokens);

    return {
      user: response.user,
      tokens,
    };
  }

  async logout(): Promise<void> {
    try {
      if (this.tokens?.refreshToken) {
        await this.request("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken: this.tokens.refreshToken }),
        });
      }
    } finally {
      this.clearTokens();
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/auth/me");
  }

  // Teacher methods
  async getTeacherProfile(): Promise<TeacherProfile> {
    return this.request<TeacherProfile>("/teachers/profile");
  }

  async updateTeacherProfile(
    data: Partial<TeacherProfile>,
  ): Promise<TeacherProfile> {
    return this.request<TeacherProfile>("/teachers/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getTeacherById(id: string): Promise<TeacherProfile> {
    return this.request<TeacherProfile>(`/teachers/${id}`);
  }

  async searchTeachers(params: {
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
  }): Promise<PaginatedResponse<TeacherProfile> & { appliedFilters: any }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v.toString()));
        } else {
          searchParams.set(key, value.toString());
        }
      }
    });

    return this.request<
      PaginatedResponse<TeacherProfile> & { appliedFilters: any }
    >(`/search/teachers?${searchParams}`);
  }

  // Subjects methods
  async getSubjects(params?: {
    query?: string;
    category?: string;
    isActive?: boolean;
    includeTeacherCount?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<PaginatedResponse<Subject> & { categories: string[] }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value.toString());
        }
      });
    }

    return this.request<PaginatedResponse<Subject> & { categories: string[] }>(
      `/subjects?${searchParams}`,
    );
  }

  // Subject offerings methods
  async getSubjectOfferings(): Promise<SubjectOffering[]> {
    return this.request<SubjectOffering[]>("/teachers/subject-offerings");
  }

  async createSubjectOffering(
    data: Omit<SubjectOffering, "id" | "teacherId" | "createdAt" | "updatedAt">,
  ): Promise<SubjectOffering> {
    return this.request<SubjectOffering>("/teachers/subject-offerings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateSubjectOffering(
    id: string,
    data: Partial<SubjectOffering>,
  ): Promise<SubjectOffering> {
    return this.request<SubjectOffering>(`/teachers/subject-offerings/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteSubjectOffering(id: string): Promise<void> {
    await this.request(`/teachers/subject-offerings/${id}`, {
      method: "DELETE",
    });
  }

  async reorderSubjectOfferings(
    offerings: { id: string; orderIndex: number }[],
  ): Promise<void> {
    await this.request("/teachers/subject-offerings/reorder", {
      method: "POST",
      body: JSON.stringify({ offerings }),
    });
  }

  // Availability methods
  async getAvailability(
    teacherId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<{
    rules: AvailabilityRule[];
    bookings: any[];
    timezone: string;
  }> {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    return this.request<{
      rules: AvailabilityRule[];
      bookings: any[];
      timezone: string;
    }>(`/availability/${teacherId}?${params}`);
  }

  async createAvailabilityRule(
    rule: Omit<AvailabilityRule, "id">,
  ): Promise<AvailabilityRule> {
    return this.request<AvailabilityRule>("/availability", {
      method: "POST",
      body: JSON.stringify(rule),
    });
  }

  async updateAvailabilityRule(
    id: string,
    data: Partial<AvailabilityRule>,
  ): Promise<AvailabilityRule> {
    return this.request<AvailabilityRule>(`/availability/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteAvailabilityRule(id: string): Promise<void> {
    await this.request(`/availability/${id}`, {
      method: "DELETE",
    });
  }

  async getAvailableSlots(
    teacherId: string,
    params: {
      startDate: string;
      endDate: string;
      timezone?: string;
      duration?: number;
      subjectOfferingId?: string;
    },
  ): Promise<{
    slots: AvailabilitySlot[];
    timezone: string;
    duration: number;
    teacher: any;
  }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, value.toString());
      }
    });

    return this.request<{
      slots: AvailabilitySlot[];
      timezone: string;
      duration: number;
      teacher: any;
    }>(`/availability/${teacherId}/slots?${searchParams}`);
  }

  // Booking methods
  async getBookings(params?: {
    status?: string[];
    type?: string[];
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<PaginatedResponse<Booking>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, v.toString()));
          } else {
            searchParams.set(key, value.toString());
          }
        }
      });
    }

    return this.request<PaginatedResponse<Booking>>(
      `/bookings?${searchParams}`,
    );
  }

  async getBooking(id: string): Promise<Booking> {
    return this.request<Booking>(`/bookings/${id}`);
  }

  async createBooking(data: {
    teacherId: string;
    subjectOfferingId: string;
    startAt: string;
    endAt: string;
    type?: "TRIAL" | "SINGLE" | "PACKAGE";
    studentTimezone?: string;
    packageId?: string;
  }): Promise<{ booking: Booking; message: string }> {
    return this.request<{ booking: Booking; message: string }>("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateBookingStatus(
    id: string,
    status: "CONFIRMED" | "CANCELLED",
    reason?: string,
  ): Promise<{ booking: Booking; message: string }> {
    return this.request<{ booking: Booking; message: string }>(
      `/bookings/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status, reason }),
      },
    );
  }

  async rescheduleBooking(
    id: string,
    newStartAt: string,
    newEndAt: string,
    reason?: string,
  ): Promise<{ booking: Booking; message: string }> {
    return this.request<{ booking: Booking; message: string }>(
      `/bookings/${id}/reschedule`,
      {
        method: "PATCH",
        body: JSON.stringify({ newStartAt, newEndAt, reason }),
      },
    );
  }

  async cancelBooking(
    id: string,
    reason: string,
  ): Promise<{ booking: Booking; cancellation: any; message: string }> {
    return this.request<{
      booking: Booking;
      cancellation: any;
      message: string;
    }>(`/bookings/${id}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
  }

  // Payment methods
  async createPayment(data: {
    bookingId?: string;
    packageId?: string;
    provider: string;
    returnUrl: string;
    cancelUrl: string;
    paymentMethodId?: string;
  }): Promise<{
    payment: { id: string; amount: number; provider: string; status: string };
    paymentUrl: string;
    providerRef: string;
  }> {
    return this.request<{
      payment: { id: string; amount: number; provider: string; status: string };
      paymentUrl: string;
      providerRef: string;
    }>("/payments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getPayment(id: string): Promise<Payment> {
    return this.request<Payment>(`/payments/${id}`);
  }

  async getPayments(params?: {
    status?: string[];
    provider?: string[];
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<PaginatedResponse<Payment>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, v.toString()));
          } else {
            searchParams.set(key, value.toString());
          }
        }
      });
    }

    return this.request<PaginatedResponse<Payment>>(
      `/payments?${searchParams}`,
    );
  }

  // Reviews methods
  async createReview(data: {
    teacherId: string;
    bookingId: string;
    rating: number;
    comment?: string;
    isAnonymous?: boolean;
  }): Promise<{ review: Review; message: string }> {
    return this.request<{ review: Review; message: string }>("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getTeacherReviews(
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
  ): Promise<{
    teacher: TeacherProfile;
    reviews: Review[];
    pagination: any;
    statistics: {
      averageRating: number;
      totalReviews: number;
      ratingDistribution: any[];
    };
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, v.toString()));
          } else {
            searchParams.set(key, value.toString());
          }
        }
      });
    }

    return this.request<{
      teacher: TeacherProfile;
      reviews: Review[];
      pagination: any;
      statistics: {
        averageRating: number;
        totalReviews: number;
        ratingDistribution: any[];
      };
    }>(`/reviews/teacher/${teacherId}?${searchParams}`);
  }

  // Messages methods
  async getMessageThreads(params?: {
    page?: number;
    limit?: number;
    search?: string;
    unreadOnly?: boolean;
  }): Promise<PaginatedResponse<MessageThread>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value.toString());
        }
      });
    }

    return this.request<PaginatedResponse<MessageThread>>(
      `/messages/threads?${searchParams}`,
    );
  }

  async getMessageThread(
    threadId: string,
    params?: {
      page?: number;
      limit?: number;
      before?: string;
      after?: string;
    },
  ): Promise<{
    thread: MessageThread;
    messages: Message[];
    pagination: any;
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value.toString());
        }
      });
    }

    return this.request<{
      thread: MessageThread;
      messages: Message[];
      pagination: any;
    }>(`/messages/threads/${threadId}?${searchParams}`);
  }

  async createMessageThread(data: {
    studentId: string;
    teacherId: string;
    bookingId?: string;
    initialMessage?: string;
  }): Promise<{
    thread: MessageThread;
    message?: Message;
  }> {
    return this.request<{
      thread: MessageThread;
      message?: Message;
    }>("/messages/threads", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async sendMessage(
    threadId: string,
    content: string,
    attachments: any[] = [],
  ): Promise<Message> {
    return this.request<Message>(`/messages/threads/${threadId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content, attachments }),
    });
  }

  // Notifications methods
  async getNotifications(params?: {
    type?: string;
    isRead?: boolean;
    priority?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<PaginatedResponse<Notification> & { unreadCount: number }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value.toString());
        }
      });
    }

    return this.request<
      PaginatedResponse<Notification> & { unreadCount: number }
    >(`/notifications?${searchParams}`);
  }

  async markNotificationAsRead(
    id: string,
  ): Promise<{ notification: Notification; message: string }> {
    return this.request<{ notification: Notification; message: string }>(
      `/notifications/${id}/read`,
      {
        method: "PATCH",
      },
    );
  }

  async markAllNotificationsAsRead(): Promise<{
    message: string;
    count: number;
  }> {
    return this.request<{ message: string; count: number }>(
      "/notifications/mark-all-read",
      {
        method: "PATCH",
      },
    );
  }

  // Student profile methods
  async getStudentProfile(): Promise<StudentProfile> {
    return this.request<StudentProfile>("/students/profile");
  }

  async updateStudentProfile(
    data: Partial<StudentProfile>,
  ): Promise<StudentProfile> {
    return this.request<StudentProfile>("/students/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Universal search
  async universalSearch(params: {
    query: string;
    type?: "all" | "teachers" | "students" | "subjects";
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{
    query: string;
    type: string;
    results: {
      teachers: TeacherProfile[];
      students: StudentProfile[];
      subjects: any[];
      totalResults: number;
    };
    pagination: any;
  }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, value.toString());
      }
    });

    return this.request<{
      query: string;
      type: string;
      results: {
        teachers: TeacherProfile[];
        students: StudentProfile[];
        subjects: any[];
        totalResults: number;
      };
      pagination: any;
    }>(`/search?${searchParams}`);
  }

  // Payment status method
  async getPaymentStatus(paymentId: string): Promise<Payment> {
    return this.request<Payment>(`/payments/${paymentId}/status`);
  }

  // Wallet methods
  async getWalletBalance(): Promise<{ availableBalance: number; pendingBalance: number; totalEarnings: number }> {
    return this.request<{ availableBalance: number; pendingBalance: number; totalEarnings: number }>("/wallet/balance");
  }

  async getWalletEntries(params?: {
    status?: "PENDING" | "AVAILABLE" | "PAID";
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<any>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value.toString());
        }
      });
    }
    return this.request<PaginatedResponse<any>>(`/wallet/entries?${searchParams}`);
  }

  async requestPayout(data: {
    amount: number;
    method: "bank_transfer" | "card";
    accountRef: string;
    note?: string;
  }): Promise<{ message: string; payoutId: string }> {
    return this.request<{ message: string; payoutId: string }>("/wallet/payout", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Get auth state
  isAuthenticated(): boolean {
    return !!this.tokens?.accessToken;
  }

  getTokens(): AuthTokens | null {
    return this.tokens;
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Utility functions for formatting
export const formatPrice = (kopeks: number): string => {
  const uzs = Math.round(kopeks / 100);
  return `${uzs.toLocaleString("uz-UZ")} so'm`;
};

export const formatPriceShort = (kopeks: number): string => {
  const uzs = Math.round(kopeks / 100);
  return `${uzs.toLocaleString("uz-UZ")}`;
};

export const parsePrice = (priceString: string): number => {
  // Convert "50 000" or "50,000" to 5000000 (kopeks)
  const cleanPrice = priceString.replace(/[^\d]/g, "");
  return parseInt(cleanPrice) * 100;
};

export const formatTimezone = (
  date: string,
  timezone: string = "Asia/Tashkent",
): string => {
  return new Intl.DateTimeFormat("uz-UZ", {
    timeZone: timezone,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const getSubjectDisplayName = (
  offering: SubjectOffering,
  locale: string = "uz",
): string => {
  switch (locale) {
    case "ru":
      return offering.subjectNameRu || offering.subjectName;
    case "en":
      return offering.subjectNameEn || offering.subjectName;
    default:
      return offering.subjectNameUz || offering.subjectName;
  }
};

export const getBioText = (
  teacher: TeacherProfile,
  locale: string = "uz",
): string => {
  switch (locale) {
    case "ru":
      return teacher.bioRu || teacher.bioUz || teacher.bioEn || "";
    case "en":
      return teacher.bioEn || teacher.bioUz || teacher.bioRu || "";
    default:
      return teacher.bioUz || teacher.bioRu || teacher.bioEn || "";
  }
};
