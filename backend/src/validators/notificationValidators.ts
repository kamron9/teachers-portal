import Joi from "joi";

// Notification types enum for validation
const NOTIFICATION_TYPES = [
  'BOOKING_CONFIRMATION',
  'BOOKING_REMINDER',
  'BOOKING_CANCELLATION',
  'BOOKING_RESCHEDULED',
  'PAYMENT_CONFIRMATION',
  'PAYMENT_FAILED',
  'PAYMENT_REFUND',
  'REVIEW_REQUEST',
  'REVIEW_RECEIVED',
  'MESSAGE_RECEIVED',
  'TEACHER_VERIFIED',
  'TEACHER_APPLICATION_STATUS',
  'STUDENT_WELCOME',
  'PROMOTIONS',
  'SYSTEM_UPDATES',
  'MAINTENANCE_NOTICE',
  'SECURITY_ALERT'
];

const NOTIFICATION_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const NOTIFICATION_CHANNELS = ['IN_APP', 'EMAIL', 'SMS', 'PUSH'];

// Create notification validation schema
export const createNotificationSchema = Joi.object({
  userId: Joi.string()
    .uuid({ version: 'uuidv4' })
    .optional()
    .messages({
      'string.uuid': 'User ID must be a valid UUID'
    }),
  
  userIds: Joi.array()
    .items(Joi.string().uuid({ version: 'uuidv4' }))
    .min(1)
    .max(1000)
    .optional()
    .messages({
      'array.min': 'At least one user ID must be provided',
      'array.max': 'Maximum 1000 users can be notified at once'
    }),
  
  type: Joi.string()
    .valid(...NOTIFICATION_TYPES)
    .required()
    .messages({
      'any.only': `Notification type must be one of: ${NOTIFICATION_TYPES.join(', ')}`,
      'any.required': 'Notification type is required'
    }),
  
  title: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title must be at least 1 character',
      'string.max': 'Title must not exceed 200 characters',
      'any.required': 'Title is required'
    }),
  
  message: Joi.string()
    .trim()
    .min(1)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Message must be at least 1 character',
      'string.max': 'Message must not exceed 2000 characters',
      'any.required': 'Message is required'
    }),
  
  priority: Joi.string()
    .valid(...NOTIFICATION_PRIORITIES)
    .default('MEDIUM')
    .messages({
      'any.only': `Priority must be one of: ${NOTIFICATION_PRIORITIES.join(', ')}`
    }),
  
  actionUrl: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .optional()
    .allow('')
    .messages({
      'string.uri': 'Action URL must be a valid HTTP/HTTPS URL'
    }),
  
  relatedBookingId: Joi.string()
    .uuid({ version: 'uuidv4' })
    .optional()
    .messages({
      'string.uuid': 'Related booking ID must be a valid UUID'
    }),
  
  relatedPaymentId: Joi.string()
    .uuid({ version: 'uuidv4' })
    .optional()
    .messages({
      'string.uuid': 'Related payment ID must be a valid UUID'
    }),
  
  relatedUserId: Joi.string()
    .uuid({ version: 'uuidv4' })
    .optional()
    .messages({
      'string.uuid': 'Related user ID must be a valid UUID'
    }),
  
  scheduledFor: Joi.date()
    .iso()
    .min('now')
    .optional()
    .messages({
      'date.format': 'Scheduled date must be in ISO format',
      'date.min': 'Scheduled date must be in the future'
    }),
  
  channels: Joi.array()
    .items(Joi.string().valid(...NOTIFICATION_CHANNELS))
    .min(1)
    .default(['IN_APP'])
    .messages({
      'array.min': 'At least one notification channel must be specified',
      'any.only': `Channel must be one of: ${NOTIFICATION_CHANNELS.join(', ')}`
    }),
  
  metadata: Joi.object()
    .max(50)
    .optional()
    .messages({
      'object.max': 'Metadata can have maximum 50 properties'
    })
}).xor('userId', 'userIds').messages({
  'object.xor': 'Either userId or userIds must be provided, but not both'
});

// Update notification validation schema
export const updateNotificationSchema = Joi.object({
  isRead: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'isRead must be a boolean value'
    }),
  
  readAt: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'Read date must be in ISO format'
    }),
  
  actionTaken: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'actionTaken must be a boolean value'
    }),
  
  actionTakenAt: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'Action taken date must be in ISO format'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

