import Joi from 'joi';

export const createMessageSchema = Joi.object({
  content: Joi.string()
    .trim()
    .min(1)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Message content cannot be empty',
      'string.max': 'Message content cannot exceed 2000 characters',
      'any.required': 'Message content is required'
    }),

  attachments: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().min(1).max(255).required(),
        url: Joi.string().uri().required(),
        type: Joi.string().valid('image', 'document', 'audio', 'video').required(),
        size: Joi.number().integer().min(1).max(10485760).required() // Max 10MB
      })
    )
    .max(5)
    .default([])
    .messages({
      'array.max': 'Maximum 5 attachments allowed per message'
    }),

  replyToId: Joi.string()
    .uuid()
    .optional()
    .messages({
      'string.uuid': 'Reply to message ID must be a valid UUID'
    })
});

export const createThreadSchema = Joi.object({
  studentId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.uuid': 'Student ID must be a valid UUID',
      'any.required': 'Student ID is required'
    }),

  teacherId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.uuid': 'Teacher ID must be a valid UUID',
      'any.required': 'Teacher ID is required'
    }),

  bookingId: Joi.string()
    .uuid()
    .optional()
    .messages({
      'string.uuid': 'Booking ID must be a valid UUID'
    }),

  initialMessage: Joi.string()
    .trim()
    .min(1)
    .max(2000)
    .optional()
    .messages({
      'string.min': 'Initial message cannot be empty',
      'string.max': 'Initial message cannot exceed 2000 characters'
    }),

  subject: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Subject cannot be empty',
      'string.max': 'Subject cannot exceed 200 characters'
    })
});

export const reportMessageSchema = Joi.object({
  reason: Joi.string()
    .valid(
      'SPAM',
      'HARASSMENT', 
      'INAPPROPRIATE_CONTENT',
      'SCAM',
      'VIOLENCE',
      'HATE_SPEECH',
      'OTHER'
    )
    .required()
    .messages({
      'any.only': 'Reason must be one of: SPAM, HARASSMENT, INAPPROPRIATE_CONTENT, SCAM, VIOLENCE, HATE_SPEECH, OTHER',
      'any.required': 'Report reason is required'
    }),

  description: Joi.string()
    .trim()
    .min(10)
    .max(500)
    .optional()
    .messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 500 characters'
    }),

  additionalInfo: Joi.object({
    screenshots: Joi.array().items(Joi.string().uri()).max(3).optional(),
    relatedMessageIds: Joi.array().items(Joi.string().uuid()).max(10).optional()
  })
    .optional()
});

export const messageQuerySchema = {
  threadsQuery: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .messages({
        'number.min': 'Page number must be at least 1'
      }),

    limit: Joi.number()
      .integer()
      .min(1)
      .max(50)
      .default(20)
      .messages({
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 50'
      }),

    search: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .optional()
      .messages({
        'string.min': 'Search query cannot be empty',
        'string.max': 'Search query cannot exceed 100 characters'
      }),

    unreadOnly: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'Unread only must be a boolean value'
      }),

    bookingId: Joi.string()
      .uuid()
      .optional()
      .messages({
        'string.uuid': 'Booking ID must be a valid UUID'
      }),

    isActive: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'Is active must be a boolean value'
      }),

    sortBy: Joi.string()
      .valid('updatedAt', 'createdAt', 'lastMessage')
      .default('updatedAt')
      .messages({
        'any.only': 'Sort by must be one of: updatedAt, createdAt, lastMessage'
      }),

    sortOrder: Joi.string()
      .valid('asc', 'desc')
      .default('desc')
      .messages({
        'any.only': 'Sort order must be either asc or desc'
      })
  }),

  messagesQuery: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .messages({
        'number.min': 'Page number must be at least 1'
      }),

    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(50)
      .messages({
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100'
      }),

    before: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.format': 'Before date must be in ISO format'
      }),

    after: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.format': 'After date must be in ISO format'
      }),

    status: Joi.string()
      .valid('SENT', 'DELIVERED', 'READ')
      .optional()
      .messages({
        'any.only': 'Status must be one of: SENT, DELIVERED, READ'
      }),

    senderId: Joi.string()
      .uuid()
      .optional()
      .messages({
        'string.uuid': 'Sender ID must be a valid UUID'
      }),

    hasAttachments: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'Has attachments must be a boolean value'
      }),

    search: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .optional()
      .messages({
        'string.min': 'Search query cannot be empty',
        'string.max': 'Search query cannot exceed 100 characters'
      })
  })
};

