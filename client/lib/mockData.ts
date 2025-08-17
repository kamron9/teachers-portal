// Mock data for the tutoring platform

export interface MockTeacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  bio: string;
  hourlyRate: number;
  totalStudents: number;
  averageRating: number;
  totalReviews: number;
  languages: string[];
  subjects: string[];
  experience: number;
  isVerified: boolean;
  availability: string[];
  subjectOfferings?: Array<{
    subjectName: string;
    pricePerHour: number;
  }>;
}

export interface MockSubject {
  id: string;
  name: string;
  teacherCount: number;
  description?: string;
}

export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  profileImage?: string;
  phoneNumber?: string;
  bio?: string;
  languages?: string[];
  subjects?: string[];
  createdAt: string;
}

export interface MockBooking {
  id: string;
  studentId: string;
  teacherId: string;
  subjectId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  price: number;
  notes?: string;
  rating?: number;
  review?: string;
  teacher: MockTeacher;
  subject: MockSubject;
}

export interface MockMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  senderName: string;
  senderAvatar?: string;
}

export interface MockNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'review' | 'system';
  isRead: boolean;
  createdAt: string;
}

// Mock Teachers Data
export const mockTeachers: MockTeacher[] = [
  {
    id: "1",
    firstName: "Malika",
    lastName: "Karimova",
    email: "malika@example.com",
    profileImage: "/placeholder.svg",
    bio: "Ingliz tili o'qituvchisi. 5 yillik tajriba. IELTS va TOEFL tayyorlash bo'yicha mutaxassis.",
    hourlyRate: 50000,
    totalStudents: 120,
    averageRating: 4.9,
    totalReviews: 95,
    languages: ["O'zbek", "Ingliz", "Rus"],
    subjects: ["Ingliz tili", "IELTS", "TOEFL"],
    experience: 5,
    isVerified: true,
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    subjectOfferings: [
      { subjectName: "Ingliz tili", pricePerHour: 50000 }
    ]
  },
  {
    id: "2",
    firstName: "Anvar",
    lastName: "Toshmatov",
    email: "anvar@example.com",
    profileImage: "/placeholder.svg",
    bio: "Matematika o'qituvchisi. Olimpiada tayyorlash. 8 yillik tajriba.",
    hourlyRate: 45000,
    totalStudents: 85,
    averageRating: 4.8,
    totalReviews: 72,
    languages: ["O'zbek", "Rus"],
    subjects: ["Matematika", "Algebra", "Geometriya"],
    experience: 8,
    isVerified: true,
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    subjectOfferings: [
      { subjectName: "Matematika", pricePerHour: 45000 }
    ]
  },
  {
    id: "3",
    firstName: "Dilnoza",
    lastName: "Rahimova",
    email: "dilnoza@example.com",
    profileImage: "/placeholder.svg",
    bio: "Dasturlash o'qituvchisi. Frontend va Backend dasturlash.",
    hourlyRate: 70000,
    totalStudents: 60,
    averageRating: 4.7,
    totalReviews: 48,
    languages: ["O'zbek", "Ingliz"],
    subjects: ["Dasturlash", "JavaScript", "Python", "React"],
    experience: 6,
    isVerified: true,
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    subjectOfferings: [
      { subjectName: "Dasturlash", pricePerHour: 70000 }
    ]
  },
  {
    id: "4",
    firstName: "Sardor",
    lastName: "Nazarov",
    email: "sardor@example.com",
    profileImage: "/placeholder.svg",
    bio: "Fizika o'qituvchisi. Olimpiada va DTM tayyorlash.",
    hourlyRate: 40000,
    totalStudents: 95,
    averageRating: 4.6,
    totalReviews: 88,
    languages: ["O'zbek", "Rus"],
    subjects: ["Fizika", "Mexanika", "Elektrodinamika"],
    experience: 7,
    isVerified: true,
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    subjectOfferings: [
      { subjectName: "Fizika", pricePerHour: 40000 }
    ]
  },
  {
    id: "5",
    firstName: "Maryam",
    lastName: "Yusupova",
    email: "maryam@example.com",
    profileImage: "/placeholder.svg",
    bio: "Kimyo o'qituvchisi. Organik va noorganik kimyo mutaxassisi.",
    hourlyRate: 42000,
    totalStudents: 78,
    averageRating: 4.8,
    totalReviews: 65,
    languages: ["O'zbek", "Rus", "Ingliz"],
    subjects: ["Kimyo", "Organik kimyo", "Noorganik kimyo"],
    experience: 5,
    isVerified: true,
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    subjectOfferings: [
      { subjectName: "Kimyo", pricePerHour: 42000 }
    ]
  },
  {
    id: "6",
    firstName: "Jasur",
    lastName: "Ismoilov",
    email: "jasur@example.com",
    profileImage: "/placeholder.svg",
    bio: "Tarix o'qituvchisi. O'zbekiston tarixi va jahon tarixi mutaxassisi.",
    hourlyRate: 35000,
    totalStudents: 55,
    averageRating: 4.5,
    totalReviews: 42,
    languages: ["O'zbek", "Rus"],
    subjects: ["Tarix", "O'zbekiston tarixi", "Jahon tarixi"],
    experience: 4,
    isVerified: false,
    availability: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    subjectOfferings: [
      { subjectName: "Tarix", pricePerHour: 35000 }
    ]
  }
];

