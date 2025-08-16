import { RequestHandler } from "express";

// Mock data for development
const mockUser = {
  id: "user-1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  role: "TEACHER",
  isVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const mockTeacher = {
  id: "teacher-1",
  userId: "user-1",
  profileCompletion: 85,
  verificationStatus: "APPROVED",
  bio: "Experienced English teacher with 10+ years of experience",
  subjects: ["English", "IELTS"],
  hourlyRate: 50000, // in kopeks (500 UZS)
  timezone: "Asia/Tashkent",
  rating: 4.8,
  totalReviews: 156,
  totalLessons: 890,
  responseTime: "Usually responds within 1 hour",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const mockBookings = [
  {
    id: "booking-1",
    studentId: "student-1",
    teacherId: "teacher-1",
    status: "CONFIRMED",
    startAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    endAt: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
    subject: "English Conversation",
    price: 50000,
    createdAt: new Date().toISOString()
  }
];

const mockAvailabilityRules = [
  {
    id: "rule-1",
    type: "recurring",
    weekday: 1, // Monday
    startTime: "09:00",
    endTime: "17:00",
    isOpen: true
  },
  {
    id: "rule-2", 
    type: "recurring",
    weekday: 2, // Tuesday
    startTime: "09:00",
    endTime: "17:00",
    isOpen: true
  }
];

// Auth endpoints
export const handleAuthMe: RequestHandler = (req, res) => {
  res.json({ user: mockUser });
};

export const handleLogin: RequestHandler = (req, res) => {
  res.json({
    user: mockUser,
    accessToken: "mock-jwt-token",
    refreshToken: "mock-refresh-token"
  });
};

export const handleRegister: RequestHandler = (req, res) => {
  res.json({
    user: mockUser,
    accessToken: "mock-jwt-token",
    refreshToken: "mock-refresh-token"
  });
};

// Teacher endpoints
export const handleGetTeacherProfile: RequestHandler = (req, res) => {
  res.json(mockTeacher);
};

export const handleUpdateTeacherProfile: RequestHandler = (req, res) => {
  res.json({ ...mockTeacher, ...req.body });
};

export const handleSearchTeachers: RequestHandler = (req, res) => {
  res.json({
    teachers: [mockTeacher],
    total: 1,
    page: 1,
    limit: 10,
    pages: 1
  });
};

// Booking endpoints
export const handleGetBookings: RequestHandler = (req, res) => {
  res.json({
    bookings: mockBookings,
    total: mockBookings.length
  });
};

export const handleCreateBooking: RequestHandler = (req, res) => {
  const newBooking = {
    id: `booking-${Date.now()}`,
    ...req.body,
    status: "PENDING",
    createdAt: new Date().toISOString()
  };
  res.status(201).json(newBooking);
};

// Availability endpoints
export const handleGetAvailability: RequestHandler = (req, res) => {
  res.json({
    rules: mockAvailabilityRules,
    bookings: mockBookings,
    timezone: "Asia/Tashkent"
  });
};

export const handleCreateAvailabilityRule: RequestHandler = (req, res) => {
  const newRule = {
    id: `rule-${Date.now()}`,
    ...req.body
  };
  res.status(201).json(newRule);
};

export const handleUpdateAvailabilityRule: RequestHandler = (req, res) => {
  res.json({ ...req.body, id: req.params.ruleId });
};

export const handleDeleteAvailabilityRule: RequestHandler = (req, res) => {
  res.json({ message: "Availability rule deleted successfully" });
};

export const handleGetAvailableSlots: RequestHandler = (req, res) => {
  const now = new Date();
  const slots = [];
  
  // Generate some mock available slots for the next 7 days
  for (let i = 1; i <= 7; i++) {
    const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    for (let hour = 9; hour < 17; hour += 2) {
      const startAt = new Date(date);
      startAt.setHours(hour, 0, 0, 0);
      const endAt = new Date(startAt.getTime() + 60 * 60 * 1000); // 1 hour slots
      
      slots.push({
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        duration: 60,
        available: true
      });
    }
  }
  
  res.json({
    slots: slots.slice(0, 20), // Return first 20 slots
    timezone: "Asia/Tashkent",
    duration: 60,
    teacher: mockTeacher
  });
};

// Subject offerings endpoints
export const handleGetSubjectOfferings: RequestHandler = (req, res) => {
  res.json({
    offerings: [
      {
        id: "offering-1",
        teacherId: "teacher-1",
        subjectName: "English",
        level: "INTERMEDIATE",
        price: 50000,
        duration: 60,
        deliveryType: "ONLINE",
        description: "Conversational English for intermediate students"
      }
    ]
  });
};

// Reviews endpoints
export const handleGetReviews: RequestHandler = (req, res) => {
  res.json({
    reviews: [
      {
        id: "review-1",
        studentId: "student-1",
        teacherId: "teacher-1",
        rating: 5,
        comment: "Excellent teacher! Very patient and knowledgeable.",
        createdAt: new Date().toISOString()
      }
    ],
    total: 1
  });
};

export const handleCreateReview: RequestHandler = (req, res) => {
  res.status(201).json({
    id: `review-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  });
};

// Messages endpoints
export const handleGetMessages: RequestHandler = (req, res) => {
  res.json({
    messages: [],
    total: 0
  });
};

// Notifications endpoints
export const handleGetNotifications: RequestHandler = (req, res) => {
  res.json({
    notifications: [],
    total: 0,
    unreadCount: 0
  });
};

// Health check
export const handleHealthCheck: RequestHandler = (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
};
