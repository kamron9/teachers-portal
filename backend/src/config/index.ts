import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const config = {
  // Environment
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3001", 10),
  apiVersion: process.env.API_VERSION || "v1",

  // Database
  databaseUrl: process.env.DATABASE_URL!,

  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  rateLimitMaxRequests: parseInt(
    process.env.RATE_LIMIT_MAX_REQUESTS || "100",
    10,
  ),

  // Redis
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",

  // Email Configuration
  smtp: {
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
    fromEmail: process.env.FROM_EMAIL!,
  },

  // SMS Configuration (Twilio)
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID!,
    authToken: process.env.TWILIO_AUTH_TOKEN!,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER!,
  },

  // File Upload (Cloudinary)
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
  },

  // Payment Gateways
  payments: {
    click: {
      merchantId: process.env.CLICK_MERCHANT_ID!,
      secretKey: process.env.CLICK_SECRET_KEY!,
      serviceId: process.env.CLICK_SERVICE_ID!,
    },
    payme: {
      merchantId: process.env.PAYME_MERCHANT_ID!,
      secretKey: process.env.PAYME_SECRET_KEY!,
    },
    uzumBank: {
      merchantId: process.env.UZUM_BANK_MERCHANT_ID!,
      secretKey: process.env.UZUM_BANK_SECRET_KEY!,
    },
    stripe: {
      publicKey: process.env.STRIPE_PUBLIC_KEY!,
      secretKey: process.env.STRIPE_SECRET_KEY!,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    },
  },

  // Platform Settings
  platform: {
    commissionRate: parseFloat(process.env.PLATFORM_COMMISSION_RATE || "0.20"),
    defaultTimezone: process.env.DEFAULT_TIMEZONE || "Asia/Tashkent",
    defaultLanguage: process.env.DEFAULT_LANGUAGE || "uz",
    minNoticeHours: parseInt(process.env.MIN_NOTICE_HOURS || "12", 10),
    maxAdvanceDays: parseInt(process.env.MAX_ADVANCE_DAYS || "30", 10),
  },

  // Verification Settings
  verification: {
    requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION === "true",
    requirePhoneVerification: process.env.REQUIRE_PHONE_VERIFICATION === "true",
    teacherAutoApproval: process.env.TEACHER_AUTO_APPROVAL === "true",
  },

  // Notification Settings
  notifications: {
    enableEmail: process.env.ENABLE_EMAIL_NOTIFICATIONS === "true",
    enableSms: process.env.ENABLE_SMS_NOTIFICATIONS === "true",
    enablePush: process.env.ENABLE_PUSH_NOTIFICATIONS === "true",
  },

  // File Upload Settings
  uploads: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10),
    maxFilesPerUpload: parseInt(process.env.MAX_FILES_PER_UPLOAD || "5", 10),
  },

  // Security Settings
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || "12", 10),
    sessionTimeoutHours: parseInt(
      process.env.SESSION_TIMEOUT_HOURS || "24",
      10,
    ),
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || "5", 10),
    lockoutTimeMinutes: parseInt(process.env.LOCKOUT_TIME_MINUTES || "15", 10),
  },

  // Admin Settings
  admin: {
    email: process.env.ADMIN_EMAIL!,
    phone: process.env.ADMIN_PHONE!,
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || "info",
    filePath: process.env.LOG_FILE_PATH || "./logs/app.log",
  },

  // Frontend URL
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  // Webhook Settings
  webhookBaseUrl: process.env.WEBHOOK_BASE_URL || "http://localhost:3001",
};

// Validate required environment variables
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "JWT_REFRESH_SECRET"];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default config;