// Notification query validation schema
export const notificationQuerySchema = Joi.object({
  type: Joi.string()
    .valid(...NOTIFICATION_TYPES)
    .optional()
    .messages({
      'any.only': `Notification type must be one of: ${NOTIFICATION_TYPES.join(', ')}`
    }),
  
  isRead: Joi.string()
    .valid('true', 'false')
    .optional()
    .messages({
      'any.only': 'isRead must be either true or false'
    }),
  
  priority: Joi.string()
    .valid(...NOTIFICATION_PRIORITIES)
    .optional()
    .messages({
      'any.only': `Priority must be one of: ${NOTIFICATION_PRIORITIES.join(', ')}`
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
  
  sortBy: Joi.string()
    .valid('createdAt', 'priority', 'type', 'isRead')
    .default('createdAt')
    .messages({
      'any.only': 'Sort field must be one of: createdAt, priority, type, isRead'
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
    .max(100)
    .default(20)
    .messages({
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 100'
    }),
  
  includeRead: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'includeRead must be a boolean value'
    })
});

// Bulk notification validation schema
export const bulkNotificationSchema = Joi.object({
  notifications: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string()
          .uuid({ version: 'uuidv4' })
          .required()
          .messages({
            'string.uuid': 'User ID must be a valid UUID',
            'any.required': 'User ID is required'
          }),
        
        type: Joi.string()
          .valid(...NOTIFICATION_TYPES)
          .required()
          .messages({
            'any.only': `Notification type must be one of: ${NOTIFICATION_TYPES.join(', ')}`,
            'any.required': 'Notification type is required'
          }),
        
        title: Joi.string()
          .trim()
          .min(1)
          .max(200)
          .required()
          .messages({
            'string.min': 'Title must be at least 1 character',
            'string.max': 'Title must not exceed 200 characters',
            'any.required': 'Title is required'
          }),
        
        message: Joi.string()
          .trim()
          .min(1)
          .max(2000)
          .required()
          .messages({
            'string.min': 'Message must be at least 1 character',
            'string.max': 'Message must not exceed 2000 characters',
            'any.required': 'Message is required'
          }),
        
        priority: Joi.string()
          .valid(...NOTIFICATION_PRIORITIES)
          .default('MEDIUM')
          .messages({
            'any.only': `Priority must be one of: ${NOTIFICATION_PRIORITIES.join(', ')}`
          }),
        
        actionUrl: Joi.string()
          .uri({ scheme: ['http', 'https'] })
          .optional()
          .allow('')
          .messages({
            'string.uri': 'Action URL must be a valid HTTP/HTTPS URL'
          }),
        
        relatedBookingId: Joi.string()
          .uuid({ version: 'uuidv4' })
          .optional()
          .messages({
            'string.uuid': 'Related booking ID must be a valid UUID'
          }),
        
        relatedPaymentId: Joi.string()
          .uuid({ version: 'uuidv4' })
          .optional()
          .messages({
            'string.uuid': 'Related payment ID must be a valid UUID'
          }),
        
        channels: Joi.array()
          .items(Joi.string().valid(...NOTIFICATION_CHANNELS))
          .min(1)
          .default(['IN_APP'])
          .messages({
            'array.min': 'At least one notification channel must be specified',
            'any.only': `Channel must be one of: ${NOTIFICATION_CHANNELS.join(', ')}`
          }),
        
        metadata: Joi.object()
          .max(20)
          .optional()
          .messages({
            'object.max': 'Metadata can have maximum 20 properties'
          })
      })
    )
    .min(1)
    .max(100)
    .required()
    .messages({
      'array.min': 'At least one notification must be provided',
      'array.max': 'Maximum 100 notifications can be created at once',
      'any.required': 'Notifications array is required'
    }),
  
  sendImmediately: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'sendImmediately must be a boolean value'
    }),
  
  scheduledFor: Joi.date()
    .iso()
    .min('now')
    .optional()
    .when('sendImmediately', {
      is: false,
      then: Joi.required(),
    })
    .messages({
      'date.format': 'Scheduled date must be in ISO format',
      'date.min': 'Scheduled date must be in the future',
      'any.required': 'Scheduled date is required when sendImmediately is false'
    })
});