// Mock Subjects Data
export const mockSubjects: MockSubject[] = [
  { id: "1", name: "Dasturlash", teacherCount: 1400, description: "Web dasturlash, mobil dasturlash va boshqalar" },
  { id: "2", name: "Ingliz tili", teacherCount: 1000, description: "Ingliz tilini o'rganish barcha darajalar uchun" },
  { id: "3", name: "Matematika", teacherCount: 850, description: "Algebra, geometriya va matematik tahlil" },
  { id: "4", name: "Ona tili va adabiyot", teacherCount: 760, description: "O'zbek tili va adabiyot darslari" },
  { id: "5", name: "Rus tili", teacherCount: 680, description: "Rus tilini o'rganish va rivojlantirish" },
  { id: "6", name: "Arab tili", teacherCount: 540, description: "Arab tili va uning grammatikasi" },
  { id: "7", name: "Fizika", teacherCount: 420, description: "Fizika qonunlari va amaliy mashg'ulotlar" },
  { id: "8", name: "Iqtisodiyot", teacherCount: 410, description: "Iqtisodiyot asoslari va moliya" },
  { id: "9", name: "Kimyo", teacherCount: 390, description: "Organik va noorganik kimyo" },
  { id: "10", name: "Biologiya", teacherCount: 370, description: "Tirik organizmlar va ularning hayoti" },
  { id: "11", name: "Xitoy tili", teacherCount: 320, description: "Xitoy tili va madaniyati" },
  { id: "12", name: "Yapon tili", teacherCount: 280, description: "Yapon tili va yozuvi" },
  { id: "13", name: "Huquq", teacherCount: 260, description: "Huquq asoslari va qonunchilik" },
  { id: "14", name: "Psixologiya", teacherCount: 190, description: "Inson psixologiyasi va xulq-atvor" },
  { id: "15", name: "Tarix", teacherCount: 300, description: "O'zbekiston va jahon tarixi" }
];

// Mock Current User
export const mockCurrentUser: MockUser = {
  id: "user-1",
  firstName: "Kamron",
  lastName: "Alimov",
  email: "kamron@example.com",
  role: "student",
  profileImage: "/placeholder.svg",
  phoneNumber: "+998901234567",
  bio: "Dasturlashni o'rganayotgan talaba",
  languages: ["O'zbek", "Ingliz", "Rus"],
  createdAt: "2024-01-15T10:00:00Z"
};

// Mock Bookings
export const mockBookings: MockBooking[] = [
  {
    id: "booking-1",
    studentId: "user-1",
    teacherId: "1",
    subjectId: "2",
    date: "2024-12-25",
    startTime: "14:00",
    endTime: "15:00",
    status: "scheduled",
    price: 50000,
    notes: "IELTS Speaking tayyorlash",
    teacher: mockTeachers[0],
    subject: mockSubjects[1]
  },
  {
    id: "booking-2",
    studentId: "user-1",
    teacherId: "2",
    subjectId: "3",
    date: "2024-12-24",
    startTime: "16:00",
    endTime: "17:00",
    status: "completed",
    price: 45000,
    notes: "Algebra masalalari",
    rating: 5,
    review: "Juda yaxshi dars edi. Tushuntirish usuli ajoyib!",
    teacher: mockTeachers[1],
    subject: mockSubjects[2]
  },
  {
    id: "booking-3",
    studentId: "user-1",
    teacherId: "3",
    subjectId: "1",
    date: "2024-12-26",
    startTime: "10:00",
    endTime: "11:30",
    status: "scheduled",
    price: 105000,
    notes: "React hooks o'rganish",
    teacher: mockTeachers[2],
    subject: mockSubjects[0]
  }
];

// Mock Messages
export const mockMessages: MockMessage[] = [
  {
    id: "msg-1",
    senderId: "1",
    receiverId: "user-1",
    content: "Salom! Ertangi darsga tayyormisiz?",
    timestamp: "2024-12-23T14:30:00Z",
    isRead: true,
    senderName: "Malika Karimova",
    senderAvatar: "/placeholder.svg"
  },
  {
    id: "msg-2",
    senderId: "user-1",
    receiverId: "1",
    content: "Ha, tayyor! IELTS Speaking qismida yordam kerak.",
    timestamp: "2024-12-23T14:32:00Z",
    isRead: true,
    senderName: "Kamron Alimov"
  },
  {
    id: "msg-3",
    senderId: "3",
    receiverId: "user-1",
    content: "React loyihasi uchun kod namunalarini tayyorladim.",
    timestamp: "2024-12-23T16:00:00Z",
    isRead: false,
    senderName: "Dilnoza Rahimova",
    senderAvatar: "/placeholder.svg"
  }
];

