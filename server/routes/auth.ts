import { RequestHandler } from "express";

// Mock user data
const mockUsers = [
  {
    id: "1",
    email: "student@test.com",
    password: "password123", // In real app, this would be hashed
    role: "STUDENT",
    emailVerified: true,
    phoneVerified: false,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profile: {
      id: "1",
      userId: "1",
      firstName: "Ali",
      lastName: "Karimov",
      avatar: null,
      timezone: "Asia/Tashkent",
      preferredLanguages: ["uz", "ru"],
    },
  },
  {
    id: "2",
    email: "teacher@test.com",
    password: "password123",
    role: "TEACHER",
    emailVerified: true,
    phoneVerified: false,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profile: {
      id: "2",
      userId: "2",
      firstName: "Madina",
      lastName: "Abdullayeva",
      avatar: null,
      bioUz: "Ingliz tili o'qituvchisi",
      bioRu: "Преподаватель английского языка",
      bioEn: "English teacher",
      experienceYears: 8,
      languagesTaught: ["en", "uz"],
      languagesSpoken: ["uz", "ru", "en"],
      verificationStatus: "APPROVED",
      timezone: "Asia/Tashkent",
      isActive: true,
      rating: 4.9,
      totalReviews: 45,
      totalLessons: 289,
      totalEarnings: 12000000,
    },
  },
  {
    id: "3",
    email: "admin@test.com",
    password: "admin123",
    role: "ADMIN",
    emailVerified: true,
    phoneVerified: false,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profile: {
      id: "3",
      userId: "3",
      firstName: "Admin",
      lastName: "User",
      avatar: null,
      timezone: "Asia/Tashkent",
      preferredLanguages: ["uz", "ru", "en"],
    },
  },
];

// Generate mock JWT token
function generateMockToken(user: any): string {
  return `mock_jwt_token_${user.id}_${Date.now()}`;
}

export const handleLogin: RequestHandler = (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Email va parol majburiy",
        fields: {
          email: !email ? ["Email majburiy"] : [],
          password: !password ? ["Parol majburiy"] : [],
        },
      });
    }

    // Find user
    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (!user) {
      return res.status(401).json({
        error: "InvalidCredentials",
        message: "Email yoki parol noto'g'ri",
      });
    }

    // Check password (in real app, compare hashed passwords)
    if (user.password !== password) {
      return res.status(401).json({
        error: "InvalidCredentials",
        message: "Email yoki parol noto'g'ri",
      });
    }

    // Check user status
    if (user.status !== "ACTIVE") {
      return res.status(401).json({
        error: "AccountInactive",
        message: "Hisob faol emas",
      });
    }

    // Generate tokens
    const accessToken = generateMockToken(user);
    const refreshToken = `refresh_${generateMockToken(user)}`;
    const expiresIn = 3600; // 1 hour

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      accessToken,
      refreshToken,
      expiresIn,
      message: "Muvaffaqiyatli kirildi",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "InternalServerError",
      message: "Server xatosi yuz berdi",
    });
  }
};

export const handleRegister: RequestHandler = (req, res) => {
  try {
    const { email, password, role, firstName, lastName, phone } = req.body;

    // Validate input
    if (!email || !password || !role || !firstName || !lastName) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Barcha majburiy maydonlarni to'ldiring",
        fields: {
          email: !email ? ["Email majburiy"] : [],
          password: !password ? ["Parol majburiy"] : [],
          role: !role ? ["Rol majburiy"] : [],
          firstName: !firstName ? ["Ism majburiy"] : [],
          lastName: !lastName ? ["Familiya majburiy"] : [],
        },
      });
    }

    // Check if user already exists
    const existingUser = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (existingUser) {
      return res.status(409).json({
        error: "UserExists",
        message: "Bu email bilan foydalanuvchi mavjud",
      });
    }

    // Create new user
    const newUser = {
      id: String(mockUsers.length + 1),
      email: email.toLowerCase(),
      password, // In real app, hash this
      role: role.toUpperCase(),
      emailVerified: false,
      phoneVerified: false,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        id: String(mockUsers.length + 1),
        userId: String(mockUsers.length + 1),
        firstName,
        lastName,
        avatar: null,
        timezone: "Asia/Tashkent",
        preferredLanguages: ["uz"],
      },
    };

    // Add to mock database
    mockUsers.push(newUser as any);

    // Generate tokens
    const accessToken = generateMockToken(newUser);
    const refreshToken = `refresh_${generateMockToken(newUser)}`;
    const expiresIn = 3600;

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      user: userWithoutPassword,
      accessToken,
      refreshToken,
      expiresIn,
      message: "Ro'yxatdan o'tish muvaffaqiyatli",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      error: "InternalServerError",
      message: "Server xatosi yuz berdi",
    });
  }
};

export const handleGetCurrentUser: RequestHandler = (req, res) => {
  // In real app, decode JWT token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Autentifikatsiya talab qilinadi",
    });
  }

  // Mock: extract user ID from token (in real app, verify JWT)
  const token = authHeader.split(" ")[1];
  const userIdMatch = token.match(/mock_jwt_token_(\d+)_/);

  if (!userIdMatch) {
    return res.status(401).json({
      error: "InvalidToken",
      message: "Yaroqsiz token",
    });
  }

  const userId = userIdMatch[1];
  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    return res.status(401).json({
      error: "UserNotFound",
      message: "Foydalanuvchi topilmadi",
    });
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  res.json(userWithoutPassword);
};

export const handleLogout: RequestHandler = (req, res) => {
  // In real app, blacklist the token or remove from session
  res.json({
    message: "Muvaffaqiyatli chiqildi",
  });
};

export const handleRefreshToken: RequestHandler = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      error: "ValidationError",
      message: "Refresh token majburiy",
    });
  }

  // Mock: extract user ID from refresh token
  const userIdMatch = refreshToken.match(/refresh_mock_jwt_token_(\d+)_/);

  if (!userIdMatch) {
    return res.status(401).json({
      error: "InvalidToken",
      message: "Yaroqsiz refresh token",
    });
  }

  const userId = userIdMatch[1];
  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    return res.status(401).json({
      error: "UserNotFound",
      message: "Foydalanuvchi topilmadi",
    });
  }

  // Generate new tokens
  const accessToken = generateMockToken(user);
  const newRefreshToken = `refresh_${generateMockToken(user)}`;
  const expiresIn = 3600;

  res.json({
    accessToken,
    refreshToken: newRefreshToken,
    expiresIn,
  });
};