// Notification preferences validation schema
export const notificationPreferencesSchema = Joi.object({
  preferences: Joi.object({
    email: Joi.object()
      .pattern(
        Joi.string().valid(...NOTIFICATION_TYPES),
        Joi.boolean()
      )
      .optional()
      .messages({
        'object.pattern.match': `Email preference keys must be valid notification types: ${NOTIFICATION_TYPES.join(', ')}`
      }),
    
    sms: Joi.object()
      .pattern(
        Joi.string().valid(...NOTIFICATION_TYPES),
        Joi.boolean()
      )
      .optional()
      .messages({
        'object.pattern.match': `SMS preference keys must be valid notification types: ${NOTIFICATION_TYPES.join(', ')}`
      }),
    
    push: Joi.object()
      .pattern(
        Joi.string().valid(...NOTIFICATION_TYPES),
        Joi.boolean()
      )
      .optional()
      .messages({
        'object.pattern.match': `Push preference keys must be valid notification types: ${NOTIFICATION_TYPES.join(', ')}`
      }),
    
    inApp: Joi.object()
      .pattern(
        Joi.string().valid(...NOTIFICATION_TYPES),
        Joi.boolean()
      )
      .optional()
      .messages({
        'object.pattern.match': `In-app preference keys must be valid notification types: ${NOTIFICATION_TYPES.join(', ')}`
      }),
    
    quietHours: Joi.object({
      enabled: Joi.boolean().default(false),
      startTime: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .optional()
        .messages({
          'string.pattern.base': 'Start time must be in HH:MM format'
        }),
      endTime: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .optional()
        .messages({
          'string.pattern.base': 'End time must be in HH:MM format'
        }),
      timezone: Joi.string()
        .optional()
        .messages({
          'string.base': 'Timezone must be a valid timezone string'
        })
    }).optional(),
    
    frequency: Joi.object({
      digest: Joi.string()
        .valid('IMMEDIATE', 'HOURLY', 'DAILY', 'WEEKLY')
        .default('IMMEDIATE')
        .messages({
          'any.only': 'Digest frequency must be one of: IMMEDIATE, HOURLY, DAILY, WEEKLY'
        }),
      maxPerDay: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(50)
        .messages({
          'number.integer': 'Max per day must be an integer',
          'number.min': 'Max per day must be at least 1',
          'number.max': 'Max per day must not exceed 100'
        })
    }).optional()
  })
  .required()
  .messages({
    'any.required': 'Preferences object is required'
  })
});

// Notification template validation schema
export const notificationTemplateSchema = Joi.object({
  type: Joi.string()
    .valid(...NOTIFICATION_TYPES)
    .required()
    .messages({
      'any.only': `Notification type must be one of: ${NOTIFICATION_TYPES.join(', ')}`,
      'any.required': 'Notification type is required'
    }),
  
  channel: Joi.string()
    .valid(...NOTIFICATION_CHANNELS)
    .required()
    .messages({
      'any.only': `Channel must be one of: ${NOTIFICATION_CHANNELS.join(', ')}`,
      'any.required': 'Channel is required'
    }),
  
  language: Joi.string()
    .valid('en', 'uz', 'ru')
    .default('en')
    .messages({
      'any.only': 'Language must be one of: en, uz, ru'
    }),
  
  subject: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .required()
    .when('channel', {
      is: Joi.valid('EMAIL'),
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'string.min': 'Subject must be at least 1 character',
      'string.max': 'Subject must not exceed 200 characters',
      'any.required': 'Subject is required for email notifications'
    }),
  
  title: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title must be at least 1 character',
      'string.max': 'Title must not exceed 200 characters',
      'any.required': 'Title is required'
    }),
  
  body: Joi.string()
    .trim()
    .min(1)
    .max(5000)
    .required()
    .messages({
      'string.min': 'Body must be at least 1 character',
      'string.max': 'Body must not exceed 5000 characters',
      'any.required': 'Body is required'
    }),
  
  variables: Joi.array()
    .items(Joi.string().pattern(/^[a-zA-Z][a-zA-Z0-9_]*$/))
    .optional()
    .messages({
      'string.pattern.base': 'Variable names must start with a letter and contain only letters, numbers, and underscores'
    }),
  
  isActive: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'isActive must be a boolean value'
    })
});

// Notification analytics query schema
export const notificationAnalyticsSchema = Joi.object({
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
  
  groupBy: Joi.string()
    .valid('hour', 'day', 'week', 'month', 'type', 'channel', 'priority')
    .default('day')
    .messages({
      'any.only': 'Group by must be one of: hour, day, week, month, type, channel, priority'
    }),
  
  metrics: Joi.array()
    .items(Joi.string().valid('sent', 'delivered', 'read', 'clicked', 'failed'))
    .min(1)
    .default(['sent', 'read'])
    .messages({
      'array.min': 'At least one metric must be specified',
      'any.only': 'Metrics must be one of: sent, delivered, read, clicked, failed'
    }),
  
  filters: Joi.object({
    type: Joi.string().valid(...NOTIFICATION_TYPES).optional(),
    channel: Joi.string().valid(...NOTIFICATION_CHANNELS).optional(),
    priority: Joi.string().valid(...NOTIFICATION_PRIORITIES).optional(),
    userId: Joi.string().uuid().optional(),
    createdBy: Joi.string().uuid().optional(),
  }).optional()
});

// Export all notification validation schemas
export {
  createNotificationSchema,
  updateNotificationSchema,
  notificationQuerySchema,
  bulkNotificationSchema,
  notificationPreferencesSchema,
  notificationTemplateSchema,
  notificationAnalyticsSchema,
  
  // Constants for use in other modules
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_CHANNELS
};
