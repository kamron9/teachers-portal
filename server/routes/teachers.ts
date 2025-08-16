import { RequestHandler } from "express";

// Mock teachers data
const mockTeachers = [
  {
    id: "1",
    userId: "user1",
    firstName: "Dilshod",
    lastName: "Karimov",
    avatar: null,
    bioUz: "Matematika o'qituvchisi",
    bioRu: "Преподаватель математики",
    bioEn: "Math teacher",
    experienceYears: 5,
    education: [],
    certificates: [],
    languagesTaught: ["uz", "ru"],
    languagesSpoken: ["uz", "ru", "en"],
    verificationStatus: "APPROVED",
    timezone: "Asia/Tashkent",
    isActive: true,
    rating: 4.8,
    totalReviews: 24,
    totalLessons: 156,
    totalEarnings: 5000000,
    subjectOfferings: [
      {
        id: "1",
        teacherId: "1",
        subjectName: "Matematika",
        subjectNameUz: "Matematika",
        subjectNameRu: "Математика",
        subjectNameEn: "Mathematics",
        level: "ALL_LEVELS",
        pricePerHour: 8000000, // 80,000 UZS in kopeks
        delivery: "ONLINE",
        icon: "BAR_CHART",
        status: "PUBLISHED",
        orderIndex: 0
      }
    ]
  },
  {
    id: "2",
    userId: "user2",
    firstName: "Madina",
    lastName: "Abdullayeva",
    avatar: null,
    bioUz: "Ingliz tili o'qituvchisi",
    bioRu: "Преподаватель английского языка",
    bioEn: "English teacher",
    experienceYears: 8,
    education: [],
    certificates: [],
    languagesTaught: ["en", "uz"],
    languagesSpoken: ["uz", "ru", "en"],
    verificationStatus: "APPROVED",
    timezone: "Asia/Tashkent",
    isActive: true,
    rating: 4.9,
    totalReviews: 45,
    totalLessons: 289,
    totalEarnings: 12000000,
    subjectOfferings: [
      {
        id: "2",
        teacherId: "2",
        subjectName: "Ingliz tili",
        subjectNameUz: "Ingliz tili",
        subjectNameRu: "Английский язык",
        subjectNameEn: "English",
        level: "ALL_LEVELS",
        pricePerHour: 10000000, // 100,000 UZS in kopeks
        delivery: "ONLINE",
        icon: "SPEECH_BUBBLE",
        status: "PUBLISHED",
        orderIndex: 0
      }
    ]
  }
];

// Mock subjects data
const mockSubjects = [
  {
    id: "1",
    name: "Matematika",
    nameUz: "Matematika",
    nameRu: "Математика", 
    nameEn: "Mathematics",
    description: "Boshlang'ich va o'rta maktab matematikasi",
    category: "STEM",
    isActive: true,
    teacherCount: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Ingliz tili",
    nameUz: "Ingliz tili",
    nameRu: "Английск��й язык",
    nameEn: "English",
    description: "Ingliz tilini o'rganish barcha darajalar uchun",
    category: "Languages",
    isActive: true,
    teacherCount: 22,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3", 
    name: "Fizika",
    nameUz: "Fizika",
    nameRu: "Физика",
    nameEn: "Physics",
    description: "O'rta maktab va oliy maktab fizikasi",
    category: "STEM",
    isActive: true,
    teacherCount: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const handleSearchTeachers: RequestHandler = (req, res) => {
  const { query, subjects, page = 1, limit = 20 } = req.query;
  
  let filteredTeachers = [...mockTeachers];
  
  // Filter by query
  if (query && typeof query === 'string') {
    const searchTerm = query.toLowerCase();
    filteredTeachers = filteredTeachers.filter(teacher => 
      teacher.firstName.toLowerCase().includes(searchTerm) ||
      teacher.lastName.toLowerCase().includes(searchTerm) ||
      teacher.bioUz?.toLowerCase().includes(searchTerm) ||
      teacher.subjectOfferings.some(offering => 
        offering.subjectName.toLowerCase().includes(searchTerm)
      )
    );
  }
  
  // Filter by subjects
  if (subjects && Array.isArray(subjects)) {
    filteredTeachers = filteredTeachers.filter(teacher =>
      teacher.subjectOfferings.some(offering =>
        subjects.some(subject => 
          offering.subjectName.toLowerCase().includes((subject as string).toLowerCase())
        )
      )
    );
  }
  
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  
  const paginatedTeachers = filteredTeachers.slice(startIndex, endIndex);
  
  res.json({
    data: paginatedTeachers,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filteredTeachers.length,
      pages: Math.ceil(filteredTeachers.length / limitNum)
    },
    appliedFilters: {
      query: query || null,
      subjects: subjects || []
    }
  });
};

export const handleGetSubjects: RequestHandler = (req, res) => {
  const { query, category, page = 1, limit = 20 } = req.query;

  let filteredSubjects = [...mockSubjects];

  // Filter by query
  if (query && typeof query === 'string') {
    const searchTerm = query.toLowerCase();
    filteredSubjects = filteredSubjects.filter(subject =>
      subject.name.toLowerCase().includes(searchTerm) ||
      subject.nameUz?.toLowerCase().includes(searchTerm) ||
      subject.nameRu?.toLowerCase().includes(searchTerm) ||
      subject.nameEn?.toLowerCase().includes(searchTerm) ||
      subject.description?.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by category
  if (category && typeof category === 'string') {
    filteredSubjects = filteredSubjects.filter(subject =>
      subject.category.toLowerCase() === category.toLowerCase()
    );
  }

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;

  const paginatedSubjects = filteredSubjects.slice(startIndex, endIndex);

  // Get unique categories
  const categories = [...new Set(mockSubjects.map(s => s.category))];

  res.json({
    data: paginatedSubjects,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filteredSubjects.length,
      pages: Math.ceil(filteredSubjects.length / limitNum)
    },
    categories
  });
};

// Mock wallet endpoints
export const handleGetWalletBalance: RequestHandler = (req, res) => {
  res.json({
    availableBalance: 50000000, // 500,000 UZS in kopeks
    pendingBalance: 15000000,   // 150,000 UZS in kopeks
    totalEarnings: 200000000    // 2,000,000 UZS in kopeks
  });
};

export const handleGetWalletEntries: RequestHandler = (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const mockEntries = [
    {
      id: "1",
      amount: 8000000,
      description: "Matematika darsi - Dilshod Karimov",
      status: "AVAILABLE",
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      amount: 7000000,
      description: "Fizika darsi - Madina Abdullayeva",
      status: "PENDING",
      createdAt: new Date().toISOString()
    }
  ];

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);

  res.json({
    data: mockEntries,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: mockEntries.length,
      pages: Math.ceil(mockEntries.length / limitNum)
    }
  });
};

// Generic 404 handler for unimplemented endpoints
export const handleNotImplemented: RequestHandler = (req, res) => {
  res.status(501).json({
    error: "NotImplemented",
    message: `Endpoint ${req.path} is not yet implemented in mock server`,
    mockData: true
  });
};
