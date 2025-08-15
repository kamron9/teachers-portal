import Joi from "joi";

// Admin user management validation schema
export const adminUserManagementSchema = Joi.object({
  role: Joi.string()
    .valid('ALL', 'STUDENT', 'TEACHER', 'ADMIN')
    .default('ALL')
    .messages({
      'any.only': 'Role must be one of: ALL, STUDENT, TEACHER, ADMIN'
    }),
  
  isActive: Joi.string()
    .valid('true', 'false')
    .optional()
    .messages({
      'any.only': 'Active status must be either true or false'
    }),
  
  isVerified: Joi.string()
    .valid('true', 'false')
    .optional()
    .messages({
      'any.only': 'Verified status must be either true or false'
    }),
  
  search: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .optional()
    .allow('')
    .messages({
      'string.min': 'Search query must be at least 1 character',
      'string.max': 'Search query must not exceed 200 characters'
    }),
  
  sortBy: Joi.string()
    .valid('createdAt', 'email', 'lastLogin', 'role')
    .default('createdAt')
    .messages({
      'any.only': 'Sort field must be one of: createdAt, email, lastLogin, role'
    }),
  
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Sort order must be either asc or desc'
    }),
  
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(200)
    .default(50)
    .messages({
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 200'
    }),
  
  startDate: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'Start date must be in ISO format'
    }),
  
  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate'))
    .optional()
    .messages({
      'date.format': 'End date must be in ISO format',
      'date.min': 'End date must be after start date'
    })
});

// Bulk action validation schema
export const adminBulkActionSchema = Joi.object({
  userIds: Joi.array()
    .items(Joi.string().uuid({ version: 'uuidv4' }))
    .min(1)
    .max(100)
    .required()
    .messages({
      'array.min': 'At least one user ID must be provided',
      'array.max': 'Maximum 100 users can be processed at once',
      'any.required': 'User IDs are required'
    }),
  
  action: Joi.string()
    .valid('ACTIVATE', 'DEACTIVATE', 'DELETE', 'RESET_PASSWORD', 'SEND_NOTIFICATION')
    .required()
    .messages({
      'any.only': 'Action must be one of: ACTIVATE, DEACTIVATE, DELETE, RESET_PASSWORD, SEND_NOTIFICATION',
      'any.required': 'Action is required'
    }),
  
  reason: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .required()
    .messages({
      'string.min': 'Reason must be at least 5 characters',
      'string.max': 'Reason must not exceed 500 characters',
      'any.required': 'Reason is required'
    }),
  
  notificationMessage: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .optional()
    .when('action', {
      is: 'SEND_NOTIFICATION',
      then: Joi.required(),
    })
    .messages({
      'string.min': 'Notification message must be at least 10 characters',
      'string.max': 'Notification message must not exceed 2000 characters',
      'any.required': 'Notification message is required when action is SEND_NOTIFICATION'
    })
});

// System configuration validation schema
export const adminSystemConfigSchema = Joi.object({
  maintenance: Joi.object({
    enabled: Joi.boolean().optional(),
    message: Joi.string().max(1000).optional().allow(''),
    scheduledStart: Joi.date().iso().optional(),
    scheduledEnd: Joi.date().iso().min(Joi.ref('scheduledStart')).optional(),
  }).optional(),
  
  features: Joi.object({
    registrationEnabled: Joi.boolean().optional(),
    paymentEnabled: Joi.boolean().optional(),
    notificationsEnabled: Joi.boolean().optional(),
    reviewModerationEnabled: Joi.boolean().optional(),
    teacherVerificationRequired: Joi.boolean().optional(),
  }).optional(),
  
  limits: Joi.object({
    maxFileSize: Joi.string().pattern(/^\d+[KMGT]?B$/).optional(),
    maxBookingsPerUser: Joi.number().integer().min(1).max(1000).optional(),
    sessionTimeout: Joi.string().pattern(/^\d+[hmd]$/).optional(),
    rateLimit: Joi.object({
      windowMs: Joi.number().integer().min(1000).optional(),
      maxRequests: Joi.number().integer().min(1).optional(),
    }).optional(),
  }).optional(),
  
  email: Joi.object({
    provider: Joi.string().valid('sendgrid', 'smtp', 'ses').optional(),
    fromAddress: Joi.string().email().optional(),
    fromName: Joi.string().max(100).optional(),
    replyToAddress: Joi.string().email().optional(),
  }).optional(),
  
  payment: Joi.object({
    provider: Joi.string().valid('stripe', 'paypal', 'click').optional(),
    currency: Joi.string().valid('USD', 'UZS', 'EUR', 'GBP').optional(),
    commissionRate: Joi.number().min(0).max(1).optional(),
    minimumPayout: Joi.number().min(0).optional(),
  }).optional(),
  
  notifications: Joi.object({
    emailEnabled: Joi.boolean().optional(),
    smsEnabled: Joi.boolean().optional(),
    pushEnabled: Joi.boolean().optional(),
    defaultPreferences: Joi.object({
      bookingReminders: Joi.boolean().optional(),
      paymentConfirmations: Joi.boolean().optional(),
      reviewRequests: Joi.boolean().optional(),
      promotions: Joi.boolean().optional(),
    }).optional(),
  }).optional(),
  
  security: Joi.object({
    passwordPolicy: Joi.object({
      minLength: Joi.number().integer().min(6).max(128).optional(),
      requireUppercase: Joi.boolean().optional(),
      requireLowercase: Joi.boolean().optional(),
      requireNumbers: Joi.boolean().optional(),
      requireSymbols: Joi.boolean().optional(),
      maxAge: Joi.number().integer().min(30).optional(), // days
    }).optional(),
    twoFactorRequired: Joi.boolean().optional(),
    sessionSecurity: Joi.object({
      maxConcurrentSessions: Joi.number().integer().min(1).max(10).optional(),
      ipWhitelisting: Joi.boolean().optional(),
      deviceTracking: Joi.boolean().optional(),
    }).optional(),
  }).optional()
}).min(1).messages({
  'object.min': 'At least one configuration field must be provided'
});