export const updateMessageSchema = Joi.object({
  content: Joi.string()
    .trim()
    .min(1)
    .max(2000)
    .optional()
    .messages({
      'string.min': 'Message content cannot be empty',
      'string.max': 'Message content cannot exceed 2000 characters'
    }),

  status: Joi.string()
    .valid('SENT', 'DELIVERED', 'READ')
    .optional()
    .messages({
      'any.only': 'Status must be one of: SENT, DELIVERED, READ'
    }),

  isReported: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'Is reported must be a boolean value'
    }),

  editReason: Joi.string()
    .trim()
    .max(200)
    .when('content', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'string.max': 'Edit reason cannot exceed 200 characters',
      'any.required': 'Edit reason is required when updating content'
    })
});

export const threadUpdateSchema = Joi.object({
  isActive: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'Is active must be a boolean value'
    }),

  subject: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Subject cannot be empty',
      'string.max': 'Subject cannot exceed 200 characters'
    }),

  priority: Joi.string()
    .valid('LOW', 'NORMAL', 'HIGH', 'URGENT')
    .optional()
    .messages({
      'any.only': 'Priority must be one of: LOW, NORMAL, HIGH, URGENT'
    })
});

export const bulkMessageActionSchema = Joi.object({
  messageIds: Joi.array()
    .items(Joi.string().uuid())
    .min(1)
    .max(100)
    .unique()
    .required()
    .messages({
      'array.min': 'At least one message ID is required',
      'array.max': 'Maximum 100 message IDs allowed',
      'array.unique': 'Message IDs must be unique',
      'any.required': 'Message IDs array is required'
    }),

  action: Joi.string()
    .valid('MARK_READ', 'MARK_UNREAD', 'DELETE', 'ARCHIVE')
    .required()
    .messages({
      'any.only': 'Action must be one of: MARK_READ, MARK_UNREAD, DELETE, ARCHIVE',
      'any.required': 'Action is required'
    }),

  reason: Joi.string()
    .trim()
    .max(200)
    .when('action', {
      is: Joi.valid('DELETE', 'ARCHIVE'),
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    })
    .messages({
      'string.max': 'Reason cannot exceed 200 characters',
      'any.unknown': 'Reason is only allowed for DELETE or ARCHIVE actions'
    })
});

export const messageStatsSchema = Joi.object({
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

  groupBy: Joi.string()
    .valid('day', 'week', 'month')
    .default('day')
    .messages({
      'any.only': 'Group by must be one of: day, week, month'
    }),

  metrics: Joi.array()
    .items(
      Joi.string().valid(
        'message_count',
        'thread_count',
        'response_time',
        'active_users',
        'reported_messages'
      )
    )
    .unique()
    .default(['message_count', 'thread_count'])
    .messages({
      'array.unique': 'Metrics must be unique',
      'any.only': 'Invalid metric specified'
    }),

  threadId: Joi.string()
    .uuid()
    .optional()
    .messages({
      'string.uuid': 'Thread ID must be a valid UUID'
    }),

  userId: Joi.string()
    .uuid()
    .optional()
    .messages({
      'string.uuid': 'User ID must be a valid UUID'
    })
});

export const attachmentUploadSchema = Joi.object({
  file: Joi.object()
    .required()
    .messages({
      'any.required': 'File is required'
    }),

  type: Joi.string()
    .valid('image', 'document', 'audio', 'video')
    .required()
    .messages({
      'any.only': 'File type must be one of: image, document, audio, video',
      'any.required': 'File type is required'
    }),

  description: Joi.string()
    .trim()
    .max(200)
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 200 characters'
    })
});

export default {
  createMessageSchema,
  createThreadSchema,
  reportMessageSchema,
  messageQuerySchema,
  updateMessageSchema,
  threadUpdateSchema,
  bulkMessageActionSchema,
  messageStatsSchema,
  attachmentUploadSchema,
};
