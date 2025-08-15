import Joi from "joi";

// Create review validation schema
export const createReviewSchema = Joi.object({
  teacherId: Joi.string().uuid({ version: "uuidv4" }).required().messages({
    "string.uuid": "Teacher ID must be a valid UUID",
    "any.required": "Teacher ID is required",
  }),

  bookingId: Joi.string().uuid({ version: "uuidv4" }).required().messages({
    "string.uuid": "Booking ID must be a valid UUID",
    "any.required": "Booking ID is required",
  }),

  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "Rating must be a number",
    "number.integer": "Rating must be an integer",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating must be at most 5",
    "any.required": "Rating is required",
  }),

  comment: Joi.string().trim().min(10).max(2000).optional().allow("").messages({
    "string.min": "Comment must be at least 10 characters long",
    "string.max": "Comment must not exceed 2000 characters",
  }),

  isAnonymous: Joi.boolean().default(false).messages({
    "boolean.base": "Anonymous flag must be a boolean value",
  }),
});

// Update review validation schema
export const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional().messages({
    "number.base": "Rating must be a number",
    "number.integer": "Rating must be an integer",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating must be at most 5",
  }),

  comment: Joi.string().trim().min(10).max(2000).optional().allow("").messages({
    "string.min": "Comment must be at least 10 characters long",
    "string.max": "Comment must not exceed 2000 characters",
  }),

  isAnonymous: Joi.boolean().optional().messages({
    "boolean.base": "Anonymous flag must be a boolean value",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// Review query validation schema for fetching reviews
export const reviewQuerySchema = Joi.object({
  rating: Joi.alternatives()
    .try(
      Joi.number().integer().min(1).max(5),
      Joi.array().items(Joi.number().integer().min(1).max(5)).min(1).max(5),
    )
    .optional()
    .messages({
      "number.integer": "Rating must be an integer",
      "number.min": "Rating must be at least 1",
      "number.max": "Rating must be at most 5",
      "array.min": "At least one rating must be provided",
      "array.max": "Maximum 5 ratings can be provided",
    }),

  subject: Joi.string().trim().min(1).max(100).optional().messages({
    "string.min": "Subject name must be at least 1 character",
    "string.max": "Subject name must not exceed 100 characters",
  }),

  status: Joi.string()
    .valid("PENDING", "APPROVED", "REJECTED")
    .default("APPROVED")
    .messages({
      "any.only": "Status must be one of: PENDING, APPROVED, REJECTED",
    }),

  page: Joi.number().integer().min(1).default(1).messages({
    "number.integer": "Page must be an integer",
    "number.min": "Page must be at least 1",
  }),

  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    "number.integer": "Limit must be an integer",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit must not exceed 100",
  }),

  sortBy: Joi.string()
    .valid("createdAt", "rating", "updatedAt")
    .default("createdAt")
    .messages({
      "any.only": "Sort field must be one of: createdAt, rating, updatedAt",
    }),

  sortOrder: Joi.string().valid("asc", "desc").default("desc").messages({
    "any.only": "Sort order must be either asc or desc",
  }),

  includeAnonymous: Joi.boolean().default(true).messages({
    "boolean.base": "Include anonymous flag must be a boolean value",
  }),

  teacherId: Joi.string().uuid({ version: "uuidv4" }).optional().messages({
    "string.uuid": "Teacher ID must be a valid UUID",
  }),

  studentId: Joi.string().uuid({ version: "uuidv4" }).optional().messages({
    "string.uuid": "Student ID must be a valid UUID",
  }),

  bookingId: Joi.string().uuid({ version: "uuidv4" }).optional().messages({
    "string.uuid": "Booking ID must be a valid UUID",
  }),

  // Date range filters
  startDate: Joi.date().iso().optional().messages({
    "date.format": "Start date must be in ISO format",
  }),

  endDate: Joi.date().iso().min(Joi.ref("startDate")).optional().messages({
    "date.format": "End date must be in ISO format",
    "date.min": "End date must be after start date",
  }),
});

// Moderate review validation schema (Admin only)
export const moderateReviewSchema = Joi.object({
  status: Joi.string().valid("APPROVED", "REJECTED").required().messages({
    "any.only": "Status must be either APPROVED or REJECTED",
    "any.required": "Status is required",
  }),

  moderationReason: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .optional()
    .allow("")
    .messages({
      "string.min": "Moderation reason must be at least 5 characters",
      "string.max": "Moderation reason must not exceed 500 characters",
    }),
});

// Bulk review actions validation schema (Admin only)
export const bulkReviewActionSchema = Joi.object({
  reviewIds: Joi.array()
    .items(Joi.string().uuid({ version: "uuidv4" }))
    .min(1)
    .max(50)
    .required()
    .messages({
      "array.min": "At least one review ID must be provided",
      "array.max": "Maximum 50 reviews can be processed at once",
      "any.required": "Review IDs are required",
    }),

  action: Joi.string()
    .valid("APPROVE", "REJECT", "DELETE")
    .required()
    .messages({
      "any.only": "Action must be one of: APPROVE, REJECT, DELETE",
      "any.required": "Action is required",
    }),

  moderationReason: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .optional()
    .allow("")
    .messages({
      "string.min": "Moderation reason must be at least 5 characters",
      "string.max": "Moderation reason must not exceed 500 characters",
    }),
});