// Analytics query validation schema
export const adminAnalyticsQuerySchema = Joi.object({
  period: Joi.string()
    .valid('week', 'month', 'quarter', 'year', 'custom')
    .default('month')
    .messages({
      'any.only': 'Period must be one of: week, month, quarter, year, custom'
    }),
  
  startDate: Joi.date()
    .iso()
    .optional()
    .when('period', {
      is: 'custom',
      then: Joi.required(),
    })
    .messages({
      'date.format': 'Start date must be in ISO format',
      'any.required': 'Start date is required when period is custom'
    }),
  
  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate'))
    .optional()
    .when('period', {
      is: 'custom',
      then: Joi.required(),
    })
    .messages({
      'date.format': 'End date must be in ISO format',
      'date.min': 'End date must be after start date',
      'any.required': 'End date is required when period is custom'
    }),
  
  metric: Joi.string()
    .valid(
      'users',
      'bookings',
      'revenue',
      'teachers',
      'students',
      'reviews',
      'growth',
      'retention',
      'engagement'
    )
    .optional()
    .messages({
      'any.only': 'Metric must be one of: users, bookings, revenue, teachers, students, reviews, growth, retention, engagement'
    }),
  
  groupBy: Joi.string()
    .valid('day', 'week', 'month', 'role', 'subject', 'region')
    .default('day')
    .messages({
      'any.only': 'Group by must be one of: day, week, month, role, subject, region'
    }),
  
  includeComparisons: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'Include comparisons must be a boolean value'
    }),
  
  filters: Joi.object({
    role: Joi.string().valid('STUDENT', 'TEACHER').optional(),
    region: Joi.string().max(100).optional(),
    subject: Joi.string().max(100).optional(),
    verified: Joi.boolean().optional(),
    active: Joi.boolean().optional(),
  }).optional()
});

// Moderation queue validation schema
export const adminModerationSchema = Joi.object({
  type: Joi.string()
    .valid('all', 'reviews', 'teachers', 'reports', 'content')
    .default('all')
    .messages({
      'any.only': 'Type must be one of: all, reviews, teachers, reports, content'
    }),
  
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'urgent')
    .optional()
    .messages({
      'any.only': 'Priority must be one of: low, medium, high, urgent'
    }),
  
  status: Joi.string()
    .valid('pending', 'in_review', 'escalated')
    .default('pending')
    .messages({
      'any.only': 'Status must be one of: pending, in_review, escalated'
    }),
  
  assignedTo: Joi.string()
    .uuid({ version: 'uuidv4' })
    .optional()
    .messages({
      'string.uuid': 'Assigned to must be a valid admin user ID'
    }),
  
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 100'
    }),
  
  sortBy: Joi.string()
    .valid('createdAt', 'priority', 'type', 'assignedTo')
    .default('createdAt')
    .messages({
      'any.only': 'Sort field must be one of: createdAt, priority, type, assignedTo'
    }),
  
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('asc')
    .messages({
      'any.only': 'Sort order must be either asc or desc'
    })
});