// Mock Notifications
export const mockNotifications: MockNotification[] = [
  {
    id: "notif-1",
    userId: "user-1",
    title: "Yangi dars belgilandi",
    message: "Malika Karimova bilan ertaga soat 14:00 da dars",
    type: "booking",
    isRead: false,
    createdAt: "2024-12-23T12:00:00Z"
  },
  {
    id: "notif-2",
    userId: "user-1",
    title: "To'lov muvaffaqiyatli",
    message: "45,000 so'm to'lov amalga oshirildi",
    type: "payment",
    isRead: true,
    createdAt: "2024-12-22T16:30:00Z"
  },
  {
    id: "notif-3",
    userId: "user-1",
    title: "Yangi xabar",
    message: "Dilnoza Rahimova sizga xabar yubordi",
    type: "system",
    isRead: false,
    createdAt: "2024-12-23T16:01:00Z"
  }
];

// Mock API Response Types
export interface MockApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface MockPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Mock API Functions
export const mockApi = {
  // Teachers
  getTeachers: (params?: { 
    limit?: number; 
    sortBy?: string; 
    sortOrder?: string;
    subject?: string;
    language?: string;
    priceFrom?: string;
    priceTo?: string;
  }): Promise<MockApiResponse<MockPaginatedResponse<MockTeacher>>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredTeachers = [...mockTeachers];
        
        // Apply filters
        if (params?.subject) {
          filteredTeachers = filteredTeachers.filter(teacher => 
            teacher.subjects.some(subject => 
              subject.toLowerCase().includes(params.subject!.toLowerCase())
            )
          );
        }
        
        if (params?.language) {
          filteredTeachers = filteredTeachers.filter(teacher => 
            teacher.languages.some(lang => 
              lang.toLowerCase().includes(params.language!.toLowerCase())
            )
          );
        }
        
        if (params?.priceFrom) {
          filteredTeachers = filteredTeachers.filter(teacher => 
            teacher.hourlyRate >= parseInt(params.priceFrom!)
          );
        }
        
        if (params?.priceTo) {
          filteredTeachers = filteredTeachers.filter(teacher => 
            teacher.hourlyRate <= parseInt(params.priceTo!)
          );
        }
        
        // Apply sorting
        if (params?.sortBy === 'rating' && params?.sortOrder === 'desc') {
          filteredTeachers.sort((a, b) => b.averageRating - a.averageRating);
        }
        
        // Apply limit
        const limit = params?.limit || filteredTeachers.length;
        const limitedTeachers = filteredTeachers.slice(0, limit);
        
        resolve({
          data: {
            data: limitedTeachers,
            total: filteredTeachers.length,
            page: 1,
            limit: limit,
            totalPages: Math.ceil(filteredTeachers.length / limit)
          },
          success: true
        });
      }, 300);
    });
  },
  
  // Subjects
  getSubjects: (): Promise<MockApiResponse<{ subjects: MockSubject[] }>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: { subjects: mockSubjects },
          success: true
        });
      }, 200);
    });
  },
  
  // Auth
  getCurrentUser: (): Promise<MockApiResponse<MockUser>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: mockCurrentUser,
          success: true
        });
      }, 100);
    });
  },
  
  login: (email: string, password: string): Promise<MockApiResponse<{ user: MockUser; token: string }>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "test@example.com" && password === "password") {
          resolve({
            data: {
              user: mockCurrentUser,
              token: "mock-jwt-token"
            },
            success: true,
            message: "Login successful"
          });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 500);
    });
  },
  
  // Bookings
  getBookings: (params?: { isRead?: boolean; limit?: number }): Promise<MockApiResponse<{ bookings: MockBooking[]; unreadCount?: number }>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            bookings: mockBookings,
            unreadCount: 2
          },
          success: true
        });
      }, 200);
    });
  },
  
  // Notifications
  getNotifications: (params?: { isRead?: boolean; limit?: number }): Promise<MockApiResponse<{ notifications: MockNotification[]; unreadCount?: number }>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const unreadNotifications = mockNotifications.filter(n => !n.isRead);
        resolve({
          data: {
            notifications: mockNotifications,
            unreadCount: unreadNotifications.length
          },
          success: true
        });
      }, 200);
    });
  },
  
  // Messages
  getMessages: (): Promise<MockApiResponse<MockMessage[]>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: mockMessages,
          success: true
        });
      }, 200);
    });
  }
};

// Utility functions
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const getMockTeacherById = (id: string): MockTeacher | undefined => {
  return mockTeachers.find(teacher => teacher.id === id);
};

export const getMockSubjectById = (id: string): MockSubject | undefined => {
  return mockSubjects.find(subject => subject.id === id);
};