// Review statistics query validation schema
export const reviewStatsQuerySchema = Joi.object({
  teacherId: Joi.string().uuid({ version: "uuidv4" }).optional().messages({
    "string.uuid": "Teacher ID must be a valid UUID",
  }),

  period: Joi.string()
    .valid("week", "month", "quarter", "year", "all")
    .default("month")
    .messages({
      "any.only": "Period must be one of: week, month, quarter, year, all",
    }),

  startDate: Joi.date().iso().optional().messages({
    "date.format": "Start date must be in ISO format",
  }),

  endDate: Joi.date().iso().min(Joi.ref("startDate")).optional().messages({
    "date.format": "End date must be in ISO format",
    "date.min": "End date must be after start date",
  }),

  includeRejected: Joi.boolean().default(false).messages({
    "boolean.base": "Include rejected flag must be a boolean value",
  }),

  groupBy: Joi.string()
    .valid("rating", "subject", "teacher", "student", "date")
    .default("rating")
    .messages({
      "any.only":
        "Group by must be one of: rating, subject, teacher, student, date",
    }),
});

// Review response validation schema (for API responses)
export const reviewResponseSchema = Joi.object({
  id: Joi.string().uuid().required(),
  studentId: Joi.string().uuid().required(),
  teacherId: Joi.string().uuid().required(),
  bookingId: Joi.string().uuid().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow("").optional(),
  isAnonymous: Joi.boolean().required(),
  status: Joi.string().valid("PENDING", "APPROVED", "REJECTED").required(),
  moderationReason: Joi.string().allow("").optional(),
  createdAt: Joi.date().iso().required(),
  updatedAt: Joi.date().iso().required(),

  // Related data (when included)
  student: Joi.object({
    id: Joi.string().uuid().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    avatar: Joi.string().allow("").optional(),
  })
    .allow(null)
    .optional(),

  teacher: Joi.object({
    id: Joi.string().uuid().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    avatar: Joi.string().allow("").optional(),
  }).optional(),

  booking: Joi.object({
    id: Joi.string().uuid().required(),
    startAt: Joi.date().iso().required(),
    endAt: Joi.date().iso().optional(),
    subjectOffering: Joi.object({
      subjectName: Joi.string().required(),
      level: Joi.string().optional(),
    }).optional(),
  }).optional(),
});

// Flag review validation schema (for inappropriate content reporting)
export const flagReviewSchema = Joi.object({
  reason: Joi.string()
    .valid(
      "INAPPROPRIATE_LANGUAGE",
      "SPAM",
      "FALSE_INFORMATION",
      "HARASSMENT",
      "OFFENSIVE_CONTENT",
      "OTHER",
    )
    .required()
    .messages({
      "any.only":
        "Reason must be one of: INAPPROPRIATE_LANGUAGE, SPAM, FALSE_INFORMATION, HARASSMENT, OFFENSIVE_CONTENT, OTHER",
      "any.required": "Flagging reason is required",
    }),

  description: Joi.string().trim().min(10).max(500).optional().messages({
    "string.min": "Description must be at least 10 characters",
    "string.max": "Description must not exceed 500 characters",
  }),

  additionalContext: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow("")
    .messages({
      "string.max": "Additional context must not exceed 1000 characters",
    }),
});

// Review analytics query validation schema
export const reviewAnalyticsQuerySchema = Joi.object({
  metric: Joi.string()
    .valid(
      "rating_trends",
      "response_rates",
      "teacher_performance",
      "subject_satisfaction",
      "moderation_queue",
      "review_volume",
    )
    .required()
    .messages({
      "any.only":
        "Metric must be one of: rating_trends, response_rates, teacher_performance, subject_satisfaction, moderation_queue, review_volume",
      "any.required": "Metric is required",
    }),

  period: Joi.string()
    .valid("day", "week", "month", "quarter", "year")
    .default("month")
    .messages({
      "any.only": "Period must be one of: day, week, month, quarter, year",
    }),

  startDate: Joi.date().iso().optional().messages({
    "date.format": "Start date must be in ISO format",
  }),

  endDate: Joi.date().iso().min(Joi.ref("startDate")).optional().messages({
    "date.format": "End date must be in ISO format",
    "date.min": "End date must be after start date",
  }),

  teacherId: Joi.string().uuid({ version: "uuidv4" }).optional().messages({
    "string.uuid": "Teacher ID must be a valid UUID",
  }),

  subjectId: Joi.string().uuid({ version: "uuidv4" }).optional().messages({
    "string.uuid": "Subject ID must be a valid UUID",
  }),

  includeComparisons: Joi.boolean().default(false).messages({
    "boolean.base": "Include comparisons flag must be a boolean value",
  }),
});

// Export all schemas for use in routes
export {
  // Core review schemas
  createReviewSchema,
  updateReviewSchema,
  reviewQuerySchema,
  moderateReviewSchema,

  // Advanced functionality schemas
  bulkReviewActionSchema,
  reviewStatsQuerySchema,
  reviewResponseSchema,
  flagReviewSchema,
  reviewAnalyticsQuerySchema,
};
