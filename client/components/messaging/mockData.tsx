// Mock data for MessageThreadList component

// Define the interfaces locally since they're not exported from the component
interface MessageThread {
  id: string
  studentId: string
  teacherId: string
  bookingId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastMessage?: {
    id: string
    content: string
    senderId: string
    createdAt: string
    status: 'SENT' | 'DELIVERED' | 'READ'
  }
  otherUser: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
    role: 'student' | 'teacher'
    isOnline?: boolean
    lastSeen?: string
  }
  unreadCount: number
  isPinned?: boolean
}

// Helper function to generate random dates
const getRandomDate = (daysAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(Math.floor(Math.random() * 24))
  date.setMinutes(Math.floor(Math.random() * 60))
  return date.toISOString()
}

// Sample user data
const mockUsers = [
  {
    id: 'user-1',
    firstName: 'Aziz',
    lastName: 'Karimov',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'teacher' as const,
    isOnline: true,
  },
  {
    id: 'user-2',
    firstName: 'Malika',
    lastName: 'Toshmatova',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b5e31b9c?w=150&h=150&fit=crop&crop=face',
    role: 'student' as const,
    isOnline: false,
    lastSeen: getRandomDate(1),
  },
  {
    id: 'user-3',
    firstName: 'Javohir',
    lastName: 'Usmonov',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'teacher' as const,
    isOnline: true,
  },
  {
    id: 'user-4',
    firstName: 'Dilnoza',
    lastName: 'Rahimova',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'student' as const,
    isOnline: false,
    lastSeen: getRandomDate(2),
  },
  {
    id: 'user-5',
    firstName: 'Bobur',
    lastName: 'Nazarov',
    role: 'student' as const,
    isOnline: true,
  },
  {
    id: 'user-6',
    firstName: 'Nigora',
    lastName: 'Sharipova',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    role: 'teacher' as const,
    isOnline: false,
    lastSeen: getRandomDate(0),
  },
  {
    id: 'user-7',
    firstName: 'Sardor',
    lastName: 'Mirzayev',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    role: 'student' as const,
    isOnline: true,
  },
  {
    id: 'user-8',
    firstName: 'Feruza',
    lastName: 'Abdullayeva',
    role: 'teacher' as const,
    isOnline: false,
    lastSeen: getRandomDate(7),
  },
]

// Sample messages
const mockMessages = [
  {
    id: 'msg-1',
    content: 'Salom! Ertangi dars soat nechada boshlanadi?',
    senderId: 'user-2',
    createdAt: getRandomDate(0),
    status: 'READ' as const,
  },
  {
    id: 'msg-2',
    content: "Matematika fanidan qo'shimcha mashg'ulot kerakmi?",
    senderId: 'current-user',
    createdAt: getRandomDate(0),
    status: 'DELIVERED' as const,
  },
  {
    id: 'msg-3',
    content: 'Rahmat! Vazifalarni bajarib keldim.',
    senderId: 'user-4',
    createdAt: getRandomDate(1),
    status: 'READ' as const,
  },
  {
    id: 'msg-4',
    content: "Keyingi hafta imtihon bo'ladi. Tayyorgarlik ko'ring.",
    senderId: 'current-user',
    createdAt: getRandomDate(1),
    status: 'SENT' as const,
  },
  {
    id: 'msg-5',
    content: "Darslik sahifasi 45-50 gacha o'qib keling.",
    senderId: 'user-1',
    createdAt: getRandomDate(2),
    status: 'READ' as const,
  },
  {
    id: 'msg-6',
    content: 'Bu mavzuni tushunmadim, yordam bera olasizmi?',
    senderId: 'user-5',
    createdAt: getRandomDate(0),
    status: 'DELIVERED' as const,
  },
  {
    id: 'msg-7',
    content: '',
    senderId: 'user-6',
    createdAt: getRandomDate(3),
    status: 'READ' as const,
  },
  {
    id: 'msg-8',
    content: "Dars jadvali o'zgardimi?",
    senderId: 'user-7',
    createdAt: getRandomDate(5),
    status: 'READ' as const,
  },
]