// Admin action audit validation schema
export const adminAuditSchema = Joi.object({
  action: Joi.string()
    .valid(
      'USER_CREATED',
      'USER_UPDATED',
      'USER_DELETED',
      'USER_ACTIVATED',
      'USER_DEACTIVATED',
      'TEACHER_VERIFIED',
      'TEACHER_UNVERIFIED',
      'REVIEW_MODERATED',
      'BULK_ACTION_PERFORMED',
      'SYSTEM_CONFIG_UPDATED',
      'BACKUP_CREATED',
      'DATA_EXPORTED'
    )
    .optional()
    .messages({
      'any.only': 'Action must be a valid audit action type'
    }),
  
  resource: Joi.string()
    .valid('user', 'teacher', 'student', 'review', 'booking', 'payment', 'system')
    .optional()
    .messages({
      'any.only': 'Resource must be one of: user, teacher, student, review, booking, payment, system'
    }),
  
  adminId: Joi.string()
    .uuid({ version: 'uuidv4' })
    .optional()
    .messages({
      'string.uuid': 'Admin ID must be a valid UUID'
    }),
  
  startDate: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'Start date must be in ISO format'
    }),
  
  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate'))
    .optional()
    .messages({
      'date.format': 'End date must be in ISO format',
      'date.min': 'End date must be after start date'
    }),
  
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(500)
    .default(50)
    .messages({
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 500'
    })
});

// Report generation validation schema
export const adminReportSchema = Joi.object({
  reportType: Joi.string()
    .valid(
      'user_activity',
      'financial_summary',
      'teacher_performance',
      'student_engagement',
      'system_usage',
      'security_audit',
      'content_moderation'
    )
    .required()
    .messages({
      'any.only': 'Report type must be one of: user_activity, financial_summary, teacher_performance, student_engagement, system_usage, security_audit, content_moderation',
      'any.required': 'Report type is required'
    }),
  
  format: Joi.string()
    .valid('json', 'csv', 'xlsx', 'pdf')
    .default('json')
    .messages({
      'any.only': 'Format must be one of: json, csv, xlsx, pdf'
    }),
  
  startDate: Joi.date()
    .iso()
    .required()
    .messages({
      'date.format': 'Start date must be in ISO format',
      'any.required': 'Start date is required'
    }),
  
  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate'))
    .required()
    .messages({
      'date.format': 'End date must be in ISO format',
      'date.min': 'End date must be after start date',
      'any.required': 'End date is required'
    }),
  
  filters: Joi.object({
    userRoles: Joi.array().items(Joi.string().valid('STUDENT', 'TEACHER', 'ADMIN')).optional(),
    regions: Joi.array().items(Joi.string().max(100)).optional(),
    subjects: Joi.array().items(Joi.string().max(100)).optional(),
    verifiedOnly: Joi.boolean().optional(),
    activeOnly: Joi.boolean().optional(),
    minBookings: Joi.number().integer().min(0).optional(),
    minRevenue: Joi.number().min(0).optional(),
  }).optional(),
  
  includeDetails: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'Include details must be a boolean value'
    }),
  
  emailTo: Joi.array()
    .items(Joi.string().email())
    .max(10)
    .optional()
    .messages({
      'array.max': 'Maximum 10 email addresses can be provided'
    })
});

// Feature flag validation schema
export const adminFeatureFlagSchema = Joi.object({
  flagName: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .pattern(/^[a-zA-Z][a-zA-Z0-9_]*$/)
    .required()
    .messages({
      'string.min': 'Feature flag name must be at least 3 characters',
      'string.max': 'Feature flag name must not exceed 100 characters',
      'string.pattern.base': 'Feature flag name must start with a letter and contain only letters, numbers, and underscores',
      'any.required': 'Feature flag name is required'
    }),
  
  enabled: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'Enabled must be a boolean value',
      'any.required': 'Enabled status is required'
    }),
  
  description: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description must not exceed 500 characters'
    }),
  
  rolloutPercentage: Joi.number()
    .min(0)
    .max(100)
    .default(100)
    .messages({
      'number.min': 'Rollout percentage must be at least 0',
      'number.max': 'Rollout percentage must not exceed 100'
    }),
  
  targetUsers: Joi.object({
    roles: Joi.array().items(Joi.string().valid('STUDENT', 'TEACHER', 'ADMIN')).optional(),
    userIds: Joi.array().items(Joi.string().uuid()).max(1000).optional(),
    regions: Joi.array().items(Joi.string().max(100)).optional(),
  }).optional(),
  
  schedule: Joi.object({
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
  }).optional()
});

// Export all admin validation schemas
export {
  adminUserManagementSchema,
  adminBulkActionSchema,
  adminSystemConfigSchema,
  adminAnalyticsQuerySchema,
  adminModerationSchema,
  adminAuditSchema,
  adminReportSchema,
  adminFeatureFlagSchema
};