// Mock thread data
export const mockMessageThreads: MessageThread[] = [
  {
    id: 'thread-1',
    studentId: 'user-2',
    teacherId: 'current-user',
    bookingId: 'booking-1',
    isActive: true,
    createdAt: getRandomDate(7),
    updatedAt: getRandomDate(0),
    lastMessage: mockMessages[0],
    otherUser: mockUsers[1],
    unreadCount: 2,
    isPinned: true,
  },
  {
    id: 'thread-2',
    studentId: 'current-user',
    teacherId: 'user-1',
    isActive: true,
    createdAt: getRandomDate(14),
    updatedAt: getRandomDate(2),
    lastMessage: mockMessages[4],
    otherUser: mockUsers[0],
    unreadCount: 0,
    isPinned: false,
  },
  {
    id: 'thread-3',
    studentId: 'user-4',
    teacherId: 'current-user',
    bookingId: 'booking-2',
    isActive: true,
    createdAt: getRandomDate(5),
    updatedAt: getRandomDate(1),
    lastMessage: mockMessages[2],
    otherUser: mockUsers[3],
    unreadCount: 0,
    isPinned: false,
  },
  {
    id: 'thread-4',
    studentId: 'current-user',
    teacherId: 'user-3',
    isActive: true,
    createdAt: getRandomDate(10),
    updatedAt: getRandomDate(1),
    lastMessage: mockMessages[3],
    otherUser: mockUsers[2],
    unreadCount: 1,
    isPinned: false,
  },
  {
    id: 'thread-5',
    studentId: 'user-5',
    teacherId: 'current-user',
    isActive: true,
    createdAt: getRandomDate(3),
    updatedAt: getRandomDate(0),
    lastMessage: mockMessages[5],
    otherUser: mockUsers[4],
    unreadCount: 1,
    isPinned: false,
  },
  {
    id: 'thread-6',
    studentId: 'current-user',
    teacherId: 'user-6',
    bookingId: 'booking-3',
    isActive: true,
    createdAt: getRandomDate(8),
    updatedAt: getRandomDate(3),
    lastMessage: mockMessages[6], // Empty message (file)
    otherUser: mockUsers[5],
    unreadCount: 0,
    isPinned: true,
  },
  {
    id: 'thread-7',
    studentId: 'user-7',
    teacherId: 'current-user',
    isActive: true,
    createdAt: getRandomDate(12),
    updatedAt: getRandomDate(5),
    lastMessage: mockMessages[7],
    otherUser: mockUsers[6],
    unreadCount: 0,
    isPinned: false,
  },
  {
    id: 'thread-8',
    studentId: 'current-user',
    teacherId: 'user-8',
    isActive: false, // Archived thread
    createdAt: getRandomDate(30),
    updatedAt: getRandomDate(15),
    lastMessage: {
      id: 'msg-9',
      content: 'Darslar tugadi. Rahmat!',
      senderId: 'current-user',
      createdAt: getRandomDate(15),
      status: 'READ' as const,
    },
    otherUser: mockUsers[7],
    unreadCount: 0,
    isPinned: false,
  },
  {
    id: 'thread-9',
    studentId: 'user-9',
    teacherId: 'current-user',
    isActive: true,
    createdAt: getRandomDate(1),
    updatedAt: getRandomDate(1),
    otherUser: {
      id: 'user-9',
      firstName: 'Jasur',
      lastName: 'Aliyev',
      avatar:
        'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face',
      role: 'student' as const,
      isOnline: false,
      lastSeen: getRandomDate(1),
    },
    unreadCount: 0,
    isPinned: false,
  },
  {
    id: 'thread-10',
    studentId: 'current-user',
    teacherId: 'user-10',
    isActive: true,
    createdAt: getRandomDate(20),
    updatedAt: getRandomDate(0),
    lastMessage: {
      id: 'msg-10',
      content: 'Bugungi dars bekor qilindi. Keyinroq xabar beraman.',
      senderId: 'user-10',
      createdAt: getRandomDate(0),
      status: 'DELIVERED' as const,
    },
    otherUser: {
      id: 'user-10',
      firstName: 'Zarina',
      lastName: 'Ergasheva',
      role: 'teacher' as const,
      isOnline: true,
    },
    unreadCount: 3,
    isPinned: false,
  },
]

// Mock API response structure
export const mockThreadsResponse = {
  threads: mockMessageThreads,
  total: mockMessageThreads.length,
  unreadTotal: mockMessageThreads.filter((t) => t.unreadCount > 0).length,
  page: 1,
  limit: 50,
}

// Hook mock implementation
export const useMockMessageThreads = (currentUserId: string) => {
  return {
    data: mockThreadsResponse,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(mockThreadsResponse),
  }
}

// Alternative mock with loading state
export const useMockMessageThreadsLoading = () => {
  return {
    data: null,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(null),
  }
}

// Alternative mock with error state
export const useMockMessageThreadsError = () => {
  return {
    data: null,
    isLoading: false,
    error: new Error('Failed to fetch message threads'),
    refetch: () => Promise.resolve(null),
  }
}

// Usage example:
/*
// Replace the useMessageThreads import with:
// import { useMockMessageThreads } from './mockData';

// Then in your component:
const { data: threadsData, isLoading, error } = useMockMessageThreads(currentUserId);

// Test with different states:
// const { data: threadsData, isLoading, error } = useMockMessageThreadsLoading();
// const { data: threadsData, isLoading, error } = useMockMessageThreadsError();
*/
